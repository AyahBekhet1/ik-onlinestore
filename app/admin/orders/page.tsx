import { auth } from "@/auth"
import Pagination from "@/components/shared/pagination"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteOrder, getAllOrders } from "@/lib/actions/order.action"
import { formateCurrency, formateDateTime, formatId } from "@/lib/utils"
import { Metadata } from "next"
import Link from "next/link"
import DeleteDialog from "@/components/shared/delete-dialog"
import { requireAdmin } from "@/lib/auth-guard"
import { PAGE_SIZE } from "@/lib/constants"

export const metadata:Metadata = {
    title:"Admin Orders"
}

export default async function AdminOrdersPage (props:{
    searchParams: Promise<{page:string  ;query:string}>
}) {

   await requireAdmin(); // all pages of admin 7n7otha 
    const session = await auth()
    if(session?.user.role !== 'admin') throw new Error('user is not authorized')
  
    const {page ='1' , query:searchText} = await props.searchParams
    const orders = await getAllOrders({
        page:Number(page),
        limit: PAGE_SIZE ,
      query:searchText
    });
    
    
    
  return (
    <div className='wrapper space-y-2'>
   <div className="flex items-center gap-3">
          <h1 className="h2-bold">Orders</h1>
          {searchText && (
            <div>
              Filtered by <i>&quot;{searchText}&quot;</i>{' '}
              <Link href='/admin/orders'>
              <Button size='sm'>
                  Remove Filter
              </Button>
              </Link>
            </div>
          )}
        </div>
    <div className='overflow-x-auto'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>BUYER</TableHead>
            <TableHead>DATE</TableHead>
            <TableHead>TOTAL</TableHead>
            <TableHead>PAID</TableHead>
            <TableHead>DELIVERED</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.data.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{formatId(order.id)}</TableCell>
              <TableCell>{order.user.name}</TableCell>
              <TableCell>{formateDateTime(order.createdAt).dateTime}</TableCell>
              <TableCell>{formateCurrency(order.totalPrice)}</TableCell>
              <TableCell>{order.isPaid && order.paidAt?formateDateTime(order.paidAt).dateTime : 'Not Paid'}  </TableCell>
              <TableCell>{order.isDelivered && order.deliveredAt?formateDateTime(order.deliveredAt).dateTime : 'Not Delivered'}</TableCell>
              <TableCell>
                <Button asChild  size='sm' className="px-2 mb-2">
                <Link href={`/order/${order.id}`}>
                   Details
                </Link>
                </Button>
                <DeleteDialog id={order.id} action={deleteOrder} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {
        orders.totalPages>1 && (
          <Pagination page={Number(page) || 1} totalPages={orders?.totalPages} />
        )
      }
    </div>
  </div>
  )
}
