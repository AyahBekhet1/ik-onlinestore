import { getAllCategory } from "@/lib/actions/category.action";
import CategoryClient from "./category-client";
import { notFound } from "next/navigation";
import {  getProductsByCategory } from "@/lib/actions/product.action";
import { getMyCart } from "@/lib/actions/cart.actions";
import ProductCardCarousel from "@/components/productCardCarousel/product-card-carousel";
import { convertToPlainObj } from "@/lib/utils";

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const categories = await getAllCategory();
  if (!categories) notFound()

const cart = await getMyCart();


const category = categories.data.find((c)=>c.slug === slug)
if (!category) notFound()
  const productsSpecificToCategory = await getProductsByCategory(category.name);
  
  const currentIndex = categories.data.findIndex((c)=>c.slug === slug)

  const nextIndex = (currentIndex+1) % categories.data.length
  const prevIndex = (currentIndex -1 +categories.data.length ) % categories.data.length

  const nextCategory = categories.data[nextIndex]
  const prevCategory = categories.data[prevIndex]

  return (
    <>
  <CategoryClient category={category}
  nextCategory={nextCategory}
  prevCategory={prevCategory} 
  
  categories={categories.data}
  productCrousel ={<ProductCardCarousel
        products={productsSpecificToCategory.map(convertToPlainObj)}
        cart={cart}
      />}

   />  
  </>
 

  )
}
