'use client';

import i18nDefault from "@/translation/about/zh.json";
import { About } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import i18n from "@/utils/i18n";
import Link from "next/link";
import { RiArrowRightFill, RiInstagramLine, RiMailSendLine } from "react-icons/ri";
import { Language } from "../global/language";
import LogoPNG from "../global/logo-png";

const AboutElement = ({ lang, className = "", info }: { lang: LangCode; className?: string; info: About }) => {
  const t = new i18n<typeof i18nDefault>(lang, "about");
  const aboutLinks = [webInfo.webMap.member, webInfo.webMap.tellUs, webInfo.webMap.youtube];
  return (
    <div className={`${className}`}>
      <LogoPNG className="w-full h-12 mt-8 rounded-lg" ring={false} />
      <p className="mt-7 text-lg md:text-base xl:text-lg text-gray-700">{info[lang].description}</p>
      <div className="flex flex-col mt-5 space-y-2">
        {aboutLinks.map((link, key) => (
          <AboutLink text={link.title(lang) as string} href={link.href} key={key} />
        ))}
      </div>
      <div className="flex flex-col mt-8 md:mt-4 lg:mt-8 mb-8 space-y-6 md:space-y-2 lg:space-y-5">
        <Link href={`https://www.instagram.com/${info.insta}`}>
          <div className="group flex flex-row items-center justify-around border-2 border-main rounded-2xl py-1.5 text-main cursor-pointer">
            <RiInstagramLine className="w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 group-hover:animate-spinIG" />
            <span className="text-lg md:text-base xl:text-lg mr-12 md:mr-1 lg:mr-6 font-medium">{t._("follow-insta")}</span>
          </div>
        </Link>
        <Link href={`mailto:${info.email}`}>
          <div className="group flex flex-row items-center justify-around border-2 border-cyan-900 rounded-2xl py-1.5 text-cyan-900 cursor-pointer">
            <RiMailSendLine className="w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 group-hover:animate-mailFly" />
            <span className="text-lg md:text-base xl:text-lg mr-12 md:mr-1 lg:mr-6 font-medium">{t._("contact-us")}</span>
          </div>
        </Link>
        <Language lang={lang} />
      </div>
    </div>
  )
}

const AboutLink = ({ text, href }: { text: string; href: string }) => (
  <Link href={href}>
    <div className="flex flex-row items-center text-xl md:text-xs lg:text-lg xl:text-xl text-main font-medium space-x-4 cursor-pointer hover:scale-105 hover:translate-x-2 transition-all">
      <RiArrowRightFill />
      <span>{text}</span>
    </div>
  </Link>
)

export { AboutElement };
