"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formateCurrency, formateDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { updateOrderToPaidCOD, deliverOrder } from "@/lib/actions/order.action";
import { toast } from "sonner";

export default function OrderDetailsTable({
  order,
  isAdmin,
}: {
  order: Order;
  isAdmin: boolean;
}) {
  const {
    shippingAddress,
    orderitems,
    shippingPrice,
    itemsPrice,
    totalPrice,
    isDelivered,
    isPaid,
    paymentMethod,
    deliveredAt,
    paidAt,
  } = order;

  //button to mark order as paid
  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();

    return (
      <Button
        type='button'
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidCOD(order.id);
            !res.success ? toast.error(res.message) : toast(res.message);
          })
        }
      >
        {isPending ? "Processing..." : "Mark As Paid"}
      </Button>
    );
  };

  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition();

    return (
      <Button
        type='button'
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await deliverOrder(order.id);
            !res.success ? toast.error(res.message) : toast(res.message);
          })
        }
      >
        {isPending ? "Processing..." : "Mark as Delivered"}
      </Button>
    );
  };
  return (
    <>
      <h1 className='py-4 text-2xl'>Order {formatId(order.id)}</h1>
      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='col-span-2 space-y-4ontent overflow-x-auto'>
          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Payment Method</h2>
              <p className='mb-2'>{paymentMethod}</p>
              {isPaid ? (
                <Badge variant='secondary'>
                  Paid at {formateDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant='destructive'>Not paid</Badge>
              )}
            </CardContent>
          </Card>
          <Card className='my-2'>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.streetAddress} , {shippingAddress.city}
              </p>
              <p className='mb-2'>
                {shippingAddress.postalCode} , {shippingAddress.country}
              </p>
              {isDelivered ? (
                <Badge variant='secondary'>
                  Delivered at {formateDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant='destructive'>Not Delivered</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderitems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className='flex items-center'
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className='px-2'>{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className='px-2'>{item.qty}</span>
                      </TableCell>
                      <TableCell className='text-right'>
                        {formateCurrency(item.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className='py-2'>
          <Card>
            <CardContent className='p-4 gap-4 space-y-4'>
              <div className='flex justify-between'>
                <div>Items</div>
                <div>{formateCurrency(itemsPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Shipping</div>
                <div>{formateCurrency(shippingPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Total</div>
                <div>{formateCurrency(totalPrice)}</div>
              </div>
              {Number(order.totalPriceAfterDisc) !== 0 && (
                <div className='flex justify-between'>
                  <div>Total After Discount</div>
                  <div>
                    {" "}
                    {formateCurrency(Number(order.totalPriceAfterDisc))}{" "}
                  </div>
                </div>
              )}
              {/* Cash on delivery */}
              {isAdmin && !isPaid && paymentMethod === "CashOnDelivery" && (
                <MarkAsPaidButton />
              )}
              {isAdmin && isPaid && !isDelivered && (<MarkAsDeliveredButton />)}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
