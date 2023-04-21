'use client';

import { Notification } from "@/types/firestore";
import Link from "next/link";
import { RiAlarmWarningLine, RiErrorWarningLine, RiThumbUpLine } from "react-icons/ri";

const NotificationElement = ({ className = "", noti }: { className?: string; noti: Notification }) => {
  let Color = "bg-cyan-600/50";
  let Icon = RiAlarmWarningLine;
  if (noti.type && noti.title && noti.button) {
    if (noti.button.href && noti.button.text) {
      switch (noti.type) {
        case "error":
          Color = "bg-red-600/50"
          Icon = RiErrorWarningLine
          break;
        case "success":
          Color = "bg-green-600/50"
          Icon = RiThumbUpLine
          break;
      }
      return (
        <div className={`${className} flex flex-row items-center justify-between group w-full h-8 rounded text-white text-xs font-bold px-3 py-6 md:py-0 ${Color}`}>
          <div className="flex flex-row items-center">
            <Icon className="h-4 w-4 mr-2 animate-bright" />
            <p className="pt-0.5">{noti.title}</p>
          </div>
          <Link href={noti.button.href}>
            <button className="border-b border-white">{noti.button.text}</button>
          </Link>
        </div>
      )
    }
  }
  return <></>
}

export { NotificationElement };
