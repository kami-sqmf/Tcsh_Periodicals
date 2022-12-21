import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { RiChatSmile3Fill, RiChatSmile3Line, RiCloseCircleFill, RiCloseCircleLine, RiInstagramLine, RiMailSendLine, RiSendPlaneFill, RiSendPlaneLine } from "react-icons/ri";
import LogoSVG from '../public/logo.svg';
import { About } from "../types/firestore";

interface Message {
  sender_uns: boolean
  content: string;
  timestamp: EpochTimeStamp;
  reaction: string | null;
}
const messagesArr: Message[] = [
  {
    sender_uns: true,
    content: "哈囉，我是您的文字助理，我有答必應（ Bing 不要告我 ）",
    timestamp: new Date().getTime(),
    reaction: null
  },
];

export const Chat = ({ className, about }: { className: string, about: About }) => {
  const [expand, setExpand] = useState<boolean>(false);
  const [rowTextarea, setTextarea] = useState<number>(1);
  const [sendAvailable, setSendAvailable] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>(messagesArr);
  const hiddenTextarea = useRef<any>(null);
  const textarea = useRef<any>(null);
  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    hiddenTextarea.current.value = e.target.value;
    setSendAvailable(hiddenTextarea.current.value.length);
    setTextarea(hiddenTextarea.current.scrollHeight / 24);
  }
  const sendMessage = () => {
    setMessages([{
      sender_uns: true,
      content: ["目前本聊天室還在開發中，請改用 IG 或是 Email!", "開發中拉，請改用 IG 或是 Email!", "開發中ㄚ，請改用 IG 或是 Email!", "我還沒做好啊啊啊ㄚ，請改用 IG 或是 Email!", "真的假的？請改用 IG 或是 Email!", "哈囉哈囉！目前請改用 IG 或是 Email!"][Math.floor(Math.random() * 6)],
      timestamp: new Date().getTime(),
      reaction: null
    }, {
      sender_uns: false,
      content: textarea.current.value,
      timestamp: new Date().getTime(),
      reaction: null
    }, ...messages])
    textarea.current.value = "";
    setSendAvailable(false);
  }
  const onEnterPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code == "Enter" && e.shiftKey == false && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (textarea.current.value.length > 0) sendMessage();
    }
  }
  return (
    <div className={`${className} flex flex-col max-w-xs justify-end items-end space-y-2`}>
      {expand &&
        <div className="flex flex-col bg-background2 rounded-lg overflow-hidden text-background2">
          <div id="header" className="px-5 py-3 bg-main2">
            <div className="flex flex-row space-x-3 justify-center mb-2">
              <Link href={`https://www.instagram.com/${about.insta}`} className="flex flex-row items-center text-[13px] border-2 border-background2 px-2.5 py-1 rounded-full space-x-2 cursor-pointer hover:bg-background2 hover:text-main2 transition-all duration-500">
                <RiInstagramLine className="h-4 w-4" />
                <span>IG私訊</span>
              </Link>
              <Link href={`mailto:${about.email}`} className="flex flex-row items-center text-[13px] border-2 border-background2 px-2.5 py-1 rounded-full space-x-2 cursor-pointer hover:bg-background2 hover:text-main2 transition-all duration-500">
                <RiMailSendLine className="h-4 w-4" />
                <span>E-Mail</span>
              </Link>
            </div>
            <Image src={LogoSVG} alt="慈中後生 Logo" className="h-16" />
          </div>
          <div id="body" className="px-5 py-4 space-y-4">
            <div id="messages" className="flex flex-col-reverse space-y-3 pb-4 text-sm border-b border-main/30 max-h-72 overflow-y-auto scrollbar-hide">
              {messages.map((message, key) => {
                return (
                  <div key={key} className={`flex flex-col ${message.sender_uns ? "self-start" : "self-end"} max-w-sm`}>
                    {message.sender_uns && <span className="text-main2 text-xs px-1 pb-0.5">慈中後生</span>}
                    <div className="px-2 py-1 bg-main2 w-max max-w-[14em] rounded-lg"><span>{message.content}</span></div>
                    <span className="text-[8px] text-main2 self-end">{timestampBefrore(message.timestamp)}</span>
                  </div>
                )
              })}
            </div>
            <div id="interect" className="w-full text-main !mt-2">
              <div className="flex flex-row items-center justify-between relative">
                <textarea placeholder="請在此輸入訊息⋯⋯" ref={textarea} className="w-[15.5em] border-0 bg-transparent resize-none outline-none" rows={rowTextarea} onChange={handleTextArea} onKeyDown={onEnterPress} dir="auto" autoCapitalize="off" autoComplete="off" tabIndex={0} />
                {!!sendAvailable && <div className="absolute right-0 h-6 w-6 group" onClick={sendMessage}>
                  <RiSendPlaneFill className="absolute h-6 w-6 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer" />
                  <RiSendPlaneLine className="absolute h-6 w-6 opacity-100 group-hover:opacity-0 transition-all duration-300 cursor-pointer" />
                </div>}
              </div>
            </div>
            <textarea disabled rows={1} className="w-[15.5em] invisible absolute resize-none overflow-hidden" ref={hiddenTextarea}></textarea>
          </div>
        </div>
      }
      <div className={`flex justify-center items-center w-12 h-12 group ${expand ? "bg-main2" : "bg-main"} rounded-full transition-colors duration-500`} onClick={() => setExpand(!expand)}>
        {!expand && <RiChatSmile3Fill className="w-6 h-6 text-background absolute opacity-0 group-hover:opacity-100 transition-all duration-500" />}
        {!expand && <RiChatSmile3Line className="w-6 h-6 text-background absolute opacity-100 group-hover:opacity-0 transition-all duration-500" />}
        {expand && <RiCloseCircleFill className="w-6 h-6 text-background absolute opacity-0 group-hover:opacity-100 transition-all duration-500" />}
        {expand && <RiCloseCircleLine className="w-6 h-6 text-background absolute opacity-100 group-hover:opacity-0 transition-all duration-500" />}
      </div>
    </div>
  )
}

const timestampBefrore = (oldTimestamp: EpochTimeStamp) => {
  const nowTimestamp = new Date().getTime();
  const diff = Math.floor((nowTimestamp - oldTimestamp) / 1000);
  if (diff < 60) return `${diff} 秒前`
  else if (diff < 3600) return `${Math.floor(diff / 60)} 分前`
  else if (diff < 86400) return `${Math.floor(diff / 3600)} 小時前`
  else return `${Math.floor(diff / 86400)} 天前`
}