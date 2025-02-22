import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";

export default function Header() {
  return (
    <header className='w-full  wrapper '>
      <div className='max-h-16  flex justify-between items-center w-full'>
        <div className='flex-start '>
          <Link href='/' className='relative'>
            <Image
              src='/images/sulina.svg'
              alt={`${APP_NAME} logo`}
              height={180}
              width={180}
              priority={true}
              className=''
            />
          </Link>
        </div>
        <Menu />
      </div>
      
    </header>
  );
}
