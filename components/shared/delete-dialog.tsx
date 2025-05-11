'use client'
import { useState } from "react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { AlertDialog, AlertDialogCancel,AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger,AlertDialogContent } from "../ui/alert-dialog";

export default function DeleteDialog({id,action}:{id:string ; action:(id:string) => Promise<{success:boolean ; message:string}>}) {

    const [open , setOpen] = useState(false)
    const [isPending , startTransition] = useTransition()


    const handledeleteClick = ()=>{
        startTransition( async ()=>{
            const res = await action(id)

            if(!res.success){
              toast.error(res.message)
            }
            else{
                setOpen(false)
                toast(res.message)
            }
        })
    }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size='sm' variant='destructive' className="lg:ml-2">
            Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>
                Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
                This action can&apos;t be undone
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>
                Cancel
            </AlertDialogCancel>
            <Button variant='destructive' size='sm' disabled={isPending} onClick={handledeleteClick}>
                {isPending ?"Deleting..." : "Delete"}

            </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
