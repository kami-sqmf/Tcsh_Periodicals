import Image from "next/image"
import Link from "next/link"
import { RiArrowRightFill, RiInstagramLine, RiMailSendLine } from "react-icons/ri"
import { Global } from "./global"

function About({ className }: { className: string }) {
    return (
        <div className={`${className} max-w-full h-max border-2 border-main px-6 md:px-8 mt-8 md:mt-0 mb-8 md:mb-0 md:h-[532px]`}>
            <div className="relative w-full h-12 mt-9 rounded-lg overflow-hidden">
                <Image src="/logo.jpg" alt="不要把滑鼠放在我身上，很敏感" layout="fill" objectFit="cover" />
            </div>
            <p className="mt-8 text-lg md:text-base xl:text-lg">慈中後生團隊是由一群熱愛自由的人所創立的。而在座的各位思考的是你還有幾年『黃金時間』可以轉職。溫水煮青蛙雖然比較不痛。</p>
            <div className="flex flex-col mt-6 space-y-4">
                <Link href={Global.webMap.member.href}>
                    <div className="flex flex-row items-center text-xl md:text-xs lg:text-lg xl:text-xl text-main font-medium space-x-4 cursor-pointer hover:scale-105 hover:translate-x-2 transition-all">
                        <RiArrowRightFill />
                        <span>{Global.webMap.member.title}</span>
                    </div>
                </Link>
                <Link href={Global.webMap.tellUs.href}>
                    <div className="flex flex-row items-center text-xl md:text-xs lg:text-lg xl:text-xl text-main font-medium space-x-4 cursor-pointer hover:scale-105 hover:translate-x-2 transition-all">
                        <RiArrowRightFill />
                        <span>{Global.webMap.tellUs.title}</span>
                    </div>
                </Link>
            </div>
            <div className="flex flex-col mt-9 md:mt-4 lg:mt-9 mb-8 space-y-6 md:space-y-2 lg:space-y-6">
                <Link href={`https://www.instagram.com/${Global.insta}`}>
                    <div className="group flex flex-row items-center justify-around border-2 border-main rounded-2xl py-1.5 text-main cursor-pointer">
                        <RiInstagramLine className="w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 group-hover:animate-spinIG" />
                        <span className="text-lg md:text-base xl:text-lg mr-12 md:mr-1 lg:mr-6 font-medium">追蹤 IG</span>
                    </div>
                </Link>
                <Link href={`mailto:${Global.email}`}>
                    <div className="group flex flex-row items-center justify-around border-2 border-cyan-900 rounded-2xl py-1.5 text-cyan-900 cursor-pointer">
                        <RiMailSendLine className="w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 group-hover:animate-mailFly" />
                        <span className="text-lg md:text-base xl:text-lg mr-12 md:mr-1 lg:mr-6 font-medium">聯絡我們</span>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default About