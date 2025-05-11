import { Metadata } from "next"
import CouponForm from "@/components/admin/coupon-form"

export const metadata:Metadata ={
    title:"Create Coupon"
}
export default function CreateCouponPage() {
  return (
    <div className="wrapper">
      <h2 className="h2-bold">Create Coupon</h2>
      <div className="my-8">
        <CouponForm type='Create' />
      </div>
    </div>
  )
}
