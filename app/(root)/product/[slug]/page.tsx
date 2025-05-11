import { getProductBySlug } from "@/lib/actions/product.action";
import { notFound } from "next/navigation";

import { getMyCart } from "@/lib/actions/cart.actions";
import ProductDetails from "./product-details";
import { CartItem } from "@/types";
import { convertToPlainObj } from "@/lib/utils";

type CartPreview = {
  items: CartItem[];
  itemsPrice: string;
  totalPrice: string;
  shippingPrice: string;
  sessionCartId: string;
  userId?: string;
};


export default async function ProductDetailsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();
  
  const cart = await getMyCart()
  const {items,
    itemsPrice,
    totalPrice,
    shippingPrice,
    sessionCartId,
    userId}= cart as CartPreview
    
  return(
  <div className="wrapper">
    <ProductDetails cart={{items,
    itemsPrice,
    totalPrice,
    shippingPrice,
    sessionCartId,
    userId}} product={convertToPlainObj(product)}   />
  </div>
  )
}
