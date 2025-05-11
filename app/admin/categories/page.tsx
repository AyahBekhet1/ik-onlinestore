import Link from "next/link";
import { deleteCategory, getAllCategory } from "@/lib/actions/category.action";
import { formateCurrency , formatId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/shared/pagination";
import DeleteDialog from "@/components/shared/delete-dialog";
import { requireAdmin } from "@/lib/auth-guard";
import { auth } from "@/auth";

export default async function AdminCategorysPage(props:{
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
   
    
   

    const categories = await getAllCategory({
    
      page
  })

  return (
    <div className="wrapper space-y-2">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <h1 className="h2-bold">Categories</h1>
          
        </div>
        <Button asChild variant='default'>
            <Link href='/admin/categories/create'>Create Category</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
            <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>NAME</TableHead>
                <TableHead className="w-[100px]">ACTIONS</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {
                categories.data.map((category)=>(
                    <TableRow key={category.id}>
                        <TableCell>{formatId(category.id)}</TableCell>
                        <TableCell>{category.name}</TableCell>
                        <TableCell className="flex gap-1">
                            <Button asChild variant='outline' size='sm'>
                                <Link href={`/admin/categories/${category.id}`}>
                                    Edit
                                </Link>
                            </Button>
                            <DeleteDialog id={category.id} action={deleteCategory}  />
                        </TableCell>

                    </TableRow>
                ))
            }
        </TableBody>
      </Table>
      { categories.totalPages > 1 && (
        <Pagination page={page} totalPages={categories.totalPages} />
      )}
    </div>
  )
}
