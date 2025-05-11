"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Charmonman } from 'next/font/google';

const charmonman = Charmonman({
  subsets: ['latin'],
  weight: ['400', '700'], // Both weights available
});


export default function MainPage() {
  const welcomeRef = useRef(null);
  const iRef = useRef(null);
  const kRef = useRef(null);
  const logoRef = useRef(null);
  const mainRef = useRef(null);

 
  useEffect(() => {
  
    
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline();
    const mm = gsap.matchMedia();

    mm.add("(max-width: 767px)",()=>{
      gsap.set(iRef.current, {
        opacity: 0,
        yPercent: -300,
      });
  
      gsap.to(iRef.current, {
        opacity: 1,
        yPercent: -10,
        duration: 2,
        ease: "elastic.inOut(5 , 2)",
      });
      tl.set(kRef.current, {
        opacity: 0,
        y: -300,
      });
  
      tl.to(kRef.current, {
        opacity: 2,
        y: -100,
        duration: 2,
        delay:0.5,
        ease: "elastic.inOut(5, 2)",
      });
  
      tl.set(logoRef.current, {
        opacity: 0,
        y: -100,
      });
  
      tl.to(
        logoRef.current,
        {
          opacity: 1,
          y: -20,
          duration: 0.5,
          ease: "power1.inOut",
        },
      );
    })
    mm.add("(min-width: 768px)", () => {
      gsap.set(iRef.current, {
        opacity: 0,
        yPercent: -300
      });
  
      gsap.to(iRef.current, {
        opacity: 1,
        yPercent:0,
        duration: 2,
        ease: "elastic.inOut(5 , 2)",
        
      });
      tl.set(kRef.current, {
        opacity: 0,
        yPercent: -300,
      });
  
      tl.to(kRef.current, {
        opacity: 2,
        yPercent: 10,
        duration: 2,
        delay:0.5,
        ease: "elastic.inOut(5, 2)",
      });
  
      tl.set(logoRef.current, {
        opacity: 0,
        y: -100,
      });
  
      tl.to(
        logoRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power1.inOut",
        },
      );
  })
  if (window.innerWidth === 767) {
    gsap.set(iRef.current, {
      opacity: 0,
      yPercent: -300,
    });

    gsap.to(iRef.current, {
      opacity: 1,
      yPercent: -10,
      duration: 2,
      ease: "elastic.inOut(5 , 2)",
    });
    tl.set(kRef.current, {
      opacity: 0,
      y: -300,
    });

    tl.to(kRef.current, {
      opacity: 2,
      y: -100,
      duration: 2,
      delay:0.5,
      ease: "elastic.inOut(5, 2)",
    });

    tl.set(logoRef.current, {
      opacity: 0,
      y: -100,
    });

    tl.to(
      logoRef.current,
      {
        opacity: 1,
        y: -20,
        duration: 0.5,
        ease: "power1.inOut",
      },
    );
  }
   
  }, [kRef, iRef, welcomeRef]);


  return (

   
    <div className='wrapper min-h-screen flex flex-col justify-center items-center space-y-10 main-ref ' ref={mainRef}>
      <h1 className=' mt-14 text-4xl' ref={welcomeRef}>
        Welcome To
      </h1>
      <div className='md:mb-16 ps-5 '>
        <svg
          className='logo-bg'
          width='340'
          height='200'
          viewBox='0 0 372 201'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            className='main-path'
            d='M218.973 15.8796L172.807 28.5611L135.082 40.8925C125.709 43.0596 45.3053 72.7711 29.4518 86.8916C9.63499 104.542 5.10737 94.5909 50.2513 86.8921L172.274 58.5563L218.36 50.3741C228.234 57.5508 -44.9358 124.706 96.4952 101.716L206.582 69.6678C137.141 112.607 -32.2048 210.946 29.4519 179.037C91.1086 147.128 216.189 106.453 322.064 71.7206'
            stroke='#C6C6BE'
            strokeOpacity='0.85'
            strokeWidth='30'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path 
            d='M365.272 62.6134C369.319 61.7327 371.886 57.7376 371.006 53.6902C370.125 49.6428 366.13 47.0757 362.082 47.9564L365.272 62.6134ZM362.082 47.9564L215.936 79.7587L219.126 94.4157L365.272 62.6134L362.082 47.9564Z'
            fill='#f9f9f9'
          />
          <path
            className='line-path'
            d='M332.5 74.5L215.5 96.5'
            stroke='#CDCDC6'
            strokeWidth='10'
            strokeLinecap='round'
          />
        </svg>
      </div>
      <div className='header '>
        <div className='flex header-container '>
          
        <div className={`${charmonman.className}`} >

          <div className='i-letter opacity-0 flex-center' ref={iRef}>
            <span className="char-bold text-9xl md:text-[150px]  ">I</span>
          </div>

          <div className=' flex-center k-letter opacity-0 ' ref={kRef}>
            <span className="char-bold text-9xl md:text-[150px] pt-11 ">K</span>
          </div>
          
        </div>
          <p
            ref={logoRef}
            className=' letter-spacing uppercase md:text-sm  text-[10px] opacity-0 '
          >
            online store
          </p>
        </div>
      </div>
      <p className='text-center text-sm md:text-base'>Your Next Favorite T-Shirt Is Probably Right Here.</p>
      <Button variant='default' className='text-white'>
        <Link href='/categories' className='text-white'>
          Let's go Shopping
        </Link>
      </Button>
    </div>

  );
}
