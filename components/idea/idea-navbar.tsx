'use client';

import { LangCode } from "@/types/i18n";
import { useScroll } from "@/utils/use-scroll";
import { useState } from "react";
import { RiCloseFill, RiMenu4Line } from "react-icons/ri";
import LogoPNG from "../global/logo-png";

const floatNav = 59;

const IdeaNavbar = ({ lang, name, version, menu }: { lang: LangCode; name: string; version: string; menu: JSX.Element }) => {
  const { scrollY } = useScroll();
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className={`flex items-center flex-col w-full transition-all duration-300 ${scrollY > floatNav ? "fixed top-0 bg-background2/90" : ""} z-30`}>
      <div className="flex flex-row justify-between items-end w-[20rem] md:w-[42rem] lg:w-[56rem] xl:w-[72rem] mx-auto select-none">
        <div className="flex flex-row space-x-1 md:space-x-4 items-center">
          <div className="relative h-8 w-8">
            <RiMenu4Line className={`${showMenu ? "opacity-0 rotate-90" : "opacity-100"} absolute text-main h-8 w-8 cursor-pointer transition-all duration-300`} onClick={(e) => { setShowMenu(!showMenu) }} />
            <RiCloseFill className={`${showMenu ? "opacity-100" : "opacity-0"} absolute text-main h-8 w-8 cursor-pointer transition-all duration-300`} onClick={(e) => { setShowMenu(!showMenu) }} />
          </div>
          <LogoPNG className="w-40 h-10 object-cover rounded-r-lg ring-main2 ring-1 md:ring-0" ring={true} />
        </div>
        <div className='right flex flex-col'>
          <span className="font-medium text-sm text-main/70">後生投稿系統</span>
          <span className="text-[10px] text-main/70">{name} {version}</span>
        </div>
      </div>
      {showMenu && <div className="w-[20rem] md:w-[42rem] lg:w-[56rem] xl:w-[72rem] mx-auto" onClick={() => setShowMenu(false)}>{menu}</div>}
    </div>
  )
}
export { IdeaNavbar };
