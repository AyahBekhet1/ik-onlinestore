"use client";
import { useForm, SubmitHandler, ControllerRenderProps } from "react-hook-form";
import { z } from "zod";
import { insertCouponApplySchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { applyCoupon} from "@/lib/actions/coupon.action";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {  Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { BadgePercent } from "lucide-react";


export default  function CouponApplyForm() {
  const router = useRouter();
const [isPending, startTransition] = useTransition();


  const form = useForm<z.infer<typeof insertCouponApplySchema>>({
    resolver: zodResolver(insertCouponApplySchema),
    defaultValues:{code:""}
  });

  const onSubmit: SubmitHandler<z.infer<typeof insertCouponApplySchema>> = async (
    values
  ) => {

      const res = await applyCoupon(values)

      if (!res.success) toast.error(res.message);
      else {
        toast(res.message);
        startTransition(() => {
          router.refresh(); // triggers a re-fetch of server-side data
        });
       
      }
    
  };

  return (
    <Form {...form}>
      <form
       method='POST'
       onSubmit={form.handleSubmit(onSubmit)}
       className="space-y-8 p-3"
       >
        <div className="flex flex-col md:flex-row">
            {/* code */}
            <FormField  
              control={form.control}
              name="code"
              render={({field} :{field:ControllerRenderProps<z.infer<typeof insertCouponApplySchema>,'code'>})=>(
                    <FormItem className="w-full">
                        <FormLabel className="text-[20px]">Apply Code</FormLabel>
                        <FormControl>
                            <Input placeholder="enter code name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
              )}
            />
          </div>
        
          {/* submit */}
          <Button
            type='submit'
            size='lg'
            disabled={isPending}
            className='button col-span-2 w-full'
            
          >
            <BadgePercent  />
            {form.formState.isSubmitting ? "Submitting..." : "Apply Cuopon "}
          </Button>
        

      </form>
    </Form>
  );
}
