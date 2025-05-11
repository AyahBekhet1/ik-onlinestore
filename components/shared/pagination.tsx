"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";

export default function Pagination({
  page,
  totalPages,
  urlParamName,
}: {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlelick = (btnType:string)=>{
    const pageValue=btnType ==='next'? Number(page)+1:Number(page)-1

  const newUrl= formUrlQuery({
    params:searchParams.toString(),
    key:urlParamName || 'page',
    value:pageValue.toString()
   })

   router.push(newUrl)   
  }

 
  

  return (
    <div className='wrapper flex gap-2'>
      <Button
        size='lg'
        variant='outline'
        className='w-28'
        disabled={Number(page) <= 1}
        onClick={()=>handlelick('prev')}
      >
        Previous
      </Button>
      <Button
        size='lg'
        variant='outline'
        className='w-28'
        disabled={Number(page) >= totalPages}
        onClick={()=>handlelick('next')}
      >
        Next
      </Button>
    </div>
  );
}
