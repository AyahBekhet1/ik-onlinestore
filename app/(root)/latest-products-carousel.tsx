"use client";

import {CartItem, Product } from "@/types";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { convertToPlainObj } from "@/lib/utils";
import ProductColor from "@/components/shared/product/productColor";
import ProductPrice from "@/components/shared/product/productPrice";
import AddToCart from "@/components/shared/product/addToCart";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import ClassNames from 'embla-carousel-class-names'

type Props = {
  data: Product[];
  cart: {
    items: CartItem[];
    itemsPrice: string;
    totalPrice: string;
    shippingPrice: string;
    sessionCartId: string;
    userId?: string;
  };
};
export default function LatestProductsCarousel({ data, cart }: Props) {
  const [emblaRef , emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 }),ClassNames()]);

  const [chosenColor, setChosenColor] = useState("");

  const scrollPrev = useCallback(()=>{
    if(emblaApi) emblaApi.scrollPrev()
  },[emblaApi])

  const scrollNext=useCallback(()=>{
    if(emblaApi) emblaApi.scrollNext()
  },[emblaApi])

  useEffect(() => {
  }, [chosenColor]);
  return (
    <div className=' embla overflow-hidden' >
        <h2 className="uppercase text-2xl md:text-[24px]  lg:text-4xl font-bold text-center my-8">Check Our Latest Products</h2>
      <div className='embla-viewport  max-w-60 md:max-w-72 mt-12 mx-auto h-auto' ref={emblaRef}>
        <div className='embla-container h-full'>
          {data.map((product) => (
            <Card className=' h-auto w-60 md:max-w-72 shadow-xl mx-3 embla-slide overflow-hidden ' key={product.id}>
              <CardHeader className='p-0 items-center'>
                <Link href={`/product/${product.slug}`}>
                  <div className='relative w-[256px] h-[256px]'>
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className='object-contain'
                      priority={true}
                    />
                  </div>
                </Link>
              </CardHeader>
              <CardContent className='p-4 grid gap-4'>
                <Link href={`/product/${product.slug}`}>
                  <h2 className='text-base font-bold text-center mb-3'>
                    {product.name}
                  </h2>
                </Link>
                <ProductColor
                  product={convertToPlainObj(product)}
                  chosenColor={chosenColor}
                  setChosenColor={setChosenColor}
                />
              </CardContent>
              <CardFooter className='flex justify-between items-center'>
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
                        color: chosenColor,
                      }}
                    />
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center space-x-5 my-8">

      <Button className="embla-prev" onClick={scrollPrev}>Prev</Button>
      <Button className="embla-next" onClick={scrollNext}>Next</Button>
      </div>
    </div>
  );
}
