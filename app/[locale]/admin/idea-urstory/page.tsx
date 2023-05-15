/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { BreadcrumbWrapper } from "@/components/breadcumb/breadcumb";
import { HoverICON } from "@/components/global/hover-icon";
import { Loading } from "@/components/global/loading";
import { IdeaUrStory, IdeaUrStoryConfig } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { db } from "@/utils/firebase";
import { timestamp2Chinese } from "@/utils/timestamp";
import { Tab } from "@headlessui/react";
import { arrayRemove } from "firebase/firestore";
import { arrayUnion } from "firebase/firestore";
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { toBlob } from 'html-to-image';
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RiCheckLine, RiCloseLine, RiImage2Fill, RiImage2Line, RiMailCheckFill, RiMailCheckLine, RiMailCloseFill, RiMailCloseLine, RiMailUnreadFill, RiMailUnreadLine, RiMic2Fill, RiMic2Line, RiPlaneFill, RiQuillPenFill, RiQuillPenLine, RiSettings2Fill, RiSettings2Line, RiShareBoxFill, RiShareBoxLine } from "react-icons/ri";

const sections = [{
  title: "筆墨",
  section: 1,
  icon: RiQuillPenLine,
  iconHover: RiQuillPenFill,
}, {
  title: "語音",
  section: 2,
  icon: RiMic2Line,
  iconHover: RiMic2Fill,
}, {
  title: "圖片",
  section: 3,
  icon: RiImage2Line,
  iconHover: RiImage2Fill,
},]

export default function AdminUrStory({ params }: { params: { locale: LangCode } }) {
  const dataFetchedRef = useRef<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [serverSnapshot, setServerSnapshot] = useState<{ id: string; data: IdeaUrStory }[]>();
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    onSnapshot(query(collection(db, 'idea-urstory'), orderBy("createdTimestamp", 'desc')), snapshot => {
      setServerSnapshot(snapshot.docs.map((doc) => {
        return { id: doc.id, data: doc.data() as IdeaUrStory };
      }));
    })
  }, [])

  return (
    <div>
      <BreadcrumbWrapper args={[{ title: webInfo.webMap.admin.title(params.locale) as string, href: webInfo.webMap.admin.href, icon: webInfo.webMap.admin.nav.icon }, { title: webInfo.webMap.admin.child.ideaUrStory.title(params.locale) as string, href: webInfo.webMap.admin.child.ideaUrStory.href, icon: webInfo.webMap.admin.child.ideaUrStory.nav.icon }]} />
      {!serverSnapshot && <div className="min-h-[74vh] w-full flex justify-center items-center"><Loading text="正在載入中" /></div>}
      {serverSnapshot && <div className='max-w-[21.5em] md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto my-8'>
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex flex-row space-x-4 justify-center">
            <Tab as='div' className="flex flex-col md:flex-row items-center relative rounded bg-main group text-background px-4 py-2 md:text-lg space-x-2 hover:bg-background2 hover:text-main ui-selected:bg-main2 transition-all duration-500 outline-none cursor-pointer">
              <div className='absolute -top-3 -right-2 text-sm bg-main2 rounded-full px-[6px] text-background2'>{serverSnapshot?.filter((doc) => !(doc.data as any).status).length}</div>
              <HoverICON className='w-6 h-6' Icon={RiMailUnreadLine} IconHover={RiMailUnreadFill} size={6} />
              <span>新投稿</span>
            </Tab>
            <Tab as='div' className="flex flex-col md:flex-row items-center relative rounded bg-main group text-background px-4 py-2 md:text-lg space-x-2 hover:bg-background2 hover:text-main ui-selected:bg-main2 transition-all duration-500 outline-none cursor-pointer">
              <div className='absolute -top-3 -right-2 text-sm bg-main2 rounded-full px-[6px] text-background2'>{serverSnapshot?.filter((doc) => (doc.data as any).status === 1).length}</div>
              <HoverICON className='w-6 h-6' Icon={RiMailCheckLine} IconHover={RiMailCheckFill} size={6} />
              <span>已確認</span>
            </Tab>
            <Tab as='div' className="flex flex-col md:flex-row items-center relative rounded bg-main group text-background px-4 py-2 md:text-lg space-x-2 hover:bg-background2 hover:text-main ui-selected:bg-main2 transition-all duration-500 outline-none cursor-pointer">
              <div className='absolute -top-3 -right-2 text-sm bg-main2 rounded-full px-[6px] text-background2'>{serverSnapshot?.filter((doc) => (doc.data as any).status === 2).length}</div>
              <HoverICON className='w-6 h-6' Icon={RiMailCloseLine} IconHover={RiMailCloseFill} size={6} />
              <span>已退回</span>
            </Tab>
            <Tab as='div' className="flex flex-col md:flex-row items-center relative rounded bg-main group text-background px-4 py-2 md:text-lg space-x-2 hover:bg-background2 hover:text-main ui-selected:bg-main2 transition-all duration-500 outline-none cursor-pointer">
              <HoverICON className='w-6 h-6' Icon={RiSettings2Line} IconHover={RiSettings2Fill} size={6} />
              <span>頁面設定</span>
            </Tab>
          </Tab.List>
          <Tab.Panels className='-ml-6 w-max h-max'>
            <Tab.Panel>
              {serverSnapshot?.filter((doc) => !(doc.data as any).status).map((doc, key) => (
                <CardWrapper data={doc} key={key} />
              ))}
            </Tab.Panel>
            <Tab.Panel>
              {serverSnapshot?.filter((doc) => (doc.data as any).status === 1).map((doc, key) => (
                <CardWrapper data={doc} key={key} />
              ))}
            </Tab.Panel>
            <Tab.Panel>
              {serverSnapshot?.filter((doc) => (doc.data as any).status === 2).map((doc, key) => (
                <CardWrapper data={doc} key={key} />
              ))}
            </Tab.Panel>
            <Tab.Panel>
              <SettingsPanel />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>}
    </div>
  )
}

const CardWrapper = ({ data }: { data: { id: string; data: IdeaUrStory } }) => {
  const type: number = data.data.type === "text" ? 0 : (data.data.type === "voice" ? 1 : 2);
  const [sharing, setSharing] = useState<boolean>(false);
  const [changeStatus, setChangeStatus] = useState<boolean>(false);
  const onShareClick = async () => {
    if (!navigator.canShare) return alert(`您的瀏覽器不支援分享`);
    setSharing(true);
    try {
      const blob = await toBlob(document.getElementById(data.id)!);
      const file = new File([blob!], `${sections[type].title}-${data.id}.png`, { type: blob!.type });
      setTimeout(() => {
        setSharing(false);
      }, 3000)
      const share = await navigator.share({
        title: '分享回覆！',
        text: `${sections[type].title} - ${data.data.type === "text" ? data.data.content : data.data.url}`,
        files: [file],
      });
    } catch (error: any) {
      if (error.toString().includes('AbortError')) {
        console.log("Aborted")
      }
      alert(`Error: ${error}`);
    }
    setSharing(false);
  }
  const onConfirmClick = async () => {
    setChangeStatus(true);
    await updateDoc(doc(db, "idea-urstory", data.id), {
      status: 1
    })
    setChangeStatus(false);
  }
  const onDeleteClick = async () => {
    setChangeStatus(true);
    await updateDoc(doc(db, "idea-urstory", data.id), {
      status: 2
    })
    setChangeStatus(false);
  }
  return (<div id={data.id} className='flex flex-col space-y-2 group w-fit bg-backgroun2 px-6 py-4'>
    <div className='flex flex-row justify-between items-end'>
      {sections.flatMap((section, key) => {
        if (key !== type) return [];
        return (
          <div className='flex felx-row text-main group-hover:text-main2 space-x-2 items-end'>
            <div className='relative w-7 h-7'>
              {section.icon && <section.icon className='absolute opacity-100 group-hover:opacity-0 w-7 h-7 transition-all duration-300' />}
              {section.iconHover && <section.iconHover className='absolute opacity-0 group-hover:opacity-100 w-7 h-7 transition-all duration-300' />}
            </div>
            <span className='text-lg font-medium transition-all duration-300'>{section.title}</span>
          </div>
        )
      })}
      {!sharing && <div className='flex flex-row items-center space-x-4'>
        {changeStatus && <div role="status" className='flex flex-row items-center text-main2 space-x-2 select-none'>
          <svg aria-hidden="true" className="w-5 h-5 animate-spin fill-main" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span>處理中...</span>
        </div>}
        {!changeStatus && <>
          <div className='flex flex-row space-x-2 text-main hover:text-main2 cursor-pointer' onClick={onConfirmClick}>
            <RiCheckLine className='w-6 h-6' />
            <span>確認</span>
          </div>
          <div className='flex flex-row space-x-2 text-main hover:text-main2 cursor-pointer' onClick={onDeleteClick}>
            <RiCloseLine className='w-6 h-6' />
            <span>退回</span>
          </div>
        </>}
        <div className={`flex flex-row cursor-pointer items-center space-x-2 group text-main hover:text-main2 ${sharing ? "hidden" : ""}`} onClick={onShareClick}>
          <div className='relative w-5 h-5'>
            <RiShareBoxFill className='absolute w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300' />
            <RiShareBoxLine className='absolute w-5 h-5 opacity-100 group-hover:opacity-0 transition-all duration-300' />
          </div>
          <span>分享</span>
        </div>
      </div>}
    </div>
    <div className='border-main group-hover:border-main2 text-main group-hover:text-main2 border-2 rounded-md px-6 py-4 w-fit flex flex-col min-w-[350px] max-w-[64vw] md:max-w-[75vw]'>
      {data.data.type === "picture" && <div className="relative w-[65vw] md:w-[75vw] max-h-[75vw] aspect-video"><Image className='object-contain w-auto h-auto' fill={true} src={data.data.url!} alt="您的上傳，如果你看不到他可能代表您的網路不佳否則就代表你失敗了" /></div>}
      {data.data.type === "voice" && <audio controls><source src={data.data.url} />您的瀏覽器不支援播放啊啊啊！</audio>}
      <div className={`space-x-1 ${data.data.type !== "text" ? "mt-3" : ""}`}>
        {data.data.type !== "text" && <span className='transition-all duration-300 font-medium w-fit'>簡述：</span>}
        <span className='transition-all duration-300'>{data.data.content}</span>
      </div>
      <span className='text-xs opacity-70 transition-all duration-300 w-full text-right mt-2'>{timestamp2Chinese((data.data.createdTimestamp as any).seconds)}</span>
    </div>
  </div >)
}

const SettingsPanel = () => {
  const dataFetchedRef = useRef<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [serverSnapshot, setServerSnapshot] = useState<IdeaUrStoryConfig>();
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    onSnapshot(doc(db, "idea-urstory", "config"), snapshot => {
      if (snapshot.exists()) {
        setServerSnapshot(snapshot.data() as IdeaUrStoryConfig);
      }
    })
  }, [])
  const onInputClick = async (value: any) => {
    setUploading(true);
    await updateDoc(doc(db, "idea-urstory", "config"), { ...value });
    setUploading(false);
  }
  const onCheckedClick = async (checked: boolean, value: any) => {
    setUploading(true);
    if (checked) {
      await updateDoc(doc(db, "idea-urstory", "config"), { accept: arrayUnion(value) });
    } else {
      await updateDoc(doc(db, "idea-urstory", "config"), { accept: arrayRemove(value) });
    }
    setUploading(false);
  }
  return (
    <div className="absolute left-1/2 -translate-x-1/2 mx-auto">
      {!serverSnapshot || uploading && <div className="min-h-[74vh] w-full flex justify-center items-center"><Loading text={serverSnapshot ? "更改中" : "載入中"} /></div>}
      {serverSnapshot && <div className='flex flex-col text-main mt-4'>
        <div className="flex flex-col md:flex-row gap-8">
          <InputField text="主題名稱" value={serverSnapshot.name} onClick={(value: string) => { onInputClick({ name: value }) }} />
          <InputField text="版本" value={serverSnapshot.version} onClick={(value: string) => { onInputClick({ version: value }) }} />
        </div>
        <InputField text="電腦版才會出現的簡述" value={serverSnapshot.description} onClick={(value: string) => { onInputClick({ description: value }) }} />
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex flex-row items-center text-sm space-x-2">
            <input type="checkbox" name="thumbnail_undecide" checked={serverSnapshot.accept.includes(1)} onChange={(e) => { onCheckedClick(e.target.checked, 1) }} />
            <label>筆墨</label>
          </div>
          <div className="flex flex-row items-center text-sm space-x-2">
            <input type="checkbox" name="thumbnail_undecide" checked={serverSnapshot.accept.includes(2)} onChange={(e) => { onCheckedClick(e.target.checked, 2) }} />
            <label>語音</label>
          </div>
          <div className="flex flex-row items-center text-sm space-x-2">
            <input type="checkbox" name="thumbnail_undecide" checked={serverSnapshot.accept.includes(3)} onChange={(e) => { onCheckedClick(e.target.checked, 3) }} />
            <label>圖片</label>
          </div>
        </div>
      </div>}
    </div>
  )
}

const InputField = ({ text, value, onClick }: { text: string; value: string; onClick: any }) => {
  const [textValue, setTextValue] = useState<string>("");
  useEffect(() => { setTextValue(value); }, [value])
  return (
    <div className='w-full flex flex-col justify-center text-main2'>
      <h1 className='text-xl font-bold mb-4 text-main'>{text}</h1>
      <input value={textValue} onChange={(e) => setTextValue(e.target.value)} className="text-lg resize-none bg-transparent focus:outline-none mt-2" placeholder="請輸入簡述" />
      <button className='group flex flex-row items-center space-x-2 self-end mt-6 select-none cursor-pointer disabled:cursor-default text-main2 disabled:opacity-70' onClick={() => onClick(textValue)}>
        <RiPlaneFill className='h-4 w-4 md:h-5 md:w-5 rotate-[35deg] group-enabled:group-hover:rotate-[90deg] transition-all duration-300 mb-0.5' />
        <span className='md:text-lg group-enabled:group-hover:font-medium transition-all duration-300'>更改</span>
      </button>
    </div>
  )
}