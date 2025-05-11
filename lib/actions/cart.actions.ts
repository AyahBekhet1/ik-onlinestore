"use server";

import { cookies } from "next/headers";
import { CartItem } from "@/types";
import { convertToPlainObj, formateError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

//calculate cart prices
const calcPrice = (items:CartItem[])=>{
  const itemsPrie = round2(
    items.reduce((acc, item)=>acc+Number(item.price)*item.qty ,0)
  ),
  shippingPrice = 0,
  totalPrice = round2(itemsPrie+shippingPrice)

  return {
    itemsPrice:itemsPrie.toFixed(2),
    shippingPrice:shippingPrice.toFixed(2),
    totalPrice:totalPrice.toFixed(2),
  }


}

//add item to cart in db
export async function addItemToCart(data: CartItem) {
  try {
//1      //check for cart cookie
        const sessionCartId =(await cookies()).get('sessionCartId')?.value
        if(!sessionCartId) throw new Error('Cart session not found')

//2      //Get session and user Id
        const session = await auth()
        //its ok to get undefined 3shan mmkn yb2a guest   
        const userId = session?.user?.id ? (session.user.id as string) : undefined  //it will be undifiend when u r not logged in

//3      //get cart 
         const cart = await getMyCart()

//4      //parse and validate item
         const item = cartItemSchema.parse(data)
        
//5      //find product in db
         const product = await prisma.product.findFirst({
            where:{id:item.productId}
         })

         if(!product) throw new Error('Product Not Found')

          if(!cart){
//6         // create new cart object
            const newCart =insertCartSchema.parse({
              userId:userId,
              items:[item],
              sessionCartId:sessionCartId,
              ...calcPrice([item])
            })
//7         // add to db
           await prisma.cart.create({
            data:newCart
           })

//8         //revalidate product page talma 7atina 7aga aw 3'yrna 7aga fl db lazm n3ml revalidatePath
           revalidatePath(`/product/${product.slug}`)

           return {
            success: true,
            message: `${product.name} added to cart`,
          };
          } else{
//9       //check if item is already in the cart
            const existItem = (cart.items as CartItem[]).find((x)=>x.productId === item.productId);

            if(existItem){
//9-a.       //check stock
             if(product.stock < existItem.qty +1){
              throw new Error('Not enough stock')
             }
              
//9-b.        //increase Qty
              (cart.items as CartItem[]).find(x=>x.productId === item.productId)!.qty = existItem.qty+1
              }else{
//10            //if item doesn't exist in cart
//10-a.         //check stock 
                  if(product.stock <1) throw new Error('Not enough stock')
                  
//10-b.         // add item to cart.items
                cart.items.push(item)
              }

//11 for 9 & 10   //save to db
              await prisma.cart.update({
                where:{id:cart.id},
                data:{ 
                  items:cart.items as Prisma.CartUpdateitemsInput[],
                  ...calcPrice(cart.items as CartItem[])
                }
              })
//12
              revalidatePath(`/product/${product.slug}`)
//13 FINAL
                return{
                success:true,
                message:`${product.name} ${existItem as CartItem? 'updated in' : 'added to'} cart`
              }  
            }
          }

   catch (error) {
    return {
      success: false,
      message: formateError(error),
    };
  }
}

// choose color of cart Item
export async function chooseColor({productId , color}: {productId:string ; color:string}) {
  try {
    //1  //check for cart cookie
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if(!sessionCartId) throw new Error('Cart session not found')
    
    //2 //Get Product from db
        const product = await prisma.product.findFirst({
          where:{
            id:productId
          }
        })
        if(!product) throw new Error('Product not found')
    
    //3 //Get user cart
        const cart = await getMyCart()
        if(!cart) throw new Error('Cart not found')
    
    //4  //check for item if it exist in cart
        const exist = (cart.items as CartItem[]).find(x=>x.productId === productId)
        if(!exist) throw new Error('item not found')
    
    //5 //check if only one in qty
        if(exist.color){
          //remove from cart
         (cart.items as CartItem[]).find(x=>x.productId === productId)!.color =color
        }
    
    //7  //update cart in db
    
        await prisma.cart.update({
          where:{id : cart.id},
          data:{
            items:cart.items as Prisma.CartUpdateitemsInput[]
          }
        })
    //8
        revalidatePath(`product/${product.slug}`)
    
    //9
        return{
          success:true,
          message:`${product.name} was removed from cart`
        }
      } catch (error) {
        return {
          success:false,
          message:formateError(error)
        }
      }
}

//get user cart from db
export async function getMyCart() {
    //check for cart cookie
    const sessionCartId =(await cookies()).get('sessionCartId')?.value
    if(!sessionCartId) return undefined

    //Get session and user Id
    const session = await auth()   
    const userId = session?.user?.id ? (session.user.id as string) : undefined  //it will be undifiend when u r not logged in

    //Get user cart from db
    const cart = await prisma.cart.findFirst({
        where:userId ? {userId:userId} : {sessionCartId:sessionCartId}
    })

    if(!cart) return undefined

    //convert decimals values to string and return
    return convertToPlainObj({
        ...cart ,
        items :cart.items as CartItem[],
        itemsPrice:cart.itemsPrice.toString(),
        totalPrice:cart.totalPrice.toString(),
        shippingPrice:cart.shippingPrice.toString(),
    })
}

export async function removeItemFromCart(productId:string) {
  try {
//1  //check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if(!sessionCartId) throw new Error('Cart session not found')

//2 //Get Product from db
    const product = await prisma.product.findFirst({
      where:{
        id:productId
      }
    })
    if(!product) throw new Error('Product not found')

//3 //Get user cart
    const cart = await getMyCart()
    if(!cart) throw new Error('Cart not found')

//4  //check for item if it exist in cart
    const exist = (cart.items as CartItem[]).find(x=>x.productId === productId)
    if(!exist) throw new Error('item not found')

//5 //check if only one in qty
    if(exist.qty === 1){
      //remove from cart
      cart.items = (cart.items as CartItem[]).filter(x=>x.productId !== exist.productId)
    }else{
//6    //decrease qty
      (cart.items as CartItem[]).find(x=>x.productId ===productId)!.qty = exist.qty -1 
    }

//7  //update cart in db

    await prisma.cart.update({
      where:{id : cart.id},
      data:{
        items:cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[])
      }
    })
//8
    revalidatePath(`product/${product.slug}`)

//9
    return{
      success:true,
      message:`${product.name} was removed from cart`
    }
  } catch (error) {
    return {
      success:false,
      message:formateError(error)
    }
  }
}