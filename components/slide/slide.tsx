'use client';
import { Slide } from "@/types/firestore";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { RiArrowLeftFill, RiArrowRightFill } from "react-icons/ri";

const SlideElement = ({ className = "", slides, mobile = false }: { className?: string; slides: Slide[]; mobile?: boolean }) => {
  const [nowSlide, setNowSlide] = useState(0);
  return (
    <div className={`${className} space-y-4`}>
      <div className={`relative w-full h-auto ${mobile ? "aspect-[21/9]" : "aspect-[21/9] xl:aspect-[21/7]"} border-2 border-main rounded-lg cursor-pointer overflow-hidden`}>
        <Link href={slides.at(nowSlide)!.href}>
          <Image src={slides.at(nowSlide)!.image} blurDataURL={(slides.at(nowSlide)! as any).image_blur || "FFF"} placeholder="blur" priority={true} fill={true} className="object-cover" alt="圖片" sizes="(max-width: 1024px) 272px, (max-width: 768px) 188vw, 268vw" />
        </Link>
      </div>
      <div className="flex flex-row items-center">
        <RiArrowLeftFill onClick={() => setNowSlide(nowSlide - 1 >= 0 ? nowSlide - 1 : slides.length - 1)} className="flex-1 text-main h-4 w-4 cursor-pointer hover:scale-110 hover:-translate-x-2 transition-all" />
        <span className="flex-2 text-main2">{slides[nowSlide].title}</span>
        <RiArrowRightFill onClick={() => setNowSlide(nowSlide + 1 < slides.length ? nowSlide + 1 : 0)} className="flex-1 text-main h-4 w-4 cursor-pointer hover:scale-110 hover:translate-x-2 transition-all" />
      </div>
    </div>
  )
}

export { SlideElement };
