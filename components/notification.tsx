import Link from "next/link"
import { RiAlarmWarningLine, RiErrorWarningLine, RiThumbUpLine } from "react-icons/ri"
import { Notification, Notifications } from "../types/firestore"

function Notification({ className, data }: { className: string, data: Notifications }) {
  if (Array.isArray(data.Now)) {
    return (
      <div className={`${className} flex flex-col space-y-2`}>
        {data.Now.map((noti, i) => (
          <Noti data={noti} key={i} />
        ))}
      </div>
    )
  } else {
    return <></>
  }
}

function Noti({ data }: { data: Notification }) {
  let Color = "bg-main2/40"
  let Icon = RiAlarmWarningLine
  if (data.type && data.title && data.button) {
    switch (data.type) {
      case "error":
        Color = "bg-red-600/80"
        Icon = RiErrorWarningLine
        break;
      case "success":
        Color = "bg-green-700/40"
        Icon = RiThumbUpLine
        break;
    }
    if (data.button.href && data.button.text) {
      switch (data.type) {
        case "error":
          Color = "bg-red-600/80"
          Icon = RiErrorWarningLine
          break;
        case "success":
          Color = "bg-green-700/40"
          Icon = RiThumbUpLine
          break;
      }
      return (
        <div className={`flex flex-row items-center justify-between group w-full h-8 rounded text-white text-xs font-bold px-3 ${Color}`}>
          <div className="flex flex-row items-center">
            <Icon className="h-4 w-4 mr-2 animate-bright" />
            <p className="pt-0.5">{data.title}</p>
          </div>

          <Link href={data.button.href}>
            <button className="border-b border-white">{data.button.text}</button>
          </Link>
        </div>
      )
    }

  }
  return <></>
}

export default Notification