'use client';

import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { useScroll } from "@/utils/use-scroll";
import Link from "next/link";
import { useState } from "react";
import { RiCloseFill, RiMenu4Line } from "react-icons/ri";
import LogoPNG from "../global/logo-png";

const floatNav = 40;

const Navbar = ({ lang, userAccount, menu }: { lang: LangCode; userAccount: JSX.Element; menu: JSX.Element }) => {
  const { scrollY } = useScroll();
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className={`${scrollY > floatNav ? "navTop" : ""} z-30`}>
      <div className={`flex flex-row h-8 md:h-16 w-full relative justify-between items-center transition-all select-none`}>
        <div className="relative h-7 w-7 md:h-10 md:w-10">
          <RiMenu4Line className={`${showMenu ? "opacity-0 rotate-90" : "opacity-100"} absolute text-main h-7 w-7 md:h-10 md:w-10 cursor-pointer transition-all duration-300`} onClick={(e) => { setShowMenu(!showMenu) }} />
          <RiCloseFill className={`${showMenu ? "opacity-100" : "opacity-0"} absolute text-main h-7 w-7 md:h-10 md:w-10 cursor-pointer transition-all duration-300`} onClick={(e) => { setShowMenu(!showMenu) }} />
        </div>
        <LogoPNG className="w-36 h-8 md:absolute md:ml-14 md:h-12 md:w-52 rounded-lg" ring={true} />
        {/* <Link href={`/${lang}/`} className="relative rounded-lg md:absolute md:ml-14 cursor-pointer">
          <Image className="block md:hidden object-cover w-36 h-8" src={LogoJPG} width={114} height={32} alt="慈中後生 Logo" />
          <LogoSVG className="hidden md:block h-12 w-40 fill-main" />
        </Link> */}
        <div className="hidden md:flex flex-row justify-center items-center space-x-4 md:absolute md:right-0 md:mr-14">
          <Link href={webInfo.webMap.postIt.href} className="flex flex-row justify-center items-center px-3 rounded-lg border-2 border-main/90 md:h-10 cursor-pointer group hover:px-5 hover:border-main transition-all">
            <p className="text-sm md:text-lg text-main/90 my-auto group-hover:text-main">{webInfo.webMap.postIt.title(lang)}</p>
          </Link>
        </div>
        <>{userAccount}</> {/* Account-Menu-Profile Area */}
      </div>
      {showMenu && <div onClick={() => setShowMenu(false)}>{menu}</div>}
    </div>
  )
}
export { Navbar };
