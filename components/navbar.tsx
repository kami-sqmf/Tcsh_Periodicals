import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiMenu4Line, RiUser3Fill, RiUser3Line } from "react-icons/ri";
import { langCode } from "../language/lang";
import { Global } from "../types/global";
import { isAdmin } from "../utils/get-firestore";
import { useScroll } from "../utils/use-scroll";

const floatNav = 38;

export const Navbar = () => {
    const router = useRouter();
    const session = useSession();
    const { scrollY } = useScroll();
    const [admin, setAdmin] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const lang = router.locale as langCode
    useEffect(() => {
        if (session.status == "authenticated") {
            setAdmin(isAdmin(session.data.firestore));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session.status]);
    return (
        <div className={`${scrollY > floatNav ? "navTop" : ""} z-30`}>
            <div className={`flex flex-row h-8 md:h-16 w-full relative justify-between items-center transition-all`}>
                <RiMenu4Line className="text-main h-7 w-7 md:h-10 md:w-10 cursor-pointer" onClick={(e) => { setShowMenu(!showMenu) }} />
                <Link href={`/`} className="relative w-36 h-8 rounded-lg overflow-hidden ring-1 ring-main md:absolute md:ml-14 md:h-12 md:w-52 md:ring-0 cursor-pointer">
                    <Image className="object-cover" src={Global.logo} fill={true} alt="慈中後生 Logo" sizes="(max-width: 1024px) 272px, (max-width: 768px) 188vw, 268vw" />
                </Link>
                <Link href={Global.webMap.postIt.href} className="hidden md:inline-flex px-6 rounded-lg border-2 border-main/90 md:absolute md:right-0 md:mr-14 md:h-10 cursor-pointer group hover:px-7 hover:border-main transition-all">
                    <p className="text-sm md:text-lg text-main/90 my-auto group-hover:text-main">{Global.webMap.postIt.title(lang)}</p>
                </Link>
                {session.status == "authenticated" ?
                    <Link href={Global.webMap.accounts.href} className="relative text-main cursor-pointer group h-7 w-7 md:w-10 md:h-10">
                        <Image src={session.data!.user!.image!} fill={true} className="rounded-full overflow-hidden object-cover" alt="大頭貼" />
                        <div className="absolute w-max px-2 py-1 text-xs z-40 bg-background2 rounded-md hidden opacity-0 group-hover:block group-hover:opacity-90 transition-opacity -translate-x-[10%] -bottom-7">
                            <span>{session.data!.user!.name!}</span>
                        </div>
                    </Link>
                    :
                    <Link href={Global.webMap.accounts.child.signIn.href} className="relative text-main cursor-pointer group">
                        <RiUser3Line className="inline-flex group-only-of-type: group-hover:hidden h-7 w-7 md:h-9 md:w-9" />
                        <RiUser3Fill className="hidden group-hover:inline-flex h-7 w-7 md:h-9 md:w-9" />
                        <div className="absolute w-max px-2 py-1 text-xs bg-background2 rounded-md hidden opacity-0 group-hover:block group-hover:opacity-90 transition-opacity -translate-x-[20%] mt-1">
                            <span>按此登入</span>
                        </div>
                    </Link>
                }
            </div>
            <div className={`${showMenu ? "block" : "hidden"} transition-all duration-700 w-full h-max rounded py-2 px-8 mt-3 mb-6 bg-background2 flex flex-col items-center justify-center`}>
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
    <Link href={nav.href} className={`${(nav.href.split("/")[1] == router.pathname.split("/")[1]) && !nav.href.startsWith("http") ? "text-main2" : "text-main"} cursor-pointer py-1.5  font-medium flex flex-row items-center`}>
        {(nav.href.split("/")[1] == router.pathname.split("/")[1]) && !nav.href.startsWith("http") ? <nav.nav.iconHover className="mr-2 h-5 w-5 -top-0.5" /> : <nav.nav.icon className="mr-2 h-5 w-5 -top-0.5" />}
        <span>{nav.title(lang)}</span>
    </Link>
)