"use client";

import { accountDecoding } from "@/app/api/auth/[...nextauth]/auth";
import { BreadcrumbWrapper } from "@/components/breadcumb/breadcumb";
import { Loading } from "@/components/global/loading";
import { About } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { db } from "@/utils/firebase";
import { getPremissions } from "@/utils/get-firestore";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { getSession } from "next-auth/react";
import { ChangeEvent, useCallback, useEffect, useRef, useState, use } from "react";
import { RiPlaneFill } from "react-icons/ri";

export default function Page(props: { params: Promise<{ locale: LangCode }> }) {
  const params = use(props.params);
  const locale = params.locale;
  const dataFetchedRef = useRef<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [serverSnapshot, setServerSnapshot] = useState<About>();
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    onSnapshot(doc(db, "Global", "About"), snapshot => {
      setServerSnapshot(snapshot.data() as About);
    })
  })
  return (
    <>
      <BreadcrumbWrapper args={[{ title: webInfo.webMap.admin.title(locale) as string, href: webInfo.webMap.admin.href, icon: webInfo.webMap.admin.nav.icon }, { title: webInfo.webMap.admin.child.website.title(locale) as string, href: webInfo.webMap.admin.child.website.href, icon: webInfo.webMap.admin.child.website.nav.icon }]} />
      {serverSnapshot && !uploading ?
        <div className='flex flex-col text-main mt-4'>
          <div className="flex flex-col md:flex-row gap-8">
            <InputField text="Instagram 帳號" value={serverSnapshot.insta} onClick={async (value: string) => { setUploading(true); await updateDoc(doc(db, "Global", "About"), { insta: value }); setUploading(false) }} />
            <InputField text="Email 地址" value={serverSnapshot.email} onClick={async (value: string) => { setUploading(true); await updateDoc(doc(db, "Global", "About"), { email: value }); setUploading(false) }} />
          </div>
          <TextAreaField text="請輸入介紹（中文）" value={serverSnapshot.zh.description} onClick={async (value: string) => { setUploading(true); await updateDoc(doc(db, "Global", "About"), { zh: { description: value } }); setUploading(false) }} />
          <TextAreaField text="請輸入介紹（英文）" value={serverSnapshot.en.description} onClick={async (value: string) => { setUploading(true); await updateDoc(doc(db, "Global", "About"), { en: { description: value } }); setUploading(false) }} />
          <TextAreaField text="請輸入介紹（德文）" value={serverSnapshot.de.description} onClick={async (value: string) => { setUploading(true); await updateDoc(doc(db, "Global", "About"), { de: { description: value } }); setUploading(false) }} />
          <TextAreaField text="請輸入介紹（日文）" value={serverSnapshot.ja.description} onClick={async (value: string) => { setUploading(true); await updateDoc(doc(db, "Global", "About"), { ja: { description: value } }); setUploading(false) }} />
        </div>
        : <div className="min-h-[74vh] w-full flex justify-center items-center"><Loading text={serverSnapshot ? "上傳中" : "載入中"} /></div>}
    </>
  )
}

const TextAreaField = ({ text, value, onClick }: { text: string; value: string; onClick: any }) => {
  const [rowTextarea, setTextarea] = useState<number>(1);
  const [rowTextareaValue, setTextareaValue] = useState<string>("");
  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const hiddenTextarea = document.querySelector("#hidden-textarea") as HTMLTextAreaElement;
    setTextareaValue(e.target.value);
    if (hiddenTextarea) {
      setTextarea(hiddenTextarea.scrollHeight / 24);
    }
  }
  const onRefChange = useCallback((node: HTMLTextAreaElement) => {
    if (node === null) return;
    const lookMount = setInterval(() => {
      if (node.scrollHeight !== 0) {
        clearInterval(lookMount);
        setTextarea(node.scrollHeight / 24);
      }
    }, 1)
  }, []);
  useEffect(() => { setTextareaValue(value); }, [value])
  const clickWithPremissionsCheck = async () => {
    const session = await getSession();
    const account = accountDecoding(session.account);
    const premissions = session?.account ? await getPremissions(account) : false;
    if (!premissions || (!premissions.includes("ALL_ALLOWED") && !premissions.includes("WEBSITE_EDITABLE"))) {
      const originalText = rowTextareaValue;
      setTextareaValue("您的權限無法進行修改!!");
      return setTimeout(() => setTextareaValue(originalText), 3000)
    };
    onClick(rowTextareaValue);
  }
  return (
    <div className='w-full flex flex-col justify-center text-main2'>
      <h1 className='text-xl font-bold mb-4 text-main'>{text}</h1>
      <textarea id="textarea" className="text-base resize-none w-[83vw] bg-transparent focus:outline-none" rows={rowTextarea} value={rowTextareaValue} placeholder="請輸入⋯⋯" onChange={handleTextArea} />
      <textarea id="hidden-textarea" className="text-base resize-none w-[83vw] invisible absolute overflow-hidden" rows={1} ref={onRefChange} value={rowTextareaValue} disabled></textarea>
      <button className='group flex flex-row items-center space-x-2 self-end mt-6 select-none cursor-pointer disabled:cursor-default text-main2 disabled:opacity-70' onClick={clickWithPremissionsCheck}>
        <RiPlaneFill className='h-4 w-4 md:h-5 md:w-5 rotate-[35deg] group-enabled:group-hover:rotate-[90deg] transition-all duration-300 mb-0.5' />
        <span className='md:text-lg group-enabled:group-hover:font-medium transition-all duration-300'>更改</span>
      </button>
    </div>
  )
}

const InputField = ({ text, value, onClick }: { text: string; value: string; onClick: any }) => {
  const [textValue, setTextValue] = useState<string>("");
  useEffect(() => { setTextValue(value); }, [value])
  const clickWithPremissionsCheck = async () => {
    const session = await getSession();
    const account = accountDecoding(session.account);
    const premissions = session?.account ? await getPremissions(account) : false;
    if (!premissions || (!premissions.includes("ALL_ALLOWED") && !premissions.includes("WEBSITE_EDITABLE"))) {
      const originalText = textValue;
      setTextValue("您的權限無法進行修改!!");
      return setTimeout(() => setTextValue(originalText), 3000)
    };
    onClick(textValue);
  }
  return (
    <div className='w-full flex flex-col justify-center text-main2'>
      <h1 className='text-xl font-bold mb-4 text-main'>{text}</h1>
      <input value={textValue} onChange={(e) => setTextValue(e.target.value)} className="text-lg resize-none bg-transparent focus:outline-none mt-2" placeholder="請輸入簡述" />
      <button className='group flex flex-row items-center space-x-2 self-end mt-6 select-none cursor-pointer disabled:cursor-default text-main2 disabled:opacity-70' onClick={clickWithPremissionsCheck}>
        <RiPlaneFill className='h-4 w-4 md:h-5 md:w-5 rotate-[35deg] group-enabled:group-hover:rotate-[90deg] transition-all duration-300 mb-0.5' />
        <span className='md:text-lg group-enabled:group-hover:font-medium transition-all duration-300'>更改</span>
      </button>
    </div>
  )
}
