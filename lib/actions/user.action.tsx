'use server'

import { PaymentMethodSchema, shippingAddressSchema, signInFormSchema , signUpFormSchema, updateProfilePassswordSchema, updateProfileSchema, updateUserSchema} from "../validators"
import { auth, signIn , signOut } from "@/auth"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { hashSync } from "bcrypt-ts-edge"
import { prisma } from "@/db/prisma"
import { formateError } from "../utils"
import { ShippingAddress } from "@/types"
import { z } from "zod"
import { getMyCart } from "./cart.actions"
import { cookies } from "next/headers"
import { PAGE_SIZE } from "../constants"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

//sign in user with credentials
export async function signInWithCredentials (prevState:unknown , formData:FormData){
    try {
        const user = signInFormSchema.parse({
            email:formData.get('email'),
            password:formData.get('password')
        })

        await signIn('credentials' , user)
         await getMyCart();

        return {success:true , message:"Signed in successfully"}
    } catch (error) {
        if(isRedirectError(error)){
            throw error
        }
    }
    return {success:false , message:"Invalid email or password"}
}

export async function signInWithGoogle (prevState:unknown , formData:FormData){
    try {
     

        await signIn('google')

        return {success:true , message:"Signed in successfully"}
    } catch (error) {
        if(isRedirectError(error)){
            throw error
        }
    }
    return {success:false , message:"Invalid email or password"}
}



// sign user out
export async function signOutUser(){
 // get current users cart and delete it so it does not persist to next user
//  const currentCart = await getMyCart();

//  if (currentCart && !currentCart.userId) {
//     // Delete only guest cart
//     await prisma.cart.delete({ where: { id: currentCart.id } });
//   }

const cookieStore =await cookies()

  // Remove sessionCartId from cookies
 cookieStore.delete('sessionCartId')
  await signOut();
}


export async function signUpUser(prevState:unknown , formData:FormData) {
    try {
        const user = signUpFormSchema.parse({
            name:formData.get('name'),
            email:formData.get('email'),
            password:formData.get('password'),
            confirmPassword:formData.get('confirmPassword')
        })

        const plainPassword = user.password

        user.password= hashSync(user.password,10)

        await prisma.user.create({
            data:{
                name:user.name,
                email:user.email,
                password:user.password
            }
        })

        await signIn('credentials' ,{
            email:user.email,
            password:plainPassword,
        } )

        return {success:true , message:"User registered successfully"}
    } catch (error) {
    
        if(isRedirectError(error)){
            throw error
        }
        return {success:false , message:formateError(error)}
    }
}


//get user by id
export async function getUserById(userId:string) {
    const user = await prisma.user.findFirst({
        where:{id:userId}
    })
    if(!user) throw new Error('User not found');
    return user;
}

//updte the users address
export async function updateUserAddress (data:ShippingAddress){
    try {
        const session = await auth()
        const currentUser = await prisma.user.findFirst({
            where:{id:session?.user?.id}
        })
        if(!currentUser) throw new Error('User not found')
         
        const address = shippingAddressSchema.parse(data)    

        await prisma.user.update({
            where :{id:currentUser.id},
            data:{address}
        })

        return {
            success:true,
            message:"User updated successfully"
        }
    } catch (error) {
        return{
            success:"false",
            message:formateError(error)
        }
    }
}


//update user's payment method
export async function UpdateUserPaymentMethod(data:z.infer<typeof PaymentMethodSchema>) {
    try {
        const session = await auth()
        const currentUser = await prisma.user.findFirst({
            where:{id:session?.user?.id}
        })
        if(!currentUser) throw new Error('user not found')

        const paymentMethod = PaymentMethodSchema.parse(data) 
        
        await prisma.user.update({
            where:{id:currentUser.id},
            data:{paymentMethod:paymentMethod.type}
        })
        return {
            success:true,
            message:'User updated successfully'
        }
        
    } catch (error) {
        return {success:false , message:formateError(error)}
    }
}


//Update the user Profile
export async function updateProfile (data:{name:string; email:string ; password:string}){
    try {
        const session = await auth()
        const currentUser =await prisma.user.findFirst({
            where:{id:session?.user?.id}    
        })

        const user = updateProfilePassswordSchema.parse(data)

        if(!currentUser) throw new Error('User Not Found')
         const hashedPass= hashSync(user.password,10)

         await prisma.user.update({
            where:{
                id:currentUser.id
            },
            data:{
                name:user.name,
                password: hashedPass

            }
         })  
         
         return{
            success:true,
            message:'User updated successfully'
        }
    } catch (error) {
        return{
            success:false,
            message:formateError(error)
        }
    }
}
export async function updateProfilePassword (data:{name:string ; email:string ; password:string}){
   try {
    const session= await auth()
    const currentUser = await prisma.user.findFirst({
        where:{id:session?.user?.id}
    })
    if(!currentUser) throw new Error('User not Found')

    const user = updateProfilePassswordSchema.parse(data)
   const hashedPass= hashSync(user.password,10)

    await prisma.user.update({
        where:{id:currentUser.id},
        data:{password:hashedPass }
    })

    return{
        success:true,
        message:'Password updated successfully'
    }

   } catch (error) {
    return {
        success:false,
        message:formateError(error)
    }
   }
    
}

//Get all the users
export async function getAllUsers({
    limit=PAGE_SIZE,
    page,
    query
}:{limit?:number ; page:number ; query:string}){

    const queryFilter:Prisma.UserWhereInput =
     query && query !== 'all'?
    {
            name:{
                contains:query,
                mode:"insensitive"
            }as Prisma.StringFilter
        
    }:{}

    const data = await prisma.user.findMany({
        where:{
            ...queryFilter
        },
        orderBy:{createdAt:'desc'},
        take:limit,
        skip:(page-1)*limit
    })

    const dataCount = await prisma.user.count();
    return {
        data,
        totalPages:Math.ceil(dataCount/limit)
    }
}

//delete user
export async function deleteUser (userId:string){
try {
  await prisma.user.delete({
        where:{id:userId}
    })
        revalidatePath('/admin/users')
    return {
        success:true,
        message:"User deleted successfully"
    }    
    
} catch (error) {
    return {
        success:false,
        message:formateError(error)
    }
}

}

// Update a user
export async function updateUser(user:z.infer<typeof updateUserSchema>){
    try {
        await prisma.user.update({
            where:{id:user.id},
            data:{
                name:user.name,
                role:user.role
            }
        })

        revalidatePath('/admin/users')
        return {
            success:true,
            message:"User updated successfully"
        }  
        

    } catch (error) {
        return {
            success:false,
            message:formateError(error)
        }
    }
}