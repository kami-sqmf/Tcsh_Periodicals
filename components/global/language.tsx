"use client";

import { LangCode } from "@/types/i18n";
import { languages } from "@/utils/config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { RiArrowDownSFill } from "react-icons/ri";

export const Language = ({ lang }: { lang: LangCode }) => {
    const [menu, setMenu] = useState(false)
    const pathname = usePathname();
    return (
        <div className="flex flex-row flex-wrap gap-1 items-center text-main2 px-2 justify-start cursor-pointer" onClick={() => setMenu(!menu)}>
            {languages[lang].icon}
            <p className="text ml-2">{languages[lang].name}</p>
            <RiArrowDownSFill className={`h-6 w-6 ml-2 ${menu ? "-rotate-90 translate-y-0.5" : ""} transition-all duration-600`} />
            {menu && <div className="flex flex-row space-x-2">
                {Object.keys(languages).filter((code) => code != lang).map((code, key) => (
                    <Link href={`/${code}/${pathname}`} className="flex flex-row scale-90 space-x-1 cursor-pointer hover:text-main" key={key}>
                        {languages[code as LangCode].icon}
                        <p>{languages[code as LangCode].name}</p>
                    </Link>
                ))}
            </div>}
        </div>
    )
}