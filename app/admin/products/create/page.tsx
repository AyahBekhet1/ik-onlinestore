import { Metadata } from "next"
import ProductForm from "@/components/admin/product-form"

export const metadata:Metadata ={
    title:"Create Producrt"
}
export default function CreateProductPage() {
  return (
    <div className="wrapper">
      <h2 className="h2-bold">Create Product</h2>
      <div className="my-8">
        <ProductForm type='Create' />
      </div>
    </div>
  )
}
