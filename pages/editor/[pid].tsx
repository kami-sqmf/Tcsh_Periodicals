import { OutputData } from '@editorjs/editorjs';
import { Menu, Transition } from '@headlessui/react';
import { doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import type { GetServerSideProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Fragment, KeyboardEvent, useEffect, useState } from 'react';
import { RiMoreFill, RiMoreLine } from 'react-icons/ri';
import HeadUni from '../../components/head-uni';
import { NavbarAccountMenu } from '../../components/navbar';
import { _t, langCode } from '../../language/lang';
import LogoSVG from '../../public/logo-nav.svg';
import { Account, Member, PostDocument } from '../../types/firestore';
import { Global } from '../../types/global';
import { uploadToCloud } from '../../utils/editor';
import { db } from '../../utils/firebase';
import { getProps_Session } from '../../utils/get-firestore';
import { useScroll } from '../../utils/use-scroll';

const floatNav = 34;
const EditorBlock = dynamic(() => import("../../components/editor"), {
  ssr: false,
});

const Editor = ({ session, lang }: InferGetStaticPropsType<typeof getProps_Session>) => {
  // Router Scroll and Query
  const router = useRouter();
  const { scrollY } = useScroll();
  const postId = router.query.pid as string;
  // UseState Hook
  const [data, setData] = useState<OutputData>();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [serverPostData, setServerPostData] = useState<PostDocument>();
  const [status, setStatus] = useState(`已儲存在 - ${session.firestore.data.name} (本地)`);
  let queueToCloud: any;
  // Function Stuff
  const onDataChange = async (data: OutputData) => {
    clearTimeout(queueToCloud);
    setData(data);
    localStorage.setItem(postId, JSON.stringify({ title: (document.querySelector("#title") as any).value, data: data, owner: serverPostData!.owner, tag: serverPostData!.tag, lastEditTimestamp: serverTimestamp() }));
    setStatus(`已儲存在 - ${session.firestore.data.name} (本地)`)
    queueToCloud = setTimeout(() => {
      uploadToCloud(postId, { title: (document.querySelector("#title") as any).value, data: data, owner: serverPostData!.owner, tag: serverPostData!.tag, createdTimestamp: serverPostData!.createdTimestamp, lastEditTimestamp: serverTimestamp() }, session.firestore.data.name, setStatus);
    }, 60000);
  }
  // Confirm when leaving
  useEffect(() => {
    function listener(e: BeforeUnloadEvent) {
      const msg = "確定要離開編輯器嗎？";
      e.preventDefault();
      e.returnValue = msg;
      return msg;
    }

    window.addEventListener('beforeunload', listener);

    return () => {
      window.removeEventListener('beforeunload', listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const storedLocally = localStorage.getItem(postId);
    return onSnapshot(doc(db, "posts", postId), async (doc) => {
      if (!doc.exists()) return router.push(`/${lang}`);
      if (doc.data().owner !== session.firestore.data.uid) return router.push(`/${lang}`);
      if (!isReady) {
        setServerPostData(doc.data() as PostDocument);
        if (storedLocally) {
          const stored = JSON.parse(storedLocally).data as PostDocument;
          if (stored !== doc.data()) {
            if (stored.lastEditTimestamp > doc.data().lastEditTimestamp) {
              setData(stored.data);
            } else {
              setData(doc.data().data);
            }
          }
        }
        setIsReady(true);
      }
      else {
        console.log(doc.data())
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const keyboardListener = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 's' && e.metaKey === true) {
      if (!data || !serverPostData) return;
      e.preventDefault();
      setStatus(`已儲存在 - ${session.firestore.data.name} (本地)`)
      uploadToCloud(postId, { title: (document.querySelector("#title") as any).value, data: data, owner: serverPostData.owner, tag: serverPostData.tag, createdTimestamp: serverPostData.createdTimestamp, lastEditTimestamp: serverTimestamp() }, session.firestore.data.name, setStatus);
    }
  };
  return (
    <div className='min-h-screen bg-background' onKeyDown={keyboardListener}>
      <HeadUni title={Global.webMap.editor.title(lang)} description={Global.webMap.editor.description(lang)} lang={lang} pages='/editor' />
      <Navbar user={session.firestore.data} lang={lang} className={`${scrollY > floatNav || !isReady ? "fixed top-0 bg-background2/90" : "bg-background2/10"} z-30`} status={status} />
      {isReady && <div className={'max-w-xs md:max-w-3xl lg:max-w-4xl mx-auto'}>
        <EditorBlock data={data} onChange={onDataChange} editorId={`editor-${session.firestore.data.uid}-${postId}`} serverData={serverPostData!} />
      </div>}
      {!isReady && <div className='flex flex-row justify-center items-center h-screen'>
        <span className='text-4xl text-main font-medium animate-pulse'>{_t(lang).editor.newEditorLoading}</span>
      </div>}
    </div>
  )
}

const Navbar = ({ className, user, lang, status }: { className: string; user: Account | Member; lang: langCode; status: string }) => {
  return (
    <div className={`${className} flex items-center h-16 w-full transition-all duration-300`}>
      <div className='flex flex-row justify-between items-center w-[20rem] md:w-[42rem] lg:w-[56rem] xl:w-[72rem] mx-auto'>
        <div className='flex flex-col md:flex-row md:items-center md:space-x-2'>
          <Image src={LogoSVG} alt="慈中後生 Logo" className="h-10 w-36 -ml-2 md:ml-0" />
          <span className='font-medium text-xs text-main/80 mt-2'>{status}</span>
        </div>
        <div className='right flex flex-row items-center'>
          <button className="flex flex-row justify-center items-center px-3 py-1 rounded-lg bg-green-700 hover:bg-green-800 transition-all duration-300">
            <p className="text text-background2 my-auto">發佈</p>
          </button>
          <NavbarMoreMenu lang={lang} />
          <NavbarAccountMenu size={{ less: 8, md: 9 }} lang={lang} user={user} />
        </div>
      </div>
    </div>
  )
}

const NavbarMoreMenu = ({ lang }: { lang: langCode }) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="relative group h-6 w-6 mb-6 ml-8 mr-2">
        <RiMoreLine className="absolute opacity-100 group-hover:opacity-0 h-6 w-6 transition-all duration-300" />
        <RiMoreFill className="absolute opacity-0 group-hover:opacity-100 h-6 w-6 transition-all duration-300" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-3 w-48 origin-top-right divide-y divide-gray-300 rounded-md bg-background2 shadow-lg ring-1 ring-main2 ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
            <Menu.Item><div>a</div></Menu.Item>
            <Menu.Item><div>b</div></Menu.Item>
            <Menu.Item><div>c</div></Menu.Item>
          </div>
          <div className="px-1 py-1 ">
            <Menu.Item><div>d</div></Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default Editor

export const getServerSideProps: GetServerSideProps = getProps_Session;