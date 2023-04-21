"use client";

import { BreadcrumbWrapper } from "@/components/breadcumb/breadcumb";
import { HoverICON } from "@/components/global/hover-icon";
import { Loading } from "@/components/global/loading";
import { NotificationElement } from "@/components/notification/notification";
import { Notification } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { db } from "@/utils/firebase";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc, writeBatch } from "firebase/firestore";
import { ChangeEvent, RefObject, useEffect, useRef, useState } from "react";
import { RiArrowDownCircleFill, RiArrowDownCircleLine, RiArrowUpCircleFill, RiArrowUpCircleLine } from "react-icons/ri";

const defaultNotification: Notification = {
  order: 0,
  button: {
    href: "/",
    text: "連結文字"
  },
  title: "通知預覽",
  type: "alert"
}

export default function AdminNotifications({ params }: { params: { locale: LangCode } }) {
  // const t = new i18n<typeof i18nDefault>(params.locale, "index");
  const dataFetchedRef = useRef<boolean>(false);
  const [serverSnapshot, setServerSnapshot] = useState<{ id: string; data: Notification }[]>();
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    onSnapshot(query(collection(db, 'notifications'), orderBy("order", 'asc')), snapshot => {
      setServerSnapshot(snapshot.docs.map((doc) => {
        return { id: doc.id, data: doc.data() as Notification };
      }));
    })
  })
  return (
    <>
      <BreadcrumbWrapper args={[{ title: webInfo.webMap.admin.title(params.locale) as string, href: webInfo.webMap.admin.href, icon: webInfo.webMap.admin.nav.icon }, { title: webInfo.webMap.admin.child.notification.title(params.locale) as string, href: webInfo.webMap.admin.child.notification.href, icon: webInfo.webMap.admin.child.notification.nav.icon }]} />
      {serverSnapshot ?
        <div className='flex flex-col text-main mt-4 space-y-6'>
          <div>
            <h2 className="text-2xl font-medium">當前通知：</h2>
            <div className="flex flex-col space-y-2 mt-2">
              {serverSnapshot.map((noti, key) => <NotificationElement noti={noti.data} key={key} />)}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-medium">新增通知：</h2>
            <OperationsWrapper noti={defaultNotification} order={serverSnapshot.length} serverSnapshot={serverSnapshot} />
          </div>
          <div>
            <h2 className="text-lg font-medium">編輯通知：</h2>
            {serverSnapshot.map((noti, key) => <OperationsWrapper nId={serverSnapshot[key].id} noti={serverSnapshot[key].data} order={serverSnapshot[key].data.order} key={key} serverSnapshot={serverSnapshot} />)}
          </div>
        </div>
        : <div className="min-h-[74vh] w-full flex justify-center items-center"><Loading text="載入中" /></div>}
    </>
  )
}

const OperationsWrapper = ({ nId = "", noti, order, serverSnapshot }: { nId?: string; noti: Notification, order: number; serverSnapshot: { id: string; data: Notification }[] }) => {
  const refs = [useRef<HTMLSelectElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const [uploading, setUploading] = useState<boolean>(false);
  const [Noti, setNoti] = useState<Notification>(noti);
  useEffect(() => {
    setNoti(noti);
  }, [noti]);
  useEffect(() => {
    if (Noti.title === "") setNoti({ ...Noti, title: "通知預覽" });
    if (Noti.button.text === "") setNoti({ ...Noti, button: { ...Noti.button, text: "連結文字" } });
    if (Noti.button.href === "") setNoti({ ...Noti, button: { ...Noti.button, href: "/" } });
  }, [Noti]);
  const onSubmit = async (noti: Notification) => {
    if (!noti.type || !noti.title || !noti.button.text || !noti.button.href) return;
    setUploading(true);
    if (!nId) {
      if (!serverSnapshot) return;
      noti.order = serverSnapshot.reduce((prev, curr) => prev.data.order > curr.data.order ? prev : curr).data.order + 1;
      await addDoc(collection(db, "notifications"), noti);
    }
    else if (nId) await updateDoc(doc(db, "notifications", nId), { ...noti });
    setUploading(false);
    setNoti(noti);
  }
  const onCancel = async () => {
    if (!nId) setNoti(noti);
    else {
      setUploading(true);
      await deleteDoc(doc(db, "notifications", nId));
      setUploading(false);
    }
  }
  const onOrderChange = async (top: boolean) => {
    if (!nId || !serverSnapshot) return;
    else {
      const operatingObject = serverSnapshot.filter(({ data }) => data.order === order)[0];
      const swapingObjectChoices = serverSnapshot.filter(({ data }) => top ? data.order < order : data.order > order);
      if (swapingObjectChoices.length <= 0) return;
      const swapingObject = swapingObjectChoices.reduce((prev, curr) => top ? (prev.data.order > curr.data.order ? prev : curr) : (prev.data.order < curr.data.order ? prev : curr));
      if (!swapingObject) return;
      setUploading(true);
      const batch = writeBatch(db);
      operatingObject.data.order -= top ? 1 : -1;
      swapingObject.data.order += top ? 1 : -1;
      batch.update(doc(db, "notifications", operatingObject.id), { ...operatingObject.data });
      batch.update(doc(db, "notifications", swapingObject.id), { ...swapingObject.data });
      await batch.commit();
      setUploading(false);
    }
  }
  return (
    <div className="flex flex-col space-y-2 mt-2">
      <NotificationElement noti={Noti} />
      {uploading ? <div className="flex justify-center items-center w-full !mb-6"><Loading className="!flex-row space-x-4 items-center" text="正在處理中" /></div> : <><div className='flex flex-row flex-wrap mt-2 md:space-x-8'>
        <NotiTypeSelect defaultValue={noti.type} Ref={refs[0]} onChange={(e) => { setNoti({ ...Noti, type: e.target.value as any }) }} />
        <InputField placeholder='請輸入標題！' defaultValue={noti.title === "通知預覽" ? "" : noti.title} Ref={refs[1]} onChange={(e) => { setNoti({ ...Noti, title: e.target.value }) }} />
        <InputField className="grow mt-2 md:mt-0 md:grow-0" placeholder='按鈕文字' defaultValue={noti.button.text === "連結文字" ? "" : noti.button.text} Ref={refs[2]} onChange={(e) => { setNoti({ ...Noti, button: { ...Noti.button, text: e.target.value } }) }} />
        <InputField className="grow mt-2 md:mt-0 md:grow-0" placeholder='按鈕連結' defaultValue={noti.button.href === "/" ? "" : noti.button.href} Ref={refs[3]} onChange={(e) => { setNoti({ ...Noti, button: { ...Noti.button, href: e.target.value } }) }} />
      </div>
        <OperationsButton type={nId ? "edit" : "add"} text={{ confirm: nId ? "更改通知" : "新增", cancel: nId ? "刪除通知" : "取消" }} disabled={false} onSubmit={() => {
          onSubmit({
            order: order,
            type: refs[0].current?.value as any,
            title: refs[1].current?.value as any,
            button: {
              text: refs[2].current?.value as any,
              href: refs[3].current?.value as any,
            }
          })
        }} onCancel={() => onCancel()} onOrderChange={(e: boolean) => onOrderChange(e)} /></>}
    </div >
  )
}

const NotiTypeSelect = ({ defaultValue = "success", Ref, onChange }: { defaultValue?: string; Ref: RefObject<any>; onChange: (e: ChangeEvent<HTMLSelectElement>) => void; }) => {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => setValue(defaultValue), [defaultValue]);
  return <select className='flex mr-4 md:mr-0 text-main bg-transparent border-b border-main outline-none focus:text-main2 rounded-lg' placeholder='選取模式！' value={value} ref={Ref} onChange={(e) => { setValue(e.target.value); onChange; }}>
    <option key={1} value={"alert"}>{"警示"}</option>
    <option key={2} value={"success"}>{"成功"}</option>
    <option key={3} value={"error"}>{"失敗"}</option>
  </select>
}

const InputField = ({ className = "", placeholder, defaultValue = "", Ref, onChange }: { className?: string; placeholder: string, defaultValue?: string; Ref: RefObject<any>; onChange: (e: ChangeEvent<HTMLInputElement>) => void; }) => {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => setValue(defaultValue), [defaultValue]);
  return <input className={`flex grow text-main bg-transparent border-b border-main outline-none focus:text-main2 focus:border-main2 ${className}`} placeholder={placeholder} value={value} ref={Ref} onChange={(e) => { setValue(e.target.value); onChange; }} />
}

const OperationsButton = ({ type, text, disabled, onSubmit, onCancel, onOrderChange }: { type: "add" | "edit"; text: { confirm: string; cancel: string; }; disabled: boolean; onSubmit: any; onCancel: any; onOrderChange: any }) => (
  <div className="flex flex-col md:flex-row space-x-4">
    <div className='grid grid-rows-2 md:grid-cols-2 md:grid-rows-1 md:gap-8 w-full mt-4'>
      <button className='px-3 py-2 bg-red-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0' onClick={onCancel}>{text.cancel}</button>
      <button disabled={disabled} className='px-3 py-2 bg-green-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0 disabled:bg-green-600/70' onClick={onSubmit}>{text.confirm}</button>
    </div>
    {type === "edit" && <div className="flex flex-row justify-around space-x-2 items-end mt-2 md:mt-0">
      <div className="flex flex-row md:block items-center space-x-1" onClick={() => onOrderChange(true)}>
        <HoverICON className="group h-7 w-7 cursor-pointer" size={7} Icon={RiArrowUpCircleLine} IconHover={RiArrowUpCircleFill} />
        <span className="md:hidden">向上移動</span>
      </div>
      <div className="flex flex-row md:block items-center space-x-1" onClick={() => onOrderChange(false)}>
        <HoverICON className="group h-7 w-7 cursor-pointer" size={7} Icon={RiArrowDownCircleLine} IconHover={RiArrowDownCircleFill} />
        <span className="md:hidden">向下移動</span>
      </div>
    </div>}
  </div>
)