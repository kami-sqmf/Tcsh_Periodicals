import Image from "next/image"
import { RiArrowLeftFill, RiArrowRightFill } from "react-icons/ri"

function Slide() {
  return (
    <div className="!mt-6 md:mt-16 space-y-4">
        <div className="relative w-full h-auto aspect-[21/9] xl:aspect-[21/7] border-2 border-main rounded-lg cursor-pointer">
            <Image src={"/banner.png"} layout="fill" objectFit="cover" />
        </div>
        <div className="flex flex-row items-center">
            <RiArrowLeftFill className="flex-1 text-main h-4 w-4 cursor-pointer hover:scale-110 hover:-translate-x-2 transition-all"/>
            <span className="flex-2">本季主題：秋・無咎</span>
            <RiArrowRightFill className="flex-1 text-main h-4 w-4 cursor-pointer hover:scale-110 hover:translate-x-2 transition-all"/>
        </div>
    </div>
  )
}

export default Slide