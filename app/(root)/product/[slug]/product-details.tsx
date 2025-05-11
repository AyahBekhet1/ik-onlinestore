"use client";

import AddToCart from "@/components/shared/product/addToCart";
import ProductColor from "@/components/shared/product/productColor";
import ProductImages from "@/components/shared/product/productImages";
import ProductPrice from "@/components/shared/product/productPrice";
import { convertToPlainObj } from "@/lib/utils";
import {  CartItem, Product } from "@/types";
import { useEffect, useState } from "react";

type Props = {
    product: Product;
  cart: {
    items: CartItem[];
    itemsPrice: string;
    totalPrice: string;
    shippingPrice: string;
    sessionCartId: string;
    userId?: string;
  };
};

export default function ProductDetails({
  cart,
  product,
}: Props) {
  const [chosenColor, setChosenColor] = useState("");

  useEffect(() => {
  }, [chosenColor]);

  return (
    <section className='wrapper mt-28'>
        <h2 className="text-center text-3xl mb-5">{product.category}</h2>
      <div className='grid grid-cols-1 md:grid-cols-5'>
        <div className='col-span-2 w-50'>
          <ProductImages images={product.images} />
        </div>
        <div className='col-span-2 p-5'>
          <div className='flex flex-col gap-6'>
            <h1 className='h3-bold'>{product.name}</h1>
            <div className=' gap-3 flex flex-row items-center justify-between'>
              <ProductPrice
                value={Number(product.price)}
                className='w-24 rounded-xl bg-green-100 text-green-700 px-3 py-2'
              />
              <ProductColor
                product={convertToPlainObj(product)}
                chosenColor={chosenColor}
                setChosenColor={setChosenColor}
              />
            </div>
          </div>
          <div className='mt-10'>
            <p className='font-semibold'>Description</p>
            <p className="mb-10">{product.description}</p>
          </div>
           
              {product.stock > 0 && (
                <div className='flex-center'>
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
        </div>
      </div>
    </section>
  );
}
