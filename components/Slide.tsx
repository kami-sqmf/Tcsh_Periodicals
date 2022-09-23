import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { RiArrowLeftFill, RiArrowRightFill } from "react-icons/ri"
import { useRecoilState } from "recoil"
import { nowSlideState } from "../atoms/SlideModal"

const slideX = [{
  image: "/banner.png",
  href: "/?=1",
},{
  image: "/2.jpeg",
  href: "/?=2",
},
{
  image: "/logo.jpg",
  href: "/?=3",
}]

function Slide({slide = slideX, title = "本季主題：秋・無咎"}: {slide?: { image: string, href: string }[], title?: string}) {
  const [nowSlide, setNowSlide] = useRecoilState(nowSlideState)
  return (
    <div className="!mt-6 md:mt-16 space-y-4">
      <div className="relative w-full h-auto aspect-[21/9] xl:aspect-[21/7] border-2 border-main rounded-lg cursor-pointer">
        <Link href={slide[nowSlide].href}>
          <Image src={slide[nowSlide].image} layout="fill" objectFit="cover" alt="圖片" />
        </Link>
      </div>
      <div className="flex flex-row items-center">
        <RiArrowLeftFill onClick={() => setNowSlide(nowSlide - 1 >= 0 ? nowSlide - 1 : slide.length -1)} className="flex-1 text-main h-4 w-4 cursor-pointer hover:scale-110 hover:-translate-x-2 transition-all" />
        <span className="flex-2 text-main2">{title}</span>
        <RiArrowRightFill onClick={() => setNowSlide(nowSlide + 1 < slide.length ? nowSlide + 1 : 0 )} className="flex-1 text-main h-4 w-4 cursor-pointer hover:scale-110 hover:translate-x-2 transition-all" />
      </div>
    </div>
  )
}

export default Slide