// 4 steps
// 1-the user login
// 2- the shipping address
// 3- the payment method 
// 4-and the place order page.

import React from "react";
import { cn } from "@/lib/utils"; //allow us to add conditional calsses


export default function CheckoutSteps({current =0}) {
  return (
    <div className="wrapper flex justify-between items-center sm:flex-row flex-col space-x-2 space-y-2 mb-10">
      {['User Login' , 'Shipping Address' , 'Payment Method' , 'Place Order'].map((step , index)=>(
        <React.Fragment key={step}>
            <div className={cn('p-2 w-56 rounded-full text-center text-sm' , index === current ?'bg-secondary':"")}>
                {step}
            </div>
            {step !=='Place Order' &&(
                <hr className="w-16 border-t border-gray-300 mx-2" />
            )}
        </React.Fragment>
      ))}
    </div>
  )
}
