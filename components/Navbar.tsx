import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { RiMenu4Line, RiUser3Fill, RiUser3Line } from "react-icons/ri";
import { Global } from "./global";

function Navbar({ onTop = false }: { onTop: boolean }) {
    const session = useSession()
    console.log(session)
    return (
        <div className={`flex flex-row h-8 md:h-16 w-full relative z-50 justify-between items-center ${onTop ? "" : "navTop"} transition-all`}>
            <RiMenu4Line className="text-main h-7 w-7 md:h-10 md:w-10 cursor-pointer" />
            <Link href={`/`}>
                <div className="relative w-36 h-8 rounded-lg overflow-hidden ring-1 ring-main md:absolute md:ml-14 md:h-12 md:w-52 md:ring-0 cursor-pointer">
                    <Image src={Global.logo} layout="fill" objectFit="cover" alt="慈中後生 Logo" />
                </div>
            </Link>
            <Link href={Global.webMap.postIt.href}>
                <div className="hidden md:inline-flex px-6 rounded-lg border-2 border-main/90 md:absolute md:right-0 md:mr-14 md:h-10 cursor-pointer group hover:px-7 hover:border-main transition-all">
                    <p className="text-sm md:text-lg text-main/90 my-auto group-hover:text-main">{Global.webMap.postIt.title}</p>
                </div>
            </Link>
            {session.status == "authenticated" ?
                <Link href={Global.webMap.accounts.href}>
                    <div className="relative text-main cursor-pointer group h-7 w-7 md:w-10 md:h-10">
                        <Image src={session.data!.user!.image!} layout="fill" objectFit="cover" className="rounded-full overflow-hidden" />
                        <div className="absolute w-max px-2 py-1 text-xs bg-background2 rounded-md hidden opacity-0 group-hover:block group-hover:opacity-90 transition-opacity -translate-x-[10%] -bottom-7">
                            <span>{session.data!.user!.name!}</span>
                        </div>
                    </div>
                </Link>
                :
                <Link href={Global.webMap.accounts.child.signIn.href}>
                    <div className="relative text-main cursor-pointer group">
                        <RiUser3Line className="inline-flex group-only-of-type: group-hover:hidden h-7 w-7 md:h-9 md:w-9" />
                        <RiUser3Fill className="hidden group-hover:inline-flex h-7 w-7 md:h-9 md:w-9" />
                        <div className="absolute w-max px-2 py-1 text-xs bg-background2 rounded-md hidden opacity-0 group-hover:block group-hover:opacity-90 transition-opacity -translate-x-[20%] mt-1">
                            <span>按此登入</span>
                        </div>
                    </div>
                </Link>
            }
        </div>
    )
}

export default Navbar