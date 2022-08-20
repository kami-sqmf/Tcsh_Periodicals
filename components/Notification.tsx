import Link from "next/link"
import { RiAlarmWarningLine } from "react-icons/ri"
import { Global } from "./global"

function Notification({ className }: { className: string }) {
    return (
        <div className={`${className} flex flex-row items-center justify-between group w-full h-8 rounded text-white text-xs font-bold px-3 bg-main2/40`}>
            <div className="flex flex-row items-center">
                <RiAlarmWarningLine className="h-4 w-4 mr-2 animate-bright" />
                <p className="pt-0.5">2022 年 - 秋・無咎，正在編製中</p>
            </div>

            <Link href={Global.webMap.postIt.href}>
                <button className="border-b border-white">{Global.webMap.postIt.title}</button>
            </Link>

        </div>
    )
}

export default Notification