/* eslint-disable react-hooks/exhaustive-deps */
"use client";

const _ = require('lodash');
import { BreadcrumbWrapper } from "@/components/breadcumb/breadcumb";
import { Loading } from "@/components/global/loading";
import i18nDefault from '@/translation/ebook/zh.json';
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { db } from "@/utils/firebase";
import i18n from "@/utils/i18n";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useRef, useState, use } from "react";


export default function Page(props: { params: Promise<{ locale: LangCode }> }) {
  const params = use(props.params);
  const locale = params.locale;
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
      <BreadcrumbWrapper args={[{ title: webInfo.webMap.admin.title(locale) as string, href: webInfo.webMap.admin.href, icon: webInfo.webMap.admin.nav.icon }, { title: webInfo.webMap.admin.child.roles.title(locale) as string, href: webInfo.webMap.admin.child.roles.href, icon: webInfo.webMap.admin.child.roles.nav.icon }]} />
      {serverSnapshot ?
        <div className='mx-auto my-6 w-full bg-background2 rounded-md h-[70vh] overflow-hidden'>
          <div className="grid grid-cols-7 grid-flow-row h-full">
            <div className="flex flex-col w-full items-center col-span-2 border-r-2 border-main overflow-y-auto">
              <button className={`w-full text-center border-b-2 border-main px-4 py-2 hover:font-bold transition-all duration-300`} onClick={() => setSelectedRoleId("")}>新增組別</button>
              {serverSnapshot.map((t, key) => (
                <button key={key} className={`w-full text-center border-b-2 border-main px-4 py-2 hover:font-bold ${t.docId === selectedRoleId ? "bg-background border-x-2 rounded-ee-lg" : ""} transition-all duration-300`} onClick={() => setSelectedRoleId(t.docId)}>{t.name[locale]}</button>
              ))}
            </div>
            <div className="overflow-y-auto col-span-5 px-8 py-4">
              {selectedRole ?
                <>
                  <h2 className="text-2xl font-bold">{selectedRole?.name[locale]}</h2>
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


type Role = {
  docId: string;
  id: number;
  name: {
    [key in LangCode]: string;
  }
  premissions: boolean;
}