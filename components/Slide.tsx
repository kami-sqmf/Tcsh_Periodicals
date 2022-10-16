import Image from "next/image";
import Link from "next/link";
import { RiArrowLeftFill, RiArrowRightFill } from "react-icons/ri";
import { useRecoilState } from "recoil";
import { nowSlideState } from "../atoms/SlideModal";
import { Slide as SlideType } from "../types/firestore";

export const Slide = ({ title, slides }: { title: string; slides: SlideType[] }) => {
    const [nowSlide, setNowSlide] = useRecoilState(nowSlideState);
    return (
        <div className="!mt-6 md:mt-16 space-y-4">
            <div className="relative w-full h-auto aspect-[21/9] xl:aspect-[21/7] border-2 border-main rounded-lg cursor-pointer">
                <Link href={slides.at(nowSlide)!.href}>
                    <Image src={slides.at(nowSlide)!.image} layout="fill" objectFit="cover" alt="圖片" />
                </Link>
            </div>
            <div className="flex flex-row items-center">
                <RiArrowLeftFill onClick={() => setNowSlide(nowSlide - 1 >= 0 ? nowSlide - 1 : slides.length - 1)} className="flex-1 text-main h-4 w-4 cursor-pointer hover:scale-110 hover:-translate-x-2 transition-all" />
                <span className="flex-2 text-main2">{title}</span>
                <RiArrowRightFill onClick={() => setNowSlide(nowSlide + 1 < slides.length ? nowSlide + 1 : 0)} className="flex-1 text-main h-4 w-4 cursor-pointer hover:scale-110 hover:translate-x-2 transition-all" />
            </div>
        </div>
    )
}