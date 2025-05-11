import { auth } from '@/auth'
import DeleteDialog from '@/components/shared/delete-dialog'
import Pagination from '@/components/shared/pagination'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { deleteCoupon, getAllCoupons } from '@/lib/actions/coupon.action'
import { requireAdmin } from '@/lib/auth-guard'
import { formatId } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

export default async function AdminCouponPage(props:{
  searchParams:Promise<{
      page:string
  }>
}) {

  const searchParams = await props.searchParams
      
    const page=Number(searchParams.page) || 1
  
       await requireAdmin(); // all pages of admin 7n7otha 
        const session = await auth()
      
        if(session?.user.role !=='admin'){
          throw new Error('User is not auhorized')
        }
     
      
     
  
      const coupons = await getAllCoupons({
      
        page
    })
  
    return (
      <div className="wrapper space-y-2">
        <div className="flex-between">
          <div className="flex items-center gap-3">
            <h1 className="h2-bold">Coupons</h1>
            
          </div>
          <Button asChild variant='default'>
              <Link href='/admin/coupons/create'>Create Coupon</Link>
          </Button>
        </div>
        <Table>
          <TableHeader>
              <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>CODE</TableHead>
                  <TableHead className="w-[100px]">ACTIONS</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
              {
                  coupons.data.map((coupon)=>(
                      <TableRow key={coupon.id}>
                          <TableCell>{formatId(coupon.id)}</TableCell>
                          <TableCell>{coupon.code}</TableCell>
                          <TableCell className="flex gap-1">
                              <Button asChild variant='outline' size='sm'>
                                  <Link href={`/admin/coupons/${coupon.id}`}>
                                      Edit
                                  </Link>
                              </Button>
                              <DeleteDialog id={coupon.id} action={deleteCoupon}  />
                          </TableCell>
  
                      </TableRow>
                  ))
              }
          </TableBody>
        </Table>
        { coupons.totalPages > 1 && (
          <Pagination page={page} totalPages={coupons.totalPages} />
        )}
      </div>
    )
}
