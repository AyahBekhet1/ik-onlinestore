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
} from "@/components/ui/sheet";
import UserButton from "./user-button";
import { auth } from "@/auth";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default async function Menu() {
  const session = await auth();

  return (
    <nav>
      <Sheet>
        <SheetTrigger>
          <AlignCenter size={38} className='pe-4' />
        </SheetTrigger>
        <VisuallyHidden>
          <SheetTitle>Menu</SheetTitle>
        </VisuallyHidden>
        <SheetContent className=' border-transparent rounded-3xl sheet-bg text-white'>
          <SheetHeader className='mt-12'>
            {/* <SheetTitle className="mb-4 flex text-center ps-4 mt-20 uppercase text-white">Menu</SheetTitle> */}
            <div className='space-y-5 flex flex-col justify-start items-start'>
              <Button asChild className='bg-transparent'>
                <Link href='/cart' className='text-white text-xl nav-font'>
                  <ShoppingCartIcon />
                  Cart
                </Link>
              </Button>

              <UserButton />
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
