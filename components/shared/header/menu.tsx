import { Button } from "@/components/ui/button";
import { AlignCenter, ShoppingCartIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  

export default function Menu() {
  return (
    <div className='flex justify-end gap-3 pe-10'>
      <nav className='hidden md:flex w-full max-w-xs gap-1'>
        <Button asChild variant='ghost'>
          <Link href='/cart'>
            <ShoppingCartIcon />
          </Link>
        </Button>
        <Button asChild>
          <Link href='/sign-in'>
            <UserIcon size={500} />
          </Link>
        </Button>
      </nav>
      <nav className='md:hidden'>
        <Sheet>
          <SheetTrigger className="align-middle">
          <AlignCenter color="#D17B88" size={38} />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start ">
            <SheetHeader>
              <SheetTitle className="mb-4">Menu</SheetTitle>
             <div className="space-y-4 flex flex-col items-start">
             <Button asChild variant='ghost' >
          <Link href='/cart'>
            <ShoppingCartIcon />
            Cart
          </Link>
        </Button>
        <Button asChild>
          <Link href='/sign-in'>
            <UserIcon size={500} />
            Sign In
          </Link>
        </Button>
             </div>
              <SheetDescription>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
