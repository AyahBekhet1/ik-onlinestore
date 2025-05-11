// import { getAllCategory } from "@/lib/actions/category.action";
// import { getProductsByCategory } from "@/lib/actions/product.action";
// import { Category } from "@/types";
// import { notFound } from "next/navigation";
// import AddToCart from "../shared/product/addToCart";
// import ProductImages from "../shared/product/productImages";
// import ProductPrice from "../shared/product/productPrice";
// import { Card, CardContent } from "../ui/card";
// import { Badge } from "../ui/badge";
// import { getMyCart } from "@/lib/actions/cart.actions";

// export default async function CategoryProducts({
//   category,
// }: {
//   category: Category;
// }) {
//   const categories = await getAllCategory();

//   const categoryExist = categories.data.find((c) => c.slug === category.slug);
//   if (!categoryExist) notFound();

//   const products = await getProductsByCategory(category.name);

//   const cart = await getMyCart()

//   return (
//     <div>
//       {products &&
//         products.map((product) => (
//           <div key={product.id} className='wrapper mx-auto flex flex-col justify-center items-center'>
//             <section>
//               <div className='grid mx-auto grid-cols-1 md:grid-cols-5'>
//                 <div className='col-span-3 w-[50%] ms-10'>
//                   <ProductImages images={product.images} />
//                 </div>
//                 <div className='col-span-2 p-5'>
//                   <div className='flex flex-col gap-6'>
//                     <p>
//                       {product.brand} {product.category}
//                     </p>
//                     <h1 className='h3-bold'>{product.name}</h1>
//                     <div className='mb-4 text-center flex justify-start'>
//                       <span className='me-3'>Status:</span>
//                       {product.stock > 0 ? (
//                         <Badge variant='outline' className='text-center'>
//                           In Stock
//                         </Badge>
//                       ) : (
//                         <Badge variant='destructive'>Out of Stock</Badge>
//                       )}
//                     </div>
//                     <div className='flex sm:flex-row sm:items-center'>
//                     <span className='me-3'>Price:</span>
//                       <ProductPrice
//                         value={Number(product.price)}
//                         className='w-28 rounded-full bg-green-100 text-green-700 px-5 py-2'
//                       />
//                     </div>
//                   </div>
//                   <div className='mt-10'>
//                     <p className='font-semibold'>Description</p>
//                     <p>{product.description}</p>
//                   </div>
//                 </div>
                
                     
                 
//               </div>
//                 {
//                   product.stock >0&&(
//                       <div className="flex-center mt-3 w-full">
//                           <AddToCart
//                           cart={cart}
//                           item={{
//                               productId :product.id,
//                               name:product.name,
//                               slug:product.slug,
//                               image:product.images![0],
//                               qty:1,
//                               price:product.price
//                               color:
//                           }} />
//                       </div>
//                   )
//                 }
//             </section>
//           </div>
//         ))}
//     </div>
//   );
// }
