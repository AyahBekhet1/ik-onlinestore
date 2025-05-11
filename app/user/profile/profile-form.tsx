"use client";
import { updateProfilePassswordSchema, updateProfileSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm ,ControllerRenderProps } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfile, updateProfilePassword } from "@/lib/actions/user.action";

export default function ProfileForm() {
  const { data: session, update } = useSession();

  const form = useForm<z.infer<typeof updateProfilePassswordSchema>>({
    resolver: zodResolver(updateProfilePassswordSchema),
    defaultValues: {
      name: session?.user?.name ?? "", //?==> if on the left is null then use whats on the right
      email: session?.user?.email ?? "",
    password:"123456"
    },
  });

  const onSubmit =async (values:z.infer<typeof updateProfilePassswordSchema>) => {

    const res = await updateProfile(values)
    
    if(!res.success){
        return toast.error(res.message)
    }
    

    const newSession={
        ...session,
        user:{
            ...session?.user,
            name:values.name,
            password:values.password
        }

    }
    await update(newSession)
    toast(res.message, {
        className: "text-center",
        duration: 4000,
        cancel: {
            label: 'close',
            onClick: () => console.log('Cancel!'),
          }
      });
    
    return true;
  };

  return (
    <Form {...form}>
      <form
        method='post'
        className='flex flex-col gap-5'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='flex flex-col gap-5'>
          <FormField
            control={form.control}
            name='email'
            render={({ field} :{field:ControllerRenderProps<z.infer<typeof updateProfilePassswordSchema> , 'email'>}) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Email' {...field} disabled className="input-field"/>
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='name'
            render={({ field} :{field:ControllerRenderProps<z.infer<typeof updateProfilePassswordSchema> , 'name'>}) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Name' {...field}  className="input-field"/>
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field} :{field:ControllerRenderProps<z.infer<typeof updateProfilePassswordSchema> , 'password'>}) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder='Password' {...field}  className="input-field"/>
                </FormControl>
                
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" size='lg' className="button col-span-2 w-full" disabled ={form.formState.isSubmitting}>
           {form.formState.isSubmitting? 'Submitting...' : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
}
