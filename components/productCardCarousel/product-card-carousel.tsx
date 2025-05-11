"use client";
import {  useLayoutEffect, useRef, useState } from "react";

import ProductCard from "../shared/product/productCard";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Cart, Product } from "@/types";
import { convertToPlainObj } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export default function ProductCardCarousel({
  products,
  cart,
 
}: {
  products: Product[];
  cart?: Cart | undefined;
  
}) {
  const container = useRef<HTMLDivElement | null>(null);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [listWidth, setListWidth] = useState<number | null>(null);
  const [positions, setPositions] = useState<number[] | null>([]);
  const [rotations, setRotations] = useState<number[] | null>([]);

  // if (!cart) return null;



useLayoutEffect(() => {
    if (cardRefs.current[0]) {
      const width = cardRefs.current[0].offsetWidth;
      
      setListWidth((products.length-1)*width)
      setPositions(Array.from({ length: products.length }, (_, i) => i * (width +32)));
      setRotations(Array.from({ length: products.length }, () =>Math.floor(Math.random()*5 -2)));
    }
  }, [products.length]);
  
  


      
      useGSAP(
          () => {
        
      const cards = cardRefs.current;
    
   
        //spread cards
        cards.forEach((card, index) => {
            gsap.to(card, {
                left: `${positions![index]}px`,
                transform: `translateX(0%) translateY(-50%) rotate(${rotations![index]}deg)`,
                ease: "none",
                scrollTrigger: {
                    trigger: container.current?.querySelector('.cards'),
                    start: "top center",
                    end: "center bottom+=20",
                    scrub: 2,
                    id: `speed-${index}`,
                },
            });
        });
        
    },
    { scope: container ,dependencies:[positions] }
);


  return (
    <>
     
      {
        products && products.length >0 && (
<>
            <h2 className="text-center my-20 text-[7vw]">{products[0].category}</h2>
        
      <div className='container scrollbar-hide relative w-full h-[80vh] overflow-x-scroll ' ref={container}>
        <section className='cards'>
          <div
            className='list overflow-x-scroll scrollbar-hide '
            style={{ width: listWidth ? `${listWidth}px` : "auto" }}
          >
            {products.map((product, index) => (
                
              <ProductCard
                product={convertToPlainObj(product)}
                key={product.id}
                cart={cart ? convertToPlainObj(cart) : undefined}
                style={{ "--position": index + 1 } as React.CSSProperties}
                id={`card-${index + 1}`}
                ref={(el: HTMLDivElement | null) => {
                    if (el) cardRefs.current[index] = el;
                }}
                />
                
            
            ))}
          </div>
        </section>
      </div>
     </>
    )
}
    </>
  );
}
