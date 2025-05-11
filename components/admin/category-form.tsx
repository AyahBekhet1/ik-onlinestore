"use client";

import { Category } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { insertCategorySchema, updateCategorySchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryDefaultValues } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import slugify from "slugify";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { createCategory, updateCategory } from "@/lib/actions/category.action";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";


export default function CategoryForm({
  type,
  category,
  categoryId,
}: {
  type: "Create" | "Update";
  category?: Category;
  categoryId?: string;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof insertCategorySchema>>({
    resolver: zodResolver(
      type === "Update" ? updateCategorySchema : insertCategorySchema
    ),
    defaultValues:
      category && type === "Update" ? category : categoryDefaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof insertCategorySchema>> = async (
    values
  ) => {
    if (type === "Create") {
      const res = await createCategory(values);

      if (!res.success) toast.error(res.message);
      else {
        toast(res.message);
        router.push("/admin/categories");
      }
    }

    //on update
    if (type === "Update") {
      if (!categoryId) {
        router.push("/admin/categories");
        return;
      }
      const res = await updateCategory({ ...values, id: categoryId });

      if (!res.success) toast.error(res.message);
      else {
        toast(res.message);
        router.push("/admin/categories");
      }
    }
  };

  const images = form.watch("images");
  


  return (
    <Form {...form}>
      <form
        method='POST'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <div className='flex flex-col md:flex-row'>
          {/* name */}
          <FormField
            control={form.control}
            name='name'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertCategorySchema>,
                "name"
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter category name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* slug */}
          <FormField
            control={form.control}
            name='slug'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertCategorySchema>,
                "slug"
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  {/* form control only can have single ele wrapping */}
                  <div className='relative'>
                    <Input placeholder='Enter slug' {...field} />
                    <Button
                      type='button'
                      className='bg-gray-500 hover:bg-gray-600 text-white px-4 py- mt-2'
                      onClick={() => {
                        form.setValue(
                          "slug",
                          slugify(form.getValues("name"), { lower: true })
                        );
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className=' upload-field flex flex-col md:flex-row'>
          {/* images */}
          <FormField
            control={form.control}
            name='images'
            render={() => (
              <FormItem className='w-full'>
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className='space-y-2 mt-2 min-h-48'>
                    <div className='flex-start space-x-2'>
                      {images.map((image: string) => (
                        <Image
                          key={image}
                          src={image}
                          alt='product image'
                          className='w-20 h-20 object-cover object-center rounded-sm'
                          width={100}
                          height={100}
                        />
                      ))}
                      <FormControl>
                      {/*<UploadButton
                          endpoint='imageUploader'
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue("images", [...images, res[0].url]);
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(`ERROR! ${error.message}`);
                          }}
                        /> */}
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
          {/* description */}
          <FormField
            control={form.control}
            name='description'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertCategorySchema>,
                "description"
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter Category description'
                    {...field}
                    className='resize-none'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        
        <div>
          {/* submit */}
          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
            className='button col-span-2 w-full'
          >
            {form.formState.isSubmitting ? "Submitting..." : `${type} Category`}
          </Button>
        </div>
      </form>
    </Form>
  );
}
