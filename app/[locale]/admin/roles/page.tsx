/* eslint-disable react-hooks/exhaustive-deps */
"use client";

const _ = require('lodash');
import { AdminManageWrapper } from "@/components/admin/admin";
import { BreadcrumbWrapper } from "@/components/breadcumb/breadcumb";
import { HoverICON } from "@/components/global/hover-icon";
import { Loading } from "@/components/global/loading";
import i18nDefault from '@/translation/ebook/zh.json';
import { Account, EbookLicenses } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { colors, webInfo } from "@/utils/config";
import { createEbookVoucher, makeid } from "@/utils/ebook-voucher";
import { db, storage } from "@/utils/firebase";
import i18n from "@/utils/i18n";
import { MemberRole } from "@/utils/role";
import { timestamp2Chinese } from "@/utils/timestamp";
import { Popover, Tab } from "@headlessui/react";
import { ArcElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip } from "chart.js";
import { addDoc, collection, deleteDoc, doc, DocumentData, DocumentReference, getDoc, getDocs, onSnapshot, orderBy, query, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { Line } from 'react-chartjs-2';
import { RiAddCircleFill, RiAddCircleLine, RiArrowRightSFill, RiArrowRightSLine, RiCheckDoubleFill, RiClipboardFill, RiClipboardLine, RiDeleteBin5Fill, RiDeleteBin5Line, RiEdit2Fill, RiEdit2Line, RiInformationFill, RiInformationLine, RiKey2Fill, RiKey2Line, RiLineChartFill, RiLineChartLine, RiUser5Line } from "react-icons/ri";


export default function AdminEbooks({ params }: { params: { locale: LangCode } }) {
  const t = new i18n<typeof i18nDefault>(params.locale, "ebook");
  const dataFetchedRef = useRef<boolean>(false);
  const [serverSnapshot, setServerSnapshot] = useState<Role[]>();
  const [selectedRoleId, setSelectedRoleId] = useState<string>();
  const [selectedRole, setSelectedRole] = useState<Role>();
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    onSnapshot(query(collection(db, 'roles'), orderBy("id", 'asc')), snapshot => {
      setServerSnapshot(snapshot.docs.map((doc) => {
        return { docId: doc.id, id: doc.data().id, name: doc.data().name, premissions: doc.data().premissions };
      }));
      setSelectedRoleId(snapshot.docs[0].id)
    })
  })
  useEffect(() => {
    setSelectedRole(serverSnapshot?.find((t) => t.docId === selectedRoleId));
  }, [selectedRoleId])
  return (
    <>
      <BreadcrumbWrapper args={[{ title: webInfo.webMap.admin.title(params.locale) as string, href: webInfo.webMap.admin.href, icon: webInfo.webMap.admin.nav.icon }, { title: webInfo.webMap.admin.child.roles.title(params.locale) as string, href: webInfo.webMap.admin.child.roles.href, icon: webInfo.webMap.admin.child.roles.nav.icon }]} />
      {serverSnapshot ?
        <div className='mx-auto my-6 w-full bg-background2 rounded-md h-[70vh] overflow-hidden'>
          <div className="grid grid-cols-7 grid-flow-row h-full">
            <div className="flex flex-col w-full items-center col-span-2 border-r-2 border-main overflow-y-auto">
              <button className={`w-full text-center border-b-2 border-main px-4 py-2 hover:font-bold transition-all duration-300`} onClick={() => setSelectedRoleId("")}>新增組別</button>
              {serverSnapshot.map((t, key) => (
                <button key={key} className={`w-full text-center border-b-2 border-main px-4 py-2 hover:font-bold ${t.docId === selectedRoleId ? "bg-background border-x-2 rounded-ee-lg" : ""} transition-all duration-300`} onClick={() => setSelectedRoleId(t.docId)}>{t.name[params.locale]}</button>
              ))}
            </div>
            <div className="overflow-y-auto col-span-5 px-8 py-4">
              {selectedRole ?
                <>
                  <h2 className="text-2xl font-bold">{selectedRole?.name[params.locale]}</h2>
                  <span>正在製作中</span>
                </>
                :
                <span>Kein</span>}

            </div>
          </div>
        </div>
        : <div className="min-h-[74vh] w-full flex justify-center items-center"><Loading text="載入中" /></div>
      }
    </>
  )
}

// Modal - Delete
const ModalDelete = ({ modalInfo, setModal }: { modalInfo: any; setModal: Dispatch<SetStateAction<boolean>> }) => {
  const [value, setValue] = useState("");
  const [lodaing, setLodaing] = useState<boolean>(false);
  const onDeleteSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLodaing(true);
    await deleteDoc(doc(db, "books", modalInfo!.id));
    setLodaing(false);
    setModal(false);
  }
  if (lodaing) return (<div className="w-full h-full flex justify-center items-center"><Loading text="刪除中" /></div>)
  else return (
    <form className="flex flex-col space-y-2 max-w-xs" onSubmit={onDeleteSubmit}>
      <p className="w-full px-4 py-2 text-center text-background2 bg-main/60">若你未讀完以下資訊，你將會後悔莫及！</p>
      <h2>經過這個動作你將無法再透過網站找回最初的起點，所有人都不會再看到這個東西了！請問你確定嗎？</h2>
      <h3>如果你確定要刪除本書籍的話，請在下方輸入框輸入：『{modalInfo?.data.title}』</h3>
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} pattern={modalInfo?.data.title} placeholder={modalInfo?.data.title} autoComplete="false" className="px-2 py-1 bg-transparent border-2 border-red-700 focus:border-red-900 rounded-lg focus:outline-none" />
      <button disabled={value !== modalInfo?.data.title} className="disabled:bg-red-600/40 bg-red-600/90 py-1 text-background2 rounded-md">刪除</button>
    </form>
  )
}

type Role = {
  docId: string;
  id: number;
  name: {
    [key in LangCode]: string;
  }
  premissions: boolean;
}