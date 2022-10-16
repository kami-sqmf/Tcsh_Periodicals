import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { RiArrowDownSFill } from "react-icons/ri"
import { langCode, langIcons, langNames, _t } from "../language/lang"

export const Language = ({ lang }: { lang: langCode }) => {
    const [menu, setMenu] = useState(false)
    const router = useRouter()
    return (
        <div className="flex flex-row items-center text-main2 px-2 justify-start" onClick={() => setMenu(!menu)}>
            {langIcons[lang]}
            <p className="text ml-2">{langNames[lang]}</p>
            <RiArrowDownSFill className={`h-6 w-6 ml-2 ${menu ? "-rotate-90 translate-y-0.5" : ""} transition-all duration-600`} />
            {menu && <div className="flex flex-row space-x-2">
                {Object.keys(langNames).filter((key) => key != lang).map((lang, key) => (
                    <Link href={`/${lang}/${router.pathname}`} key={key}>
                        <div className="flex flex-row scale-90 space-x-1 cursor-pointer">
                            {langIcons[lang as langCode]}
                            <p>{langNames[lang as langCode]}</p>
                        </div>
                    </Link>
                ))}
            </div>}
        </div>
    )
}