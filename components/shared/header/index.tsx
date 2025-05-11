import Link from "next/link";
import Menu from "./menu";
import Image from "next/image";

export default function Header() {
  return (
    <header className='wrapper w-full mt-3 fixed z-10 h-52'>
      <div className='max-h-16  flex justify-between items-center w-full'>
        <div className='flex-start '>
          <Link href='/' className='flex-center'>
          <div className='w-20'>

         
            <div className="-z-10">
              <svg
                className='-rotate-12'
                width='100'
                height='100'
                viewBox='0 0 372 201'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M218.973 15.8796L172.807 28.5611L135.082 40.8925C125.709 43.0596 45.3053 72.7711 29.4518 86.8916C9.63499 104.542 5.10737 94.5909 50.2513 86.8921L172.274 58.5563L218.36 50.3741C228.234 57.5508 -44.9358 124.706 96.4952 101.716L206.582 69.6678C137.141 112.607 -32.2048 210.946 29.4519 179.037C91.1086 147.128 216.189 106.453 322.064 71.7206'
                  stroke='#C6C6BE'
                  strokeWidth='30'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M365.272 62.6134C369.319 61.7327 371.886 57.7376 371.006 53.6902C370.125 49.6428 366.13 47.0757 362.082 47.9564L365.272 62.6134ZM362.082 47.9564L215.936 79.7587L219.126 94.4157L365.272 62.6134L362.082 47.9564Z'
                  fill='#f9f9f9'
                />
                <path
                  d='M332.5 74.5L215.5 96.5'
                  stroke='#CDCDC6'
                  strokeWidth='10'
                  strokeLinecap='round'
                />
              </svg>
            </div>
            
              <div className=' relative  w-32 -mt-[6.5rem] -ms-8'>
                <div className="flex justify-center items-center">

                <div className="">
                  <Image
                    src='/images/i.svg'
                    height={100}
                    width={100}
                    alt='logo'
                    />
                </div>

                <div className='-ms-24'>
                  <Image
                    src='/images/K.svg'
                    height={100}
                    width={100}
                    alt='logo'
                    />
                </div>
                    </div>
                <p className='text-center logo-letter-spacing text-[6px] ms-11
                 -mt-6 uppercase '>
                  online store
                </p>
              </div>
              </div>
          </Link>
        </div>
        <Menu />
      </div>
    </header>
  );
}
