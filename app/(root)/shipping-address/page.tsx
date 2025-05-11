import { auth } from "@/auth" // to get auth and current user
import { getMyCart } from "@/lib/actions/cart.actions"  //cart items
import { Metadata } from "next"
import {redirect} from 'next/navigation'
import { ShippingAddress } from "@/types"  // we need to get the user by id
import { getUserById } from "@/lib/actions/user.action"
import ShippingAdressForm from "./shipping-address-form"
import CheckoutSteps from "@/components/shared/checkout-steps"
export const metadata:Metadata ={
    title:"Shipping Address"
}



export default async function ShippingAdressPage() {
    const cart= await getMyCart()

    if(!cart || cart.items.length === 0) redirect('/cart')
     
     const session = await auth()

     const userId = session?.user?.id;

     if(!userId) {throw new Error('No user ID')}

     const user = await getUserById(userId)   


  return (
    <div className="wrapper mt-20">
      <CheckoutSteps current={1} />
      <ShippingAdressForm address={user.address as ShippingAddress} />
    </div>
  )
}
