import { Metadata } from "next";
import { getMyOrders } from "@/lib/actions/order.action";
import { formateCurrency, formateDateTime, formatId } from "@/lib/utils";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/shared/pagination";

export const metadata: Metadata = {
  title: "My Orders",
};
export default async function OrdersPage(props: {
  searchParams: Promise<{ page: string }>;
}) {
  const { page } = await props.searchParams;

  const orders = await getMyOrders({
    page: Number(page) || 1,
  });

  return (
    <div className='wrapper space-y-2'>
      <h2 className='h2-bold'>My Orders</h2>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
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
                <TableCell>{formateDateTime(order.createdAt).dateTime}</TableCell>
                <TableCell>{formateCurrency(order.totalPrice)}</TableCell>
                <TableCell>{order.isPaid && order.paidAt?formateDateTime(order.paidAt).dateTime : 'Not Paid'}  </TableCell>
                <TableCell>{order.isDelivered && order.deliveredAt?formateDateTime(order.deliveredAt).dateTime : 'Not Delivered'}</TableCell>
                <TableCell>
                  <Link href={`/order/${order.id}`}>
                  <Button type="button"  className="px-2">
                     Details
                  </Button>
                  </Link>
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
  );
}
