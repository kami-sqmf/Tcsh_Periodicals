import Image from "next/image"
import Link from "next/link"
import { RiArrowRightFill, RiInstagramLine, RiMailSendLine } from "react-icons/ri"
import { langCode, _t } from "../language/lang"
import { About as AboutType } from "../types/firestore"
import { Global } from "../types/global"
import { Language } from "./language"

export const About = ({ className, about, lang }: { className: string, about: AboutType, lang: langCode }) => {
    return (
        <div className={`${className} max-w-full h-max border-2 border-main px-6 md:px-8 mt-8 md:mt-0 mb-7 md:mb-0 md:h-max`}>
            <div className="relative w-full h-12 mt-8 rounded-lg overflow-hidden">
                <Image className="object-cover" src={Global.logo} fill={true} alt="慈中後生 Logo" sizes="(max-width: 1024px) 272px, (max-width: 768px) 188vw, 268vw" />
            </div>
            <p className="mt-7 text-lg md:text-base xl:text-lg text-gray-700">{about.description}</p>
            <div className="flex flex-col mt-5 space-y-2">
                <Link href={Global.webMap.member.href}>
                    <div className="flex flex-row items-center text-xl md:text-xs lg:text-lg xl:text-xl text-main font-medium space-x-4 cursor-pointer hover:scale-105 hover:translate-x-2 transition-all">
                        <RiArrowRightFill />
                        <span>{Global.webMap.member.title(lang)}</span>
                    </div>
                </Link>
                <Link href={Global.webMap.tellUs.href}>
                    <div className="flex flex-row items-center text-xl md:text-xs lg:text-lg xl:text-xl text-main font-medium space-x-4 cursor-pointer hover:scale-105 hover:translate-x-2 transition-all">
                        <RiArrowRightFill />
                        <span>{Global.webMap.tellUs.title(lang)}</span>
                    </div>
                </Link>
                <Link href={Global.webMap.youtube.href}>
                    <div className="flex flex-row items-center text-xl md:text-xs lg:text-lg xl:text-xl text-main font-medium space-x-4 cursor-pointer hover:scale-105 hover:translate-x-2 transition-all">
                        <RiArrowRightFill />
                        <span>{Global.webMap.youtube.title(lang)}</span>
                    </div>
                </Link>
            </div>
            <div className="flex flex-col mt-8 md:mt-4 lg:mt-8 mb-8 space-y-6 md:space-y-2 lg:space-y-5">
                <Link href={`https://www.instagram.com/${about.insta}`}>
                    <div className="group flex flex-row items-center justify-around border-2 border-main rounded-2xl py-1.5 text-main cursor-pointer">
                        <RiInstagramLine className="w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 group-hover:animate-spinIG" />
                        <span className="text-lg md:text-base xl:text-lg mr-12 md:mr-1 lg:mr-6 font-medium">{_t(lang).followInsta}</span>
                    </div>
                </Link>
                <Link href={`mailto:${about.email}`}>
                    <div className="group flex flex-row items-center justify-around border-2 border-cyan-900 rounded-2xl py-1.5 text-cyan-900 cursor-pointer">
                        <RiMailSendLine className="w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 group-hover:animate-mailFly" />
                        <span className="text-lg md:text-base xl:text-lg mr-12 md:mr-1 lg:mr-6 font-medium">{_t(lang).contactUs}</span>
                    </div>
                </Link>
                <Language lang={lang} />
            </div>
        </div>
    )
}