import { useSession } from "next-auth/react";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useScroll } from "../utils/use-scroll";
import { _t, langCode } from "../language/lang";
import { isAdmin } from "../utils/get-firestore";
import Link from "next/link";
import { RiCloseFill, RiMenu4Line, RiUser3Fill, RiUser3Line } from "react-icons/ri";
import Image from "next/image";
import { Global } from "../types/global";

const floatNav = 38;

export const Navbar = () => {
    const router = useRouter();
    const session = useSession();
    const { scrollY } = useScroll();
    const [admin, setAdmin] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const lang = router.locale as langCode;
    useEffect(() => {
        if (session.status == "authenticated") {
            setAdmin(isAdmin(session.data.firestore));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session.status, admin]);
    return (
        <div className={`${scrollY > floatNav ? "navTop" : ""} z-30`}>
            <div className={`flex flex-row h-8 md:h-16 w-full relative justify-between items-center transition-all`}>
                <div className="relative">
                    <RiMenu4Line className={`${showMenu ? "opacity-0 rotate-90" : "opacity-100"} absolute top-50 -translate-y-1/2 text-main h-7 w-7 md:h-10 md:w-10 cursor-pointer transition-all duration-300`} onClick={(e) => { setShowMenu(!showMenu) }} />
                    <RiCloseFill className={`${showMenu ? "opacity-100" : "opacity-0"} absolute top-50 -translate-y-1/2 text-main h-7 w-7 md:h-10 md:w-10 cursor-pointer transition-all duration-300`} onClick={(e) => { setShowMenu(!showMenu) }} />
                </div>
                <Link href={`/`} className="relative w-36 h-8 rounded-lg overflow-hidden ring-1 ring-main md:absolute md:ml-14 md:h-12 md:w-52 md:ring-0 cursor-pointer">
                    <Image className="object-cover" src={Global.logo} fill={true} alt="慈中後生 Logo" sizes="(max-width: 1024px) 272px, (max-width: 768px) 188vw, 268vw" />
                </Link>
                <div className="hidden md:flex flex-row justify-center items-center space-x-4 md:absolute md:right-0 md:mr-14">
                    {/* <Link href={Global.webMap.ebook.href} className="flex flex-row justify-center items-center px-3 rounded-lg border-2 border-main/90 md:h-10 cursor-pointer group hover:px-5 hover:border-main transition-all">
                        <p className="text-sm md:text-lg text-main/90 my-auto group-hover:text-main">{Global.webMap.ebook.title(lang)}</p>
                    </Link> */}
                    <Link href={Global.webMap.postIt.href} className="flex flex-row justify-center items-center px-3 rounded-lg border-2 border-main/90 md:h-10 cursor-pointer group hover:px-5 hover:border-main transition-all">
                        <p className="text-sm md:text-lg text-main/90 my-auto group-hover:text-main">{Global.webMap.postIt.title(lang)}</p>
                    </Link>
                </div>
                {session.status == "authenticated" ?
                    <Link href={Global.webMap.accounts.href} className="relative text-main cursor-pointer group h-7 w-7 md:w-10 md:h-10">
                        <Image placeholder='blur' blurDataURL="./defaultProfile.png" src={session.data!.user!.image!} fill={true} className="rounded-full overflow-hidden object-cover" alt="大頭貼" />
                        <div className="absolute w-max px-2 py-1 text-xs z-40 bg-background2 rounded-md hidden opacity-0 group-hover:block group-hover:opacity-90 transition-opacity -translate-x-[10%] -bottom-7">
                            <span>{session.data!.user!.name!}</span>
                        </div>
                    </Link>
                    :
                    <Link href={Global.webMap.accounts.child.signIn.href} className="relative text-main cursor-pointer group">
                        <RiUser3Line className="inline-flex group-only-of-type: group-hover:hidden h-7 w-7 md:h-9 md:w-9" />
                        <RiUser3Fill className="hidden group-hover:inline-flex h-7 w-7 md:h-9 md:w-9" />
                        <div className="absolute w-max px-2 py-1 text-xs bg-background2 rounded-md hidden opacity-0 group-hover:block group-hover:opacity-90 transition-opacity -translate-x-[20%] mt-1">
                            <span>{_t(lang).webMap.accounts.child.signIn.title}</span>
                        </div>
                    </Link>
                }
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