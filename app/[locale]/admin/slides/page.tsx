"use client";

import { BreadcrumbWrapper } from "@/components/breadcumb/breadcumb";
import { Loading } from "@/components/global/loading";
import { SlideElement } from "@/components/slide/slide";
import { Slide } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { db } from "@/utils/firebase";
import { collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

export default function AdminSlide({ params }: { params: { locale: LangCode } }) {
  // const t = new i18n<typeof i18nDefault>(params.locale, "index");
  const dataFetchedRef = useRef<boolean>(false);
  const [serverSnapshot, setServerSnapshot] = useState<{ id: string; data: Slide }[]>();
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    onSnapshot(query(collection(db, 'slides'), orderBy("order", 'asc')), snapshot => {
      setServerSnapshot(snapshot.docs.map((doc) => {
        return { id: doc.id, data: doc.data() as Slide };
      }));
    })
  })
  return (
    <>
      <BreadcrumbWrapper args={[{ title: webInfo.webMap.admin.title(params.locale) as string, href: webInfo.webMap.admin.href, icon: webInfo.webMap.admin.nav.icon }, { title: webInfo.webMap.admin.child.banner.title(params.locale) as string, href: webInfo.webMap.admin.child.banner.href, icon: webInfo.webMap.admin.child.banner.nav.icon }]} />
      {serverSnapshot ?
        <div className='flex flex-col text-main'>
          <p className='mt-4 text-2xl font-bold'>手機版樣式：</p>
          <div className='flex flex-row mt-4 md:mt-0 justify-between gap-x-8 items-end'>
            <div className='hidden md:block w-[316px]'>
              <SlideElement className="!mt-2" slides={serverSnapshot.map(doc => doc.data)} mobile={true} />
            </div>
            <span>目前無法由此更改，請至此處<a className="underline text-main2" href="https://console.firebase.google.com/project/tcsh-periodicals/firestore/data/~2Fslides">連結</a>更改</span>
          </div>
          <p className='mt-8 hidden md:block text-2xl font-bold'>電腦版樣式：</p>
          <SlideElement className="!mt-2" slides={serverSnapshot.map(doc => doc.data)} />
        </div>
        : <div className="min-h-[74vh] w-full flex justify-center items-center"><Loading text="載入中" /></div>}
    </>
  )
}
