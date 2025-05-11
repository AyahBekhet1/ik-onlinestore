"use server"

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObj, formateError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.action";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem, PaymentResult } from "@/types";
import { PAGE_SIZE } from "../constants";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getCouponById } from "./coupon.action";

//Create order and create the order Items
export async function calculateShippingPrice (address:string){
  try{

      const city = JSON.parse(address).city
      
      let price = 50; // default price
      if (city === 'alexandria') price = 40;
      else if (city === 'cairo') price = 30;
    return {
      success:true,
      price
    }
    }catch(error){
      return {
        success: false,
        message: formateError(error),
      };
    
    }
}

export async function calculateTotalAfterCoupon (originalTotal:number ){
  const cart = await getMyCart()
 
      const couponId = cart?.appliedCouponId 
      const rawCoupon = couponId ? await getCouponById(couponId) : null
  const coupon = rawCoupon ? JSON.parse(JSON.stringify(rawCoupon)) : null
  if (!coupon) return originalTotal;

  if(coupon.discountType === 'percentage'){
   
    const totalPriceAfterDisc= originalTotal * (1-coupon.discount / 100)
    await prisma.cart.update({
      where:{id:cart?.id},
      data:{totalPriceAfterDisc}
    })
    return totalPriceAfterDisc
}else{
  
  const totalPriceAfterDisc= Math.max(originalTotal - coupon.discount , 0)
    await prisma.cart.update({
      where:{id:cart?.id},
      data:{totalPriceAfterDisc}
    })
    return totalPriceAfterDisc
}


}
export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");

    const cart = await getMyCart();
    const userId = session?.user?.id;

    if (!userId) throw new Error("user not found");

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: "/cart",
      };
    }
    if (!user.address) {
      return {
        success: false,
        message: "No Shipping Address",
        redirectTo: "/shipping-address",
      };
    }
    if (!user.paymentMethod) {
      return {
        success: false,
        message: "No Payment Method",
        redirectTo: "/payment-method",
      };
    }

    const userAddress = JSON.stringify(user.address)
 const res= await calculateShippingPrice(userAddress)
 if(!res.success){
  throw new Error(res.message)
 }
 const shippingPrice = res.price;
const totalPrice = Number(cart.totalPrice) + shippingPrice!
const totalPriceAfterDisc = Number(cart.totalPriceAfterDisc) + shippingPrice!

    //create order object
   
    
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice:shippingPrice?.toString(),
      totalPriceAfterDisc:totalPriceAfterDisc.toString()?? "0",
      totalPrice:totalPrice.toString(),
    });
    

    //create transaction to create order and order items in db

    const insertedOrderId = await prisma.$transaction(async (tx) => {
      //create order
      const insertedOrder = await tx.order.create({ data: order });
      //create order Items from the cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        });
      }
      //clear cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
          appliedCouponId:'',
          totalPriceAfterDisc:0
        },
      });

      return insertedOrder.id;
    });
    if (!insertedOrderId) throw new Error("order not created");

    return {
      success: true,
      message: "order created successfully",
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      message: formateError(error),
    };
  }
}

//get order by id

export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });

  return convertToPlainObj(data);
}

//get user's orders
export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  //we only wants the order of the logged user so we get the session
  const session = await auth();
  if (!session) throw new Error("user is not authorized");
  //we use ? it means its not null so dont bother checking it
  const data = await prisma.order.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.order.count({
    where: { userId: session?.user?.id },
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

type SalesDataType = {
  month: string;
  totalSales: number;
}[];
//get sales data and order summary
export async function getOrderSummary() {
  //get counts for each resource
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.order.count();

  //calculate the total sales
  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  });
  //get monthly sales
  const salesDataRaw = await prisma.$queryRaw<Array<{ month: string; totalSales: Prisma.Decimal }>>`SELECT to_char("createdAt" ,'MM/YY') as "month" , sum("totalPrice") as "totalSales" FROM
    "Order" GROUP BY to_char("createdAt",'MM/YY')`;

  const salesData: SalesDataType = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }));
  //get latest sales
  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
    },
    take: 6,
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestSales,
    salesData,
  };
}


//get all orders

export async function getAllOrders ({ limit=PAGE_SIZE ,page ,query} :{limit?:number ; page: number ; query:string}){


  //represent where query
  const queryFilter :Prisma.OrderWhereInput = query && query !== 'all?'?{
    user:{
      name:{
        contains:query,
        mode:'insensitive'
      }as Prisma.StringFilter
    }
  }:{}  // path this as where

  const data = await prisma.order.findMany({
    where:{
      ...queryFilter
    },
    orderBy:{createdAt:"desc"},
    take:limit,
    skip:(page-1)*limit,
    include:{user:{select:{name:true}}}
  })

  //when we use pagination we need to get the data and the total pages
  const dataCount =await prisma.order.count()

  return{
    data,
    totalPages:Math.ceil(dataCount/limit)
  }
}


//delete order
export async function deleteOrder(id:string){
  try {

    await prisma.order.delete({
      where:{id}
    })

    revalidatePath('/admin/orders')

    return {success:true , message:'Order deleted successfully'}
  } catch (error) {
    return {success:false , message:formateError(error)}
  }
}

//// Update Order to Paid in Database
async function updateOrderToPaid({
  orderId,
  paymentResult
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  // Find the order in the database and include the order items
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
    },
  });

  if (!order) throw new Error('Order not found');

  if (order.isPaid) throw new Error('Order is already paid');

  // Transaction to update the order and update the product quantities
  await prisma.$transaction(async (tx) => {
    // Update all item quantities in the database
    for (const item of order.orderitems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: -item.qty } },
      });
    }

    // Set the order to paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });
}

//update COD order to paid
export async function updateOrderToPaidCOD(orderId:string){
  try {

    await updateOrderToPaid({orderId})

    revalidatePath(`/order/${orderId}`)

    return {success:true , message:'Order Paid successfully'}
  } catch (error) {
    return {success:false , message:formateError(error)}
  }
}


//update COD order to delivered 
export async function deliverOrder(orderId:string) {
  try {
    const order = await prisma.order.findFirst({
      where:{id:orderId}
    })

    if(!order) throw new Error('order not found')
    if(!order.isPaid) throw new Error('order is not paid')

      await prisma.order.update({
        where:{id:orderId},
        data:{
          isDelivered:true,
          deliveredAt:new Date(),
        }
      })

      revalidatePath(`/order/${orderId}`)


    return {success:true , message:'Order delivery updated successfully'}
  } catch (error) {
    return {success:false , message:formateError(error)}
  }
}