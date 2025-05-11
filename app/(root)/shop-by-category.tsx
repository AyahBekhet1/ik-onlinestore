"use client";
import Image from "next/image";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";

export default function ShopByCategory({categories}:{categories:Category[]}) {
  const gridContainer = useRef<HTMLDivElement | null>(null);
  const titleContainer = useRef(null);
  const descContainer = useRef<HTMLDivElement | null>(null);
  const titleFlexContainer = useRef<HTMLDivElement | null>(null);
  const descFlexContainer = useRef<HTMLDivElement | null>(null);
  const firstCategoryContainer = useRef<HTMLDivElement | null>(null);
  const secondCategoryContainer = useRef<HTMLDivElement | null>(null);
  const imgFlexcontainer = useRef<HTMLDivElement | null>(null);
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {

    const mm = gsap.matchMedia();


    gsap.ticker.lagSmoothing(0);

    // if (gridContainer.current) {
    //   ScrollTrigger.create({
    //     trigger: gridContainer.current,
    //     // markers: true,
    //     start: "top center-=10%",
    //     end: "top+=30% center-=20%",
    //     scrub: true,
    //     onUpdate: (self) => {
    //       const viewportWidth = window.innerWidth;

    //       if (titleContainer.current) {
    //         gsap.to(titleContainer.current, {
    //           y: -50,
    //           x: -viewportWidth / 4,
    //           duration: 1,
    //         });

    //         mm.add("(max-width: 767px)", () => {
    //           // Animation for mobile
    //           gsap.to(titleContainer.current, {
    //              y: -50, 
    //              x:0,
    //              duration: 1
    //              });
    //         });
    //       }
    //       if (descContainer.current) {
    //         gsap.to(descContainer.current, {
    //           y: -130,
    //           x: viewportWidth / 2,
    //           width: viewportWidth / 2.1,
    //           duration: 1,
    //           onStart: () => {
    //             descFlexContainer.current?.classList.remove("flex-center");
    //           },
    //         });
    //       }
    //       if (firstCategoryContainer.current) {
    //         mm.add("(min-width: 768px)", () => {
    //         gsap.to(firstCategoryContainer.current, {
    //           duration: 1,
    //           width: "45%",
    //           height: "400px",
    //           rotate: 0,
    //         });
    //       })
    //       mm.add("(width: 767px)",()=>{
    //         gsap.to(firstCategoryContainer.current, { width: "90%",
    //           height: "400px",
    //           rotate: 0,
    //         onStart:()=>{
    //           imgFlexcontainer.current?.classList.remove('flex', 'items-center' ,'justify-between')
    //         }
    //         });
    //       })
    //         mm.add("(max-width: 767px)", () => {
    //           gsap.to(firstCategoryContainer.current, { width: "90%",
    //             height: "400px",
    //             rotate: 0,
    //           onStart:()=>{
    //             imgFlexcontainer.current?.classList.remove('flex', 'items-center' ,'justify-between')
    //           }
    //           });
    //         });
    //       }
    //       if (secondCategoryContainer.current) {
    //         mm.add("(min-width: 768px)", () => {
    //         gsap.to(secondCategoryContainer.current, {
    //           duration: 1,
    //           width: "45%",
    //           height: "400px",
    //           y: "64px",
    //           rotate: 0,
    //           onStart: () => {
    //             secondCategoryContainer.current?.classList.add(
    //               "overflow-hidden"
    //             );
    //           },
    //         });
    //       })
    //       //mobile
    //       mm.add("(width:767px)",()=>{
    //         gsap.to(secondCategoryContainer.current ,{
    //           width:"90%",
    //           height:"400px",
    //           rotate:0,
    //           duration:1,
    //           y:"112px",
    //           x:"32px",
             
    //         })
    //       })
    //       mm.add("(max-width:767px)",()=>{
    //         gsap.to(secondCategoryContainer.current ,{
    //           width:"90%",
    //           height:"400px",
    //           rotate:0,
    //           duration:1,
    //           y:"112px",
    //           x:"32px",
             
    //         })
    //       })
          
    //       }
    //     },
    //   });
    // }
   //mob
    mm.add("(max-width: 767px)", () => {
      gsap.to(titleContainer.current, {
        y: -50,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: gridContainer.current,
          start: "top center-=10%",
          end: "top+=30% center-=20%",
          once: true,
        },
      });
      // gsap.set(firstCategoryContainer.current,{
      //   y:"112px"
      // })
      gsap.to(firstCategoryContainer.current, {
        width:"75%",
        height: "380px",
        rotate: 0,
        duration: 1,
        x:"8px",
        // translateX:"-50%",
        scrollTrigger: {
          trigger: gridContainer.current,
          start: "top center-=10%",
          end: "top+=30% center-=20%",
          once: true,
        },
        
        onStart: () => {
          imgFlexcontainer.current?.classList.add("flex-col");
          // firstCategoryContainer.current?.classList.remove("translate-x-11", "translate-y-28")

        }, 
      });

      gsap.to(secondCategoryContainer.current, {
        width:"75%",
        height: "380px",
        rotate: 0,
        duration: 1,
        y: "115px",
        x: "8px",
        scrollTrigger: {
          trigger: gridContainer.current,
          start: "top center-=10%",
          end: "top+=30% center-=20%",
          once: true,
        },
      });

      
      
    });
    if (window.innerWidth === 767 && gridContainer.current ) {
      gsap.to(titleContainer.current, {
        y: -50,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: gridContainer.current,
          start: "top center-=10%",
          end: "top+=30% center-=20%",
          once: true,
        },
      });

      gsap.to(firstCategoryContainer.current, {
        width: "90%",
        height: "400px",
        rotate: 0,
        duration: 1,
        scrollTrigger: {
          trigger: gridContainer.current,
          start: "top center-=10%",
          end: "top+=30% center-=20%",
          once: true,
        },
        onStart: () => {
          imgFlexcontainer.current?.classList.add("flex-col");

        },
      });
     

      gsap.to(secondCategoryContainer.current, {
        width: "90%",
        height: "400px",
        rotate: 0,
        duration: 1,
        y: "120px",
        x: 32,
        scrollTrigger: {
          trigger: gridContainer.current,
          start: "top center-=10%",
          end: "top+=30% center-=20%",
          once: true,
        },
      });
    }

    mm.add("(min-width: 768px)", () => {
      gsap.to(titleContainer.current, {
        y: -50,
        x: -window.innerWidth / 4,
        duration: 1,
        scrollTrigger: {
          trigger: gridContainer.current,
          start: "top center-=10%",
          end: "top+=30% center-=20%",
          once: true,
        },
      });

      gsap.to(descContainer.current, {
        y: -130,
        x: window.innerWidth / 2,
        width: window.innerWidth / 2.1,
        duration: 1,
        scrollTrigger: {
          trigger: gridContainer.current,
          start: "top center-=10%",
          end: "top+=30% center-=20%",
          once: true,
        },
        onStart: () => {
          descFlexContainer.current?.classList.remove("flex-center");
        },
      });

      gsap.to(firstCategoryContainer.current, {
        width: "90%",
        height: "400px",
        rotate: 0,
        duration: 1,
        scrollTrigger: {
          trigger: gridContainer.current,
          start: "top center-=10%",
          end: "top+=30% center-=20%",
          once: true,
        },
      });

      gsap.to(secondCategoryContainer.current, {
        width: "90%",
        height: "400px",
        rotate: 0,
        y: 64,
        duration: 1,
        scrollTrigger: {
          trigger: gridContainer.current,
          start: "top center-=10%",
          end: "top+=30% center-=20%",
          once: true,
        },
        onStart: () => {
          secondCategoryContainer.current?.classList.add("overflow-hidden");
        },
      });
    });

    return () => {
      mm.revert()
    };
  }, [firstCategoryContainer,secondCategoryContainer,titleFlexContainer, imgFlexcontainer]);

  
  return (
 
   
      <div
      className='  py-5  mt-10  rounded-3xl bg-white'
      ref={gridContainer}
     > 
     <div className='grid-container relative'> 
         <div className='relative translate-y-24' ref={titleFlexContainer}>
          <div
            ref={titleContainer}
            className='title text-center md:absolute md:left-1/2 md:translate-x-[-50%] '
          >
            <span className='uppercase  text-2xl md:text-[24px]  lg:text-lg font-extralight '>
              our{" "}
            </span>
            <span className='uppercase text-2xl md:text-[24px]  lg:text-7xl font-bold'>
              categories
            </span>
          </div>
          <div className='flex-center' ref={descFlexContainer}>
            <div
              ref={descContainer}
              className='description md:w-96 -mt-5 text-center '
            >
              <p className='translate-y-20 w-50 lg-w-100 md:block hidden'>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quam
                non quas omnis rem optio illum, facere cumque quo vel ducimus?
              </p>
            </div>
          </div>
        </div> 
       <div
          className='img-flex-container flex items-center justify-between'
          ref={imgFlexcontainer}>
          <div
            className='w-24 md:w-32  flex-center  -rotate-[35deg] md:translate-y-16 md:translate-x-9 translate-x-6 translate-y-28 '
            ref={firstCategoryContainer}
          >
            <Image
              src={"/images/men-3.svg"}
              width={100}
              height={100}
              alt='men-t-shirts'
              className='rounded-lg object-center md:object-contain lg:object-cover w-full h-full'
            />
          </div> 

           <div
            className='w-28 md:w-32 flex-center rotate-12  translate-y-32 -translate-x-8'
            ref={secondCategoryContainer}
          >
            <Image
              src={"/images/women.svg"}
              width={100}
              height={100}
              alt='women-t-shirts'
              className='rounded-lg object-center  md:object-contain lg:object-cover w-full h-full'
            />
          </div> 
        </div> 
      </div>  
     <div className=" mt-32 flex flex-col items-center justify-end mb-5">

      <Button variant='default' className='text-white'>
        
         

        <Link href={`/categories/${categories[0].slug}`} className='text-white'>
          Check all categories
        </Link>
         
      </Button>
      </div>  
     </div> 
     
  );
}
