/* eslint-disable react-hooks/exhaustive-deps */
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { RiCheckLine, RiCloseLine, RiImage2Fill, RiImage2Line, RiMailCheckFill, RiMailCheckLine, RiMailCloseFill, RiMailCloseLine, RiMailUnreadFill, RiMailUnreadLine, RiMic2Fill, RiMic2Line, RiQuillPenFill, RiQuillPenLine, RiShareBoxFill, RiShareBoxLine } from 'react-icons/ri';
import HeadUni from '../../components/head-uni';
import { IdeaNavbar } from '../../components/idea-navbar';
import { langCode } from '../../language/lang';
import { db } from '../../utils/firebase';
import { IdeaUrStory } from './ur-story';
import { timestamp2Chinese } from '../posts/[pid]';
import Image from 'next/image';
import { toBlob } from 'html-to-image';
import { Tab } from '@headlessui/react';

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

const UrStoryList = () => {
  const dataFetchedRef = useRef<boolean>(false);
  const router = useRouter();
  const lang = router.locale ? router.locale as langCode : "zh";
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [severSnapshot, setServerSnapshot] = useState<{ id: string; data: IdeaUrStory }[]>();
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    onSnapshot(query(collection(db, 'idea-urstory'), orderBy("createdTimestamp", 'desc')), snapshot => {
      setServerSnapshot(snapshot.docs.map((doc) => {
        return { id: doc.id, data: doc.data() as IdeaUrStory };
      }));
    })
  }, [])
  useEffect(() => {
    console.log(severSnapshot)
  }, [severSnapshot])

  return (
    <div className='min-h-screen overflow-hidden bg-background'>
      <HeadUni title={"[回覆] 你的故事，我們來寫"} imagePath='https://firebasestorage.googleapis.com/v0/b/tcsh-periodicals.appspot.com/o/posts%2Fimage%2FIzrbxIQJHa3Z3VDPJR?alt=media&token=f970c48a-a9ab-4067-afd0-6a0120f98756' description={"生活中，我們總會面臨各式各樣的事，或好或壞。只要你願意與我們分享，不限題材，我們團隊就會將你的故事以文字、圖像定期呈現在刊物、貼文或限時動態與大家分享。"} lang={lang} pages='/idea/ur-story' />
      <IdeaNavbar lang={lang} />
      {!severSnapshot && <div className='min-h-[74vh] w-full flex flex-col justify-center items-center text-main my-8'>
        <div role="status">
          <svg aria-hidden="true" className="w-14 h-14 animate-spin text-main2 fill-main" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">載入中...</span>
        </div>
        <span className='text-lg font-medium text-main mt-2'>正在載入中</span>
      </div>}
      {severSnapshot && <div className='max-w-[21.5em] md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto my-8'>
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex flex-row space-x-4 justify-center">
            <Tab as='div' className="flex flex-col md:flex-row items-center relative rounded bg-main group text-background px-4 py-2 md:text-lg space-x-2 hover:bg-background2 hover:text-main ui-selected:bg-main2 transition-all duration-500 outline-none cursor-pointer">
              <div className='absolute -top-3 -right-2 text-sm bg-main2 rounded-full px-[6px] text-background2'>{severSnapshot?.filter((doc) => (doc.data as any).status == 0).length}</div>
              <div className='relative w-6 h-6'>
                <RiMailUnreadFill className='absolute w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                <RiMailUnreadLine className='absolute w-6 h-6 opacity-100 group-hover:opacity-0 transition-opacity duration-500' />
              </div>
              <span>新投稿</span>
            </Tab>
            <Tab as='div' className="flex flex-col md:flex-row items-center relative rounded bg-main group text-background px-4 py-2 md:text-lg space-x-2 hover:bg-background2 hover:text-main ui-selected:bg-main2 transition-all duration-500 outline-none cursor-pointer">
              <div className='absolute -top-3 -right-2 text-sm bg-main2 rounded-full px-[6px] text-background2'>{severSnapshot?.filter((doc) => (doc.data as any).status === 1).length}</div>
              <div className='relative w-6 h-6'>
                <RiMailCheckFill className='absolute w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                <RiMailCheckLine className='absolute w-6 h-6 opacity-100 group-hover:opacity-0 transition-opacity duration-500' />
              </div>
              <span>已確認</span>
            </Tab>
            <Tab as='div' className="flex flex-col md:flex-row items-center relative rounded bg-main group text-background px-4 py-2 md:text-lg space-x-2 hover:bg-background2 hover:text-main ui-selected:bg-main2 transition-all duration-500 outline-none cursor-pointer">
              <div className='absolute -top-3 -right-2 text-sm bg-main2 rounded-full px-[6px] text-background2'>{severSnapshot?.filter((doc) => (doc.data as any).status === 2).length}</div>
              <div className='relative w-6 h-6'>
                <RiMailCloseFill className='absolute w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                <RiMailCloseLine className='absolute w-6 h-6 opacity-100 group-hover:opacity-0 transition-opacity duration-500' />
              </div>
              <span>已退回</span>
            </Tab>
          </Tab.List>
          <Tab.Panels className='-ml-6 w-max'>
            <Tab.Panel>
              {severSnapshot?.filter((doc) => (doc.data as any).status == 0 ).map((doc, key) => (
                <CardWrapper data={doc} key={key} />
              ))}
            </Tab.Panel>
            <Tab.Panel>
              {severSnapshot?.filter((doc) => (doc.data as any).status === 1 ).map((doc, key) => (
                <CardWrapper data={doc} key={key} />
              ))}
            </Tab.Panel>
            <Tab.Panel>
              {severSnapshot?.filter((doc) => (doc.data as any).status === 2 ).map((doc, key) => (
                <CardWrapper data={doc} key={key} />
              ))}
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
  return (<div id={data.id} className='flex flex-col space-y-2 group w-fit bg-background px-6 py-4'>
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

export default UrStoryList;