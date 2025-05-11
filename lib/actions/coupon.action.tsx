

'use server'

import { z } from "zod";
import { insertCouponSchema, updateCouponSchema } from "../validators";
import { convertToPlainObj, formateError } from "../utils";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.action";

export async function createCoupon(data:z.infer<typeof insertCouponSchema>) {
    try{
        const coupon = insertCouponSchema.parse(data)
        await prisma.coupon.create({
            data:coupon
        })

        revalidatePath('/admin/coupons')
        return {
            success:true,
            message:"Coupon created successfully"
        }
    }catch(error){
        return {
            success:false,
            message:formateError(error)
        }
    }
}

//get all copons
export async function getAllCoupons({
  limit = PAGE_SIZE,
  page = 1,
}: {
  limit?: number;
  page?: number;
}={}) {
  const safeLimit = Math.max(limit ?? PAGE_SIZE, 1);
  const safePage = Math.max(page ?? 1, 1);
  const skip = (safePage - 1) * safeLimit;

  const data = await prisma.coupon.findMany({
    skip,
    take: safeLimit,
  });

  const dataCount = await prisma.coupon.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / safeLimit),
  };
}

//delete coupon
export async function deleteCoupon(id: string) {
    try {
      const couponExist = await prisma.coupon.findFirst({
        where: { id },
      });
  
      if (!couponExist) throw new Error("coupon not found");
  
      await prisma.coupon.delete({
        where: { id },
      });
  
      revalidatePath("/admin/coupons");
      return { success: true, message: "coupon deleted successfully" };
    } catch (error) {
      return { success: false, message: formateError(error) };
    }
  }

  //get single coupon by it's Id
  
  export async function getCouponById(couponId: string) {
    const data = await prisma.coupon.findFirst({
      where: {
        id: couponId,
      },
    });
  
    return convertToPlainObj(data);
  }

  export async function updateCoupon(data: z.infer<typeof updateCouponSchema>) {
    try {
      const coupon = updateCouponSchema.parse(data);
  
      const couponExist = await prisma.coupon.findFirst({
        where: { id: coupon.id },
      });
  
      if (!couponExist) throw new Error("Coupon not found");
  
      await prisma.coupon.update({
        where: { id: coupon.id },
        data: coupon,
      });
  
      revalidatePath("/admin/coupons");
      return { success: true, message: "coupon updated successfully" };
    } catch (error) {
      return { success: false, message: formateError(error) };
    }
  }
  //Applay coupon

  export async function applyCoupon ({code}:{code:string}){
    try {
        const session = await auth();
          if (!session) throw new Error("User not authenticated");
      
          const cart = await getMyCart();
          const userId = session?.user?.id;
      
          if (!userId) throw new Error("user not found");
          if (!cart) throw new Error("cart not found");
      
      const coupon = await prisma.coupon.findUnique({
        where:{code}
      })
      if(!coupon) throw new Error('Invalid coupon')

        if (coupon.usedBy.includes(userId)) {
          return { success: false, message: "You have already used this coupon" };
        }
      
      if (coupon.expiresAt && new Date() > coupon.expiresAt)   throw new Error('Coupon Expired')
      if(coupon.maxUses !== null && coupon.uses >= coupon.maxUses)   throw new Error('Coupon limit reached')
  
     await prisma.coupon.update({
      where:{id:coupon.id},
      data:
      {
        uses:{increment:1},
        usedBy:{
          push:userId
        }
    }
     })

     await prisma.cart.update({
      where:{id:cart.id},
      data:{appliedCouponId : coupon.id}
     })

     return {
      success:true,
      message:"Coupon Applied",
      
     }
    } catch (error) {
      return { success: false, message: formateError(error) };
    }
   

  }