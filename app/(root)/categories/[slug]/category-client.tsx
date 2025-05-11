"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ReactLenis } from "lenis/react";

import { Category } from "@/types";
import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CategoryClient({
  category,
  nextCategory,
  prevCategory,
  
  productCrousel,
  categories,
}: {
  category: Category;
  nextCategory: Category;
  prevCategory: Category;
  productCrousel: React.ReactNode;
  categories: Category[];
}) {
  const categoryNavRef = useRef(null);
  const progressBarRef = useRef(null);
  const categoryDescriptionRef = useRef(null);
  const footerRef = useRef(null);
  const nextCategoryProgressBarRef = useRef(null);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shouldUpdateProgress, setShouldUpdateProgress] = useState(true);

  const router = useRouter()
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {

    gsap.set(categoryNavRef.current, {
      opacity: 0,
      y: -100,
    });

    gsap.to(categoryNavRef.current, {
      opacity: 1,
      y: 10,
      duration: 1,
      delay: 0.5,
      ease: "power3.out",
    });

    gsap.set(categoryDescriptionRef.current, {
      opacity: 0,
      y: -20,
    });

    gsap.to(categoryDescriptionRef.current, {
      opacity: 1,
      duration: 1,
      delay: 0.25,
      y: 0,
      ease: "power3.out",
    });

     ScrollTrigger.create({
      trigger: document.body.querySelector(".category-page"),
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (progressBarRef.current) {
          gsap.set(progressBarRef.current, {
            scaleX: self.progress,
          });
        }
      },
    });

    ScrollTrigger.create({
      trigger: footerRef.current,
      start: "top top",
      end: `+=${window.innerHeight * 1}px`,
      pin: true,
      pinSpacing: true,
      onEnter: () => {
        if (categoryNavRef.current && !isTransitioning) {
          gsap.to(categoryNavRef.current, {
            y: -100,
            duration: 0.5,
            ease: "power2.inOut",
          });
        }
      },
      onLeaveBack: () => {
        if (categoryNavRef.current && !isTransitioning) {
          gsap.to(categoryNavRef.current, {
            y: 0,
            duration: 0.5,
            ease: "power2.inOut",
          });
        }
      },
      onUpdate: (self) => {
        if (nextCategoryProgressBarRef.current && shouldUpdateProgress) {
          gsap.set(nextCategoryProgressBarRef.current, {
            scaleX: self.progress,
          });
        }
        if (self.progress >= 1 && !isTransitioning) {
          setShouldUpdateProgress(false);
          setIsTransitioning(true);

          const tl = gsap.timeline();
          tl.set(nextCategoryProgressBarRef.current, {
            scaleX: 1,
          });

          const footerCopyEl = document.body.querySelector(
            ".category-footer-copy-2"
          );
          const nextProgressEl = document.body.querySelector(
            ".next-category-progress"
          );
          if (footerCopyEl && nextProgressEl) {
            tl.to([footerCopyEl, nextProgressEl], {
              opacity: 0,
              duration: 0.3,
              ease: "power2.inOut",
            });
            tl.call(() => {
              window.location.href = `/categories/${nextCategory.slug}`;
            });
          }
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [nextCategory.slug, isTransitioning, shouldUpdateProgress]);

  return (
    <ReactLenis root>
      <div className='category-page pt-10 overflow-hidden'>
        <div className='category-nav z-50 sm:w-[70%]' ref={categoryNavRef}>
          <div className='link rounded-full'>
            <Link
              className='flex flex-row'
              href={`/categories/${prevCategory.slug}`}
            >
              <span>&#8592;&nbsp;</span>
              <div className='hidden md:block'>Previous</div>
            </Link>
          </div>
          <div className='category-page-scroll-progress text-center'>
            {/* <p className='text-xs sm:text-base break-words py-1'>
              {category.name}
            </p> */}

          
              <Select onValueChange={(value) => router.push(value)}>
                <SelectTrigger className='inline-block border-none h-[30px] bg-transparent focus:ring-0 focus:ring-offset-0 !text-black w-[100%]'>
                 
                  <SelectValue placeholder='Select a Category' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="text-center ">
                  <SelectLabel className="selectLabel">Categories</SelectLabel>
                      
                    {categories.map((category) => (
                      <SelectItem
                        key={category.name}
                        value={`/categories/${category.slug}`}
                        className="block z-10"
                      >
                      {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            

            <div
              className='category-page-scroll-progress-bar'
              ref={progressBarRef}
            ></div>
          </div>
          <div className='link rounded-full'>
            <Link
              className='flex flex-row'
              href={`/categories/${nextCategory.slug}`}
            >
              <div className='hidden md:block'> Next</div>
              <span>&#8594;&nbsp;</span>
            </Link>
          </div>
        </div>
        <div className='category-hero'>
          <h1>{category.name?.toUpperCase() ??""}</h1>
          <p id='category-description' ref={categoryDescriptionRef}>
            {category.description}
          </p>
        </div>
        <div className="px-10 overflow-x-hidden" >{productCrousel}</div>
        
        <div className='category-footer' ref={footerRef}>
          <div className='flex flex-col justify-between text-center'>
            <div className='category-footer-copy-1'>
              <p>Next Category</p>
            </div>
            <Link href={`/categories/${nextCategory.slug}`} className="h1">
            <h1>{nextCategory.name}</h1>
            </Link>
            
            <div className='category-footer-copy-2'>
              <p>Keep Scrolling</p>
            </div>
          </div>
          <div className='next-category-progress'>
            <div
              className='next-category-progress-bar'
              ref={nextCategoryProgressBarRef}
            ></div>
          </div>
        </div>
      </div>
    </ReactLenis>
  );
}
