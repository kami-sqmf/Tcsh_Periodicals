import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { RiUser3Fill, RiUser3Line } from "react-icons/ri";
import { _t, langCode } from "../language/lang";
import LogoSVG from '../public/logo-nav.svg';
import { Global } from "../types/global";
import { useScroll } from "../utils/use-scroll";
import { NavbarAccountMenu } from "./navbar";

const floatNav = 59;

const IdeaNavbar = ({ lang, status }: { lang: langCode; status: string; }) => {
  const { scrollY } = useScroll();
  return (
    <div className={`flex items-center h-16 w-full transition-all duration-300 ${scrollY > floatNav ? "fixed top-0 bg-background2/90" : "bg-background2/10"} z-30`}>
      <div className='flex flex-row justify-between items-end w-[20rem] md:w-[42rem] lg:w-[56rem] xl:w-[72rem] mx-auto'>
        <div className='flex flex-row md:flex-row md:items-center md:space-x-2'>
          <Link href={`/${lang}`}><Image src={LogoSVG} alt="慈中後生 Logo" className="h-10 w-36 -ml-2 md:ml-0" /></Link>
          <span className='font-medium text-xs text-main/80 mt-2'>{status}</span>
        </div>
        <div className='right flex flex-row space-x-6 mb-1'>
          <span className="font-medium text-sm text-main/70">匿名投稿系統</span>
        </div>
      </div>
    </div>
  )
}

export { IdeaNavbar };
