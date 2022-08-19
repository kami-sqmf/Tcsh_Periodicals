import Image from "next/image";
import Link from "next/link";
import { RiMenu4Line, RiUser3Line } from "react-icons/ri";
import { Global } from "./global";

function Navbar({ onTop = false }: { onTop: boolean }) {
    return (
        <div className={`flex flex-row h-8 md:h-16 w-full relative z-50 justify-between items-center ${onTop ? "" : "navTop"} transition-all`}>
            <RiMenu4Line className="text-main h-7 w-7 md:h-10 md:w-10 cursor-pointer" />
            <Link href={`/`}>
                <div className="relative w-36 h-8 rounded-lg overflow-clip ring-1 ring-main md:absolute md:ml-14 md:h-12 md:w-52 md:ring-0 cursor-pointer">
                    <Image src={Global.logo} layout="fill" objectFit="cover" alt="慈中後生 Logo" />
                </div>
            </Link>
            <Link href={Global.webMap.postIt.href}>
                <div className="hidden md:inline-flex px-6 rounded-lg border-2 border-main/90 md:absolute md:right-0 md:mr-14 md:h-10 cursor-pointer group hover:px-7 hover:border-main transition-all">
                    <p className="text-sm md:text-lg text-main/90 my-auto group-hover:text-main">{Global.webMap.postIt.title}</p>
                </div>
            </Link>
            <RiUser3Line className="text-main h-7 w-7 md:h-9 md:w-9 cursor-pointer" />
        </div>
    )
}

export default Navbar