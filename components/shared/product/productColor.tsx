"use client";

import { Product } from "@/types";

export default function ProductColor({ product ,chosenColor , setChosenColor }: { product: Product ; chosenColor:string ; setChosenColor:(color:string)=>void }) {



  return (
    <div
      className='flex-center space-x-3 '
      
    >
      {product.colors &&
        product.colors.map((color) => (
          <div
            style={{ backgroundColor: `${color}` }}
            className={`w-5 h-5 cursor-pointer rounded-full ${chosenColor === color ? "border-2  border-[#444241]":""}` }
            onClick={() => setChosenColor(color)}
            key={color}
          ></div>
        ))}
    </div>
  );
}
