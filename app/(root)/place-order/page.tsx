import { auth } from "@/auth"
import CheckoutSteps from "@/components/shared/checkout-steps"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getMyCart } from "@/lib/actions/cart.actions"
import { getUserById } from "@/lib/actions/user.action"
import { formateCurrency } from "@/lib/utils"
import { ShippingAddress } from "@/types"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import PlaceOrderForm from "./place-order-form"
import CouponApplyForm from "@/components/coupon-apply-form"


export const metadata :Metadata = {
    title:"Place Order"
}
export default async function PlaceOrderPage() {
    
    const cart = await getMyCart()

    const session = await auth()
    const userId = session?.user?.id

    if(!userId) throw new Error('User not found')

    const user = await getUserById(userId)

    if(!cart || cart.items.length ===0) redirect('/cart')
    if(!user.address) redirect('/shipping-address')  
    if(!user.paymentMethod) redirect('/payment-method')  

    const userAddress = user.address as ShippingAddress
    const cityShippingRate: Record<string, number>  = {
        cairo: 30,
        alexandria: 40,
        giza: 25,
        default: 50,
      };
    function getShippingPriceByCity (city:string){
    return cityShippingRate[city] ?? cityShippingRate['default']
    }

    const shippingPriceAccordToCity = getShippingPriceByCity(userAddress.city)
    
  return (
    <div className="wrapper mt-20">
        <CheckoutSteps current={3} />
        <h1 className="py-4 text-2xl">Place Order</h1>
        <div className="grid md:grid-cols-3 md:gap-5">
            <div className="md:col-span-2 overflow-x-auto space-y-4">
                <Card className="card">
                    <CardContent className="p-4 gap-4">
                        <h2 className="text-xl pb-4">Shipping Address</h2>
                        <p>{userAddress.fullName}</p>
                        <p>
                            {userAddress.streetAddress} , {userAddress.city} {' '}
                            {userAddress.postalCode} , {userAddress.country} {' '}

                        </p>
                        <div className="mt-3">
                            <Link href='/shipping-address'>
                                <Button variant='outline'>
                                    Edit your address
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card">
                    <CardContent className="p-4 gap-4">
                        <h2 className="text-xl pb-4">Payment Method</h2>
                        <p>{user.paymentMethod}</p>
                        
                        <div className="mt-3">
                            <Link href='/payment-method'>
                                <Button variant='outline'>
                                    Edit your payment method
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
                <Card className="card">
                   <CouponApplyForm />
                </Card>
                <Card className="card">
                    <CardContent className="p-4 gap-4">
                        <h2 className="text-xl pb-4">Order Items</h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    cart.items.map(item=>(
                                        <TableRow key={item.slug}>
                                            <TableCell>
                                                <Link href={`/product/${item.slug}`} className="flex items-center">
                                                <Image  src={item.image} alt={item.name} width={50} height={50} />
                                                <span className="px-2">{item.name}</span>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <span className="px-2">
                                                    {item.qty}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formateCurrency(item.price)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card className="card">
                    <CardContent className="p-4 gap-4 space-y-4">
                        <div className="flex justify-between">
                            <div>Items</div>
                            <div>{formateCurrency(cart.itemsPrice)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Shipping</div>
                            <div>{formateCurrency(shippingPriceAccordToCity)}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Total</div>
                            <div>{formateCurrency(Number(cart.totalPrice)+shippingPriceAccordToCity)}</div>
                        </div>
                        {Number(cart.totalPriceAfterDisc) !==0 &&
                            <div className="flex justify-between">
                            <div>Total After Discount</div>
                            <div> {formateCurrency(Number(cart.totalPriceAfterDisc)+shippingPriceAccordToCity)} </div>
                        </div>
}
                       
                        <PlaceOrderForm />
                    </CardContent>
                </Card>
            </div>
        </div>
      
    </div>
  )
}
