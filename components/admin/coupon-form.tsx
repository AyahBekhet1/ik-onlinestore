"use client";
import { Coupon } from "@/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm, SubmitHandler, ControllerRenderProps } from "react-hook-form";
import { z } from "zod";
import { insertCouponSchema, updateCouponSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { CouponDefaultValues, DISCOUNT_TYPE } from "@/lib/constants";
import { Input } from "../ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { format } from "date-fns"
import { createCoupon, updateCoupon } from "@/lib/actions/coupon.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";


export default function CouponForm({
  type,
  coupon,
  couponId,
}: {
  type: "Create" | "Update";
  coupon?: Coupon;
  couponId?: string;
}) {

    const router = useRouter();
  
  const form = useForm<z.infer<typeof insertCouponSchema>>({
    resolver: zodResolver(
      type === "Update" ? updateCouponSchema : insertCouponSchema
    ),
    defaultValues: coupon && type === "Update" ? coupon : CouponDefaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof insertCouponSchema>> = async (
    values
  ) => {
    if(type === 'Create'){
      const res = await createCoupon(values)

      if (!res.success) toast.error(res.message);
      else {
        toast(res.message);
        router.push("/admin/coupons");
      }
    }
    //on update
        if (type === "Update") {
          if (!couponId) {
            router.push("/admin/categories");
            return;
          }
          const res = await updateCoupon({ ...values, id: couponId });
    
          if (!res.success) toast.error(res.message);
          else {
            toast(res.message);
            router.push("/admin/coupons");
          }
        }
  };

  return (
    <Form {...form}>
      <form
       method='POST'
       onSubmit={form.handleSubmit(onSubmit)}
       className="space-y-8"
       >
        <div className="flex flex-col md:flex-row">
            {/* code */}
            <FormField  
              control={form.control}
              name="code"
              render={({field} :{field:ControllerRenderProps<z.infer<typeof insertCouponSchema>,'code'>})=>(
                    <FormItem className="w-full">
                        <FormLabel>Code </FormLabel>
                        <FormControl>
                            <Input placeholder="enter code name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:flex-row">
            {/*Discount Type*/}
            <FormField
              control={form.control}
              name="discountType"
              render={({field}:{field:ControllerRenderProps<z.infer<typeof insertCouponSchema>,'discountType'>})=>(
                <FormItem className="w-full">
                    <FormLabel>Discount Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value.toString()}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a discount type" />
                            </SelectTrigger>
                        </FormControl>
                        <>
                            {
                                DISCOUNT_TYPE.map((type)=>(
                                    <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase()+type.slice(1)}</SelectItem>
                                ))
                            }
                        </>
                    </Select>
                    <FormMessage />
                </FormItem>
              )}
            />
</div>
<div className="flex flex-col md:flex-row">   
            {/* Discount */}
            <FormField 
                control={form.control}
                name="discount"
                render={({field}:{field : ControllerRenderProps<z.infer<typeof insertCouponSchema> ,'discount'> })=>(
                    <FormItem className="w-full">
                         <FormLabel>Discount</FormLabel>
                         <FormControl>
                            <Input placeholder="enter your discout value eg()" {...field} type="number"  onChange={(e) => field.onChange(e.target.valueAsNumber)}/>    
                        </FormControl>
                        <FormMessage />   
                    </FormItem>
                )}
            />
            </div>
            <div className="flex flex-col md:flex-row">
            {/*maxUses */}
            <FormField
             control={form.control}
             name="maxUses"
             render={({field}:{field:ControllerRenderProps<z.infer<typeof insertCouponSchema> ,'maxUses'>})=>(
                <FormItem className="w-full">
                    <FormLabel>Maximum use</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter maximum use for code" type="number" {...field}  onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
             )}
            />
            </div>
            <div className='flex flex-col md:flex-row'>
            {/*  */}
            <FormField 
                control={form.control}
                name="expiresAt"
                render={({field}:{field:ControllerRenderProps<z.infer<typeof insertCouponSchema>,'expiresAt'>})=>(
                    <FormItem className="w-full">
                        <FormLabel>Expired At</FormLabel>
                        <FormControl>
                        <Input
                          type="date"
                         value={field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""}
                         onChange={(e) => {
                         const date = e.target.value ? new Date(e.target.value) : null
                         field.onChange(date)
          }}
        />
        
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            </div>

            <div>
          {/* submit */}
          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
            className='button col-span-2 w-full'
          >
            {form.formState.isSubmitting ? "Submitting..." : `${type} Coupon`}
          </Button>
        </div>

      </form>
    </Form>
  );
}
