import Image from "next/image";
import Link from "next/link";
import { langCode } from "../language/lang";
import LogoSVG from '../public/logo-nav.svg';
import { useScroll } from "../utils/use-scroll";
import { Global } from "../types/global";

const floatNav = 59;

const IdeaNavbar = ({ lang }: { lang: langCode; }) => {
  const { scrollY } = useScroll();
  return (
    <div className={`flex items-center h-16 w-full transition-all duration-300 ${scrollY > floatNav ? "fixed top-0 bg-background2/90" : "bg-background2/10"} z-30`}>
      <div className='flex flex-row justify-between items-end w-[20rem] md:w-[42rem] lg:w-[56rem] xl:w-[72rem] mx-auto'>
        <div className='flex-row md:flex-row md:items-center md:space-x-2'>
          <Link href={`/${lang}`}><Image src={Global.logo} alt="慈中後生 Logo" className="h-10 w-40 object-cover -ml-2 md:ml-0 rounded-r-lg ring-main2 ring-1 md:ring-0" /></Link>
        </div>
        <div className='right flex flex-row space-x-6 mb-1'>
          <span className="font-medium text-sm text-main/70">匿名投稿系統</span>
        </div>
      </div>
    </div>
  )
}

export { IdeaNavbar };
