import { Metadata } from "next";
import {  getOrderById } from "@/lib/actions/order.action";
import { notFound } from "next/navigation";
import {  ShippingAddress } from "@/types";
import OrderDetailsTable from "./order-details-table";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Order Details",
};
export default async function OrderDetailsPage(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) notFound();
   
      

  const session = await auth()
  // const totalAfter= await calculateTotalAfterCoupon(Number(order?.itemsPrice)) ||Number(order?.itemsPrice)


    

  return (
    <div className='wrapper mt-28'>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
          totalPriceAfterDisc:String(order.totalPriceAfterDisc),
        }}
        isAdmin={session?.user?.role === 'admin' || false}
      />
    </div>
  );
}
