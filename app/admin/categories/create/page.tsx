import { Metadata } from "next"
import CategoryForm from "@/components/admin/category-form"

export const metadata:Metadata ={
    title:"Create Category"
}
export default function CreateCategoryPage() {
  return (
    <div className="wrapper">
      <h2 className="h2-bold">Create Category</h2>
      <div className="my-8">
        <CategoryForm type='Create' />
      </div>
    </div>
  )
}
