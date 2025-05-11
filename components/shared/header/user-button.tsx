import Link from "next/link";
import { auth } from "@/auth";
import { signOutUser } from "@/lib/actions/user.action";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ContactRound, ListOrdered, LogOut, ShoppingCartIcon, UserIcon } from "lucide-react";

export default async function UserButton() {
  const session = await auth();
  if (!session) {
    return (
      <Button asChild className='nav-font bg-transparent text-xl'>
        <Link href='/sign-in'>
          <UserIcon size={800} />
          Sign In
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? "";
  return (
    <div className=' space-y-5 '>
      <div className='flex items-center space-x-3 '>
        <div className=''>
          <Button
            variant='ghost'
            className='relative w-8 h-8 rounded-full ml-2 bg-gray-700 font-semibold'
          >
            {firstInitial}
          </Button>
        </div>

        <div className='  space-x-2'>
          <div className='text-xl uppercase leading-none'>
            {session.user?.name}
          </div>
        </div>
      </div>
      <Button asChild className='bg-transparent'>
                  <Link href='/cart' className='text-white text-xl nav-font'>
                    <ShoppingCartIcon />
                    Cart
                  </Link>
                </Button>
      <div className=' flex flex-col justify-start items-start text-white gap-3  spac-y-5'>
        <Button asChild className='bg-transparent'>
          <Link href='/user/profile' className='text-white text-xl nav-font'>
            <ContactRound />
            Profile
          </Link>
        </Button>
        <Button asChild className='bg-transparent'>
          <Link href='/user/orders' className='text-white text-xl nav-font'>
            <ListOrdered  />
            My Orders
          </Link>
        </Button>
      </div>

      {session?.user?.role === "admin" && (
        <Link href='/admin/overview' className='w-full'>
          Admin
        </Link>
      )}
      <div className='p-0 mb-1'>
        <form action={signOutUser}>
          <Button className='bg-transparent font-medium uppercase text-xl '>
          <LogOut />
            Sign Out</Button>
        </form>
      </div>
    </div>
  );
}
