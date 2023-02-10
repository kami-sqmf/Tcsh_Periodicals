import { OutputData } from '@editorjs/editorjs';
import { Menu, Transition } from '@headlessui/react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import type { GetServerSideProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Dispatch, Fragment, KeyboardEvent, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import { RiMoreFill, RiMoreLine } from 'react-icons/ri';
import HeadUni from '../../components/head-uni';
import { NavbarAccountMenu } from '../../components/navbar';
import { _t, langCode } from '../../language/lang';
import LogoSVG from '../../public/logo-nav.svg';
import { Account, Member, PostDocument } from '../../types/firestore';
import { Global } from '../../types/global';
import { db } from '../../utils/firebase';
import { getProps_Session } from '../../utils/get-firestore';
import { useScroll } from '../../utils/use-scroll';

const floatNav = 34;
const EditorBlock = dynamic(() => import("../../components/editor"), {
  ssr: false,
});
const ModalEditorPublish = dynamic(() => import('../../components/editor-publish-modal').then((res) => res.ModalEditorPublish), {
  ssr: false,
})


const Editor = ({ session, lang }: InferGetStaticPropsType<typeof getProps_Session>) => {
  // Router Scroll and Query
  let queueToCloud: any;
  const router = useRouter();
  const { scrollY } = useScroll();
  const postId = router.query.pid as string;
  // UseState Hook
  const title = useRef<HTMLInputElement>();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [queueData, setQueueData] = useState<PostDocument>();
  const [editorOutput, setEditorOutput] = useState<OutputData>();
  const [serverShapshot, setServerSnapshot] = useState<PostDocument>();
  const [modalPublished, setModalPublished] = useState<boolean>(false);
  const [status, setStatus] = useState(`已儲存在 - ${session.firestore.data.name} (本地)`);
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
  // Firestore Snapshot initalize
  useEffect(() => {
    const storedLocally = localStorage.getItem(postId);
    return onSnapshot(doc(db, "posts", postId), async (doc) => {
      if (!doc.exists()) return router.push(`/${lang}`);
      if (doc.data().owner !== session.firestore.data.uid) return router.push(`/${lang}`);
      if (!isReady) {
        setServerSnapshot(doc.data() as PostDocument);
        if (storedLocally) {
          const stored = JSON.parse(storedLocally).data as PostDocument;
          if (stored !== doc.data()) {
            if (stored.lastEditTimestamp > doc.data().lastEditTimestamp) {
              setEditorOutput(stored.data);
            } else {
              setEditorOutput(doc.data().data);
            }
          }
        }
        setIsReady(true);
      }
      else {
        console.log(doc.data());
      }
      return setQueueData(doc.data() as PostDocument);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const uploadToCloud = async (postId: string, username?: string, setStatus?: Dispatch<SetStateAction<string>>) => {
    try {
      console.log(`正在上傳中：公開狀態 ${queueData?.isPublic}`);
      if (username && setStatus) setStatus(`正在上傳 - ${username} （雲端）`);
      const res = await setDoc(doc(db, "posts", postId), queueData);
      if (username && setStatus) setStatus(`已儲存在 - ${username} （雲端）`)
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }
  const editorListener = async (data: OutputData) => {
    clearTimeout(queueToCloud);
    if (!queueData) return;
    setEditorOutput(data);
    setQueueData((dataInQueue) => {
      if (dataInQueue) { dataInQueue.data = data; }
      return dataInQueue;
    });
    localStorage.setItem(postId, JSON.stringify(queueData));
    setStatus(`已排定在 - ${session.firestore.data.name} (雲端)`)
    queueToCloud = setTimeout(() => {
      uploadToCloud(postId, session.firestore.data.name, setStatus);
      localStorage.setItem(postId, JSON.stringify(queueData));
    }, 60000);
  }
  const keyboardListener = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 's' && e.metaKey === true) {
      if (!editorOutput || !serverShapshot) return;
      if (!queueData) return;
      clearTimeout(queueToCloud);
      e.preventDefault();
      setStatus(`已儲存在 - ${session.firestore.data.name} (本地)`)
      setQueueData({
        data: editorOutput,
        type: queueData.type ? queueData.type : 0,
        title: title.current?.value ? title.current.value : queueData.title,
        description: queueData.description ? queueData.description : editorOutput?.blocks[0]?.data?.text.slice(0, 140),
        thumbnail: queueData.thumbnail ? queueData.thumbnail : "",
        tag: queueData.tag ? queueData.tag : [],
        owner: serverShapshot.owner,
        isPublic: false,
        createdTimestamp: serverShapshot.createdTimestamp as any,
        lastEditTimestamp: serverTimestamp()
      })
      localStorage.setItem(postId, JSON.stringify(queueData));
      uploadToCloud(postId, session.firestore.data.name, setStatus);
    }
  };
  const onPublishedClicked = () => {
    setStatus(`正在發布至 - ${session.firestore.data.name} (雲端)`);
    setQueueData({
      data: queueData!.data,
      type: queueData!.type ? queueData!.type : 0,
      title: title.current?.value ? title.current.value : queueData!.title,
      description: queueData!.description ? queueData!.description : editorOutput?.blocks[0]?.data?.text.slice(0, 140),
      thumbnail: queueData!.thumbnail ? queueData!.thumbnail : "",
      tag: queueData!.tag ? queueData!.tag : [],
      owner: serverShapshot!.owner,
      isPublic: true,
      createdTimestamp: serverShapshot!.createdTimestamp as any,
      lastEditTimestamp: serverTimestamp()
    });
    uploadToCloud(postId, session.firestore.data.name, setStatus);
    setModalPublished(false);
    return setStatus(`已發布至 - ${session.firestore.data.name} (雲端)`);
  }
  return (
    <div className='min-h-screen bg-background' onKeyDown={keyboardListener}>
      <div>
        <HeadUni title={Global.webMap.editor.title(lang)} description={Global.webMap.editor.description(lang)} lang={lang} pages='/editor' />
        <Navbar user={session.firestore.data} lang={lang} className={`${scrollY > floatNav || !isReady ? "fixed top-0 bg-background2/90" : "bg-background2/10"} z-30`} status={status} setModalPublished={setModalPublished} isReady={isReady} />
        {isReady && <div className={'max-w-xs md:max-w-3xl lg:max-w-4xl mx-auto'}>
          <EditorBlock data={editorOutput} onChange={editorListener} editorId={`editor-${session.firestore.data.uid}-${postId}`} serverData={serverShapshot!} titleRef={title as MutableRefObject<HTMLInputElement>} />
        </div>}
        {!isReady && <div className='flex flex-row justify-center items-center h-screen'>
          <span className='text-4xl text-main font-medium animate-pulse'>{_t(lang).editor.newEditorLoading}</span>
        </div>}
      </div>
      {isReady && <ModalEditorPublish lang={lang} modalOpen={modalPublished} setModalOpen={setModalPublished} data={queueData!} setData={setQueueData} user={session.firestore} titleRef={title as MutableRefObject<HTMLInputElement>} onPublishedClick={onPublishedClicked} />}
    </div>
  )
}

const Navbar = ({ className, user, lang, status, setModalPublished, isReady }: { className: string; user: Account | Member; lang: langCode; status: string; setModalPublished: Dispatch<SetStateAction<boolean>>; isReady: boolean }) => {
  return (
    <div className={`${className} flex items-center h-16 w-full transition-all duration-300`}>
      <div className='flex flex-row justify-between items-center w-[20rem] md:w-[42rem] lg:w-[56rem] xl:w-[72rem] mx-auto'>
        <div className='flex flex-col md:flex-row md:items-center md:space-x-2'>
          <Image src={LogoSVG} alt="慈中後生 Logo" className="h-10 w-36 -ml-2 md:ml-0" />
          <span className='font-medium text-xs text-main/80 mt-2'>{status}</span>
        </div>
        <div className='right flex flex-row items-center'>
          <button onClick={() => setModalPublished(true && isReady)} className="flex flex-row justify-center items-center px-3 py-1 rounded-lg bg-green-700 hover:bg-green-800 transition-all duration-300">
            <p className="text text-background2 my-auto">發布</p>
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