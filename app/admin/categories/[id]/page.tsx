import { auth } from "@/auth"
import CategoryForm from "@/components/admin/category-form"
import { getCategoryById } from "@/lib/actions/category.action"
import { requireAdmin } from "@/lib/auth-guard"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata:Metadata = {
    title:"Update Category"
}


export default async function AdminCategoryUpdatePage(props:{
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

    const category = await getCategoryById(id)
    if(!category) return notFound()
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update Category</h1>
      <CategoryForm type="Update" category={category} categoryId={category.id} />
    </div>
  )
}
