"use client";
import { Cart } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formateCurrency } from "@/lib/utils";

export default function CartTable({ cart }: { cart?: Cart }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className='wrapper mt-20'>
      <h1 className='py-4 h2-bold'>Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is Empty.{" "}
          <Link href='/' className='font-bold'>
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className='grid gap-5'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Item</TableHead>
                  <TableHead className="text-center">Item Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell className='col-span-2 '>
                      <Link
                        href={`/product/${item.slug}`}
                        className='flex items-center mb-2'
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                      </Link>
                      <div className='flex justify-center items-center space-x-2'>
                        <Button
                          disabled={isPending}
                          variant='outline'
                          type='button'
                          className='p-2'
                          onClick={() =>
                            startTransition(async () => {
                              const res = await removeItemFromCart(
                                item.productId
                              );
                              if (!res.success) {
                                toast.error(res.message);
                                return;
                              }
                              toast(res.message, {
                                className: "text-center",
                                duration: 4000,
                                cancel: {
                                  label: "close",
                                  onClick: () => console.log("Cancel!"),
                                },
                              });
                              return;
                            })
                          }
                        >
                          {isPending ? (
                            <Loader className='h-4 w-4 animate-spin' />
                          ) : (
                            <Minus className='h-4 w-4  animate-in' />
                          )}
                        </Button>
                        <span>{item.qty}</span>
                        <Button
                          disabled={isPending}
                          variant='outline'
                          type='button'
                          className='p-2'
                          onClick={() =>
                            startTransition(async () => {
                              const res = await addItemToCart(item);
                              if (!res.success) {
                                toast.error(res.message);
                                return;
                              }
                              toast(res.message, {
                                className: "text-center",
                                duration: 4000,
                                cancel: {
                                  label: "close",
                                  onClick: () => console.log("Cancel!"),
                                },
                              });
                              return;
                            })
                          }
                        >
                          {isPending ? (
                            <Loader className='h-4 w-4 animate-spin' />
                          ) : (
                            <Plus className='h-4 w-4 animate-in' />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className=' flex flex-col justify-center items-center'>
                      <span className='px-2 mb-5 text-[14px] md:text-[16px]'>
                        {item.name}
                      </span>
                      <p className="mb-5">{formateCurrency(item.price)}</p>
                      <div
            style={{ backgroundColor: `${item.color}` }}
            className={`w-5 h-5 cursor-pointer rounded-full ` }
            
        
          ></div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className='p-4 gap-4'>
              <div className='pb-3 text-xl flex justify-between md:flex-col'>
                Subtotal: ({cart.items.reduce((acc, item) => acc + item.qty, 0)}
                )
                <div className='font-bold'>
                  {formateCurrency(cart.itemsPrice)}
                 
                </div>
              </div>
              <Button
                className='w-full'
                disabled={isPending}
                onClick={() =>
                  startTransition(() => router.push("/shipping-address"))
                }
              >
                {isPending ? (
                  <Loader className='w-4 h-4 animate-spin' />
                ) : (
                  <ArrowRight className='w-4 h-4' />
                )}{" "}
                To Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
