import { auth } from "@/auth"
import CouponForm from "@/components/admin/coupon-form"
import { getCouponById } from "@/lib/actions/coupon.action"
import { requireAdmin } from "@/lib/auth-guard"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata:Metadata = {
    title:"Update Coupon"
}


export default async function AdminCouponUpdatePage(props:{
    params:Promise<{
        id:string
    }>
}) {

   await requireAdmin(); // all pages of admin 7n7otha 
    const session = await auth()
  
    if(session?.user.role !=='admin'){
      throw new Error('User is not auhorized')
    }

    const {id} = await props.params

    const coupon = await getCouponById(id)
    if(!coupon) return notFound()
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update Coupon</h1>
      <CouponForm type="Update" coupon={{...coupon,maxUses:coupon.maxUses??0}} couponId={coupon.id} />
    </div>
  )
}
