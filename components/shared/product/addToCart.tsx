"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus , Loader } from "lucide-react";
import { toast } from "sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { useTransition } from "react";

import { Cart, CartItem } from "@/types";

export default function AddToCart({cart,item}: {cart?: Cart;item: CartItem;}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  
  const handleAddToCart = async () => {
    startTransition(async()=>{

      const res = await addItemToCart(item);
      console.log(res);
      
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      
      toast(res.message, {
        className: "text-center",
        action: (
          <Button
          className='bg-primary text-white hover:bg-gray-800 me-0'
          onClick={() => router.push("/cart")}
          >
          Go To Cart
        </Button>
      ),
      duration: 5000,
    });
  })
  };

  const handleRemoveFromCart = async () => {
    startTransition (async()=>{

      const res = await removeItemFromCart(item.productId);
      if(!res.success){
        toast.error(res.message)
        return
      }
      toast(res.message, {
        className: "text-center",
        duration: 5000,
      });
      return
    })
  };

  //check if item is in the cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button type='button' onClick={handleRemoveFromCart}>
       {isPending?(<Loader className="w-4 h-4 animate-spin" />):
       ( <Minus className='h-4 w-4' />)}
      </Button>
      <span className='px-2'>{existItem.qty}</span>
      <Button type='button' onClick={handleAddToCart}>
      {isPending?(<Loader className="w-4 h-4 animate-spin" />):
       ( <Plus className='h-4 w-4' />)}
      </Button>
    </div>
  ) : (
    <Button className='w-full' type='button' onClick={handleAddToCart}>
      {isPending?(<Loader className="w-4 h-4 animate-spin" />):
       ( <Plus className='h-4 w-4' />)} Add To Cart
    </Button>
  );
}
