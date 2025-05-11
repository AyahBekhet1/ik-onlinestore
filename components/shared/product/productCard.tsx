'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import ProductPrice from "./productPrice";
import { Cart, Product } from "@/types";
import AddToCart from "./addToCart";
import ProductColor from "./productColor";
import { convertToPlainObj } from "@/lib/utils";
import { forwardRef } from "react";

  interface CardProps {
    id: string;
    product: Product;
    cart?: Cart | undefined;
    style: React.CSSProperties;
  }


const ProductCard =forwardRef<HTMLDivElement , CardProps>(({ product , cart , style ,id} , ref)=> {


  const [chosenColor, setChosenColor] = useState("");

  useEffect(()=>{

  },[chosenColor])
  

  return (
    <div className=' absolute w-72 card top-28 left-1/2 -translate-x-1/2  ' id={id} style={style} ref={ref}>
      <div className="card-wrapper">

       <Card className=' h-auto w-72  rounded-3xl shadow-xl mb-5 '>
        <CardHeader className='p-0 items-center'>
          <Link href={`/product/${product.slug}`}>
            <div className='relative w-[256px] h-[256px]'>
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className='object-cover'
                priority={true}
                />
            </div>
          </Link>
        </CardHeader>
        <CardContent className='p-4 grid gap-4'>
          <Link href={`/product/${product.slug}`}>
            <h2 className='text-base font-bold text-center mb-3'>{product.name}</h2>
          </Link>
           <ProductColor product={convertToPlainObj(product)} chosenColor={chosenColor} setChosenColor={setChosenColor} />
         
        </CardContent>
        <CardFooter className="flex justify-between items-center">
        {product.stock > 0 ? (
          <ProductPrice value={Number(product.price)} />
        ) : (
          <p className='text-destructive'>Out Of Stock</p>
        )}
          {product.stock > 0 && (
            <div className=''>
              <AddToCart
                 cart={cart}
                 item={{
                   productId: product.id,
                   name: product.name,
                   slug: product.slug,
                   image: product.images![0],
                   qty: 1,
                   price: product.price,
                   color:chosenColor 
                  }}
                  />
            </div>
          )}
        </CardFooter>
      </Card> 
          </div>
    </div>
  );
}
)

ProductCard.displayName = "ProductCard";
export default ProductCard