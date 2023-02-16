import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiCloseFill, RiMenu4Line } from "react-icons/ri";
import { langCode } from "../language/lang";
import { isAdmin } from "../middleware";
import { Global } from "../types/global";
import { useScroll } from "../utils/use-scroll";

const floatNav = 59;

const IdeaNavbar = ({ lang }: { lang: langCode; }) => {
  const router = useRouter();
  const session = useSession();
  const { scrollY } = useScroll();
  const [admin, setAdmin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  useEffect(() => {
    if (session.status == "authenticated") {
      setAdmin(isAdmin(session.data.firestore));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status, admin]);
  return (
    <div>
      <div className={`flex items-center h-16 w-full transition-all duration-300 ${scrollY > floatNav ? "fixed top-0 bg-background2/90" : "bg-background2/10"} z-30`}>
        <div className='flex flex-row justify-between items-end w-[20rem] md:w-[42rem] lg:w-[56rem] xl:w-[72rem] mx-auto'>
          <div className="flex flex-row space-x-4 items-center">
            <div className="relative h-8 w-8">
              <RiMenu4Line className={`${showMenu ? "opacity-0 rotate-90" : "opacity-100"} absolute text-main h-8 w-8 cursor-pointer transition-all duration-300`} onClick={(e) => { setShowMenu(!showMenu) }} />
              <RiCloseFill className={`${showMenu ? "opacity-100" : "opacity-0"} absolute text-main h-8 w-8 cursor-pointer transition-all duration-300`} onClick={(e) => { setShowMenu(!showMenu) }} />
            </div>
            <div className='flex-row md:flex-row md:items-center md:space-x-2'>
              <Link href={`/${lang}`}><Image src={Global.logo} alt="慈中後生 Logo" className="h-10 w-40 object-cover -ml-2 md:ml-0 rounded-r-lg ring-main2 ring-1 md:ring-0" /></Link>
            </div>
          </div>
          <div className='right flex flex-col'>
            <span className="font-medium text-sm text-main/70">匿名投稿系統</span>
            <span className="text-[10px] text-main/70">你的故事，我們來寫 v.1.0</span>
          </div>
        </div>
      </div>
      <div className={`${showMenu ? "block" : "hidden"} w-full h-max rounded py-2 px-8 mt-3 mb-6 bg-background2 flex flex-col items-center justify-center`}>
        {Object.values(Global.webMap).map((index, i) => {
          if (index.nav.show) {
            if (index.nav.admin) {
              if (admin) {
                return (<NavLink key={i} nav={index} router={router} lang={lang} />)
              }
            } else {
              return (<NavLink key={i} nav={index} router={router} lang={lang} />)
            }
          }
          return (<div key={i}></div>)
        })}
      </div>
    </div>

  )
}

const NavLink = ({ nav, router, lang }: { nav: any, router: NextRouter, lang: langCode }) => (
  <Link href={nav.href} className={`${(nav.href.split("/")[1] == router.pathname.split("/")[1]) && !nav.href.startsWith("http") ? "text-main2" : "text-main"} hover:text-main2 cursor-pointer py-1.5 font-medium flex flex-row items-center group`}>
    {(nav.href.split("/")[1] == router.pathname.split("/")[1]) && !nav.href.startsWith("http") ? <nav.nav.iconHover className="mr-2 h-5 w-5 -top-0.5" /> : <div className="relative h-5 w-5 mr-2">
      <nav.nav.icon className="absolute h-5 w-5 top-[0.2px] opacity-100 group-hover:opacity-0 transition-all duration-500" />
      <nav.nav.iconHover className="absolute h-5 w-5 top-[0.2px] opacity-0 group-hover:opacity-100 transition-all duration-500" />
    </div>}
    <span className="transition-all duration-500">{nav.title(lang)}</span>
  </Link>
)

export { IdeaNavbar };
