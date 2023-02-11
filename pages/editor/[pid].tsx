/* eslint-disable react-hooks/exhaustive-deps */
import { OutputData } from "@editorjs/editorjs";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { GetServerSideProps, InferGetStaticPropsType } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ChangeEvent, Dispatch, KeyboardEvent, MutableRefObject, RefObject, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { EditorNavbar } from "../../components/editor/editor-navbar";
import HeadUni from "../../components/head-uni";
import { _t } from "../../language/lang";
import { PostDocument } from "../../types/firestore";
import { Global } from "../../types/global";
import { db } from "../../utils/firebase";
import { getProps_PostID_Session } from "../../utils/get-firestore";

const EditorBlock = dynamic(() => import("../../components/editor/editor-block"), {
  ssr: false,
});
const ModalEditorPublish = dynamic(() => import('../../components/editor/editor-modal-publish').then((res) => res.ModalEditorPublish), {
  ssr: false,
})

const Editor = ({ postId, lang, session }: InferGetStaticPropsType<typeof getProps_PostID_Session>) => {
  let queueToCloud: any;
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement>(null);
  const queueData = useRef<PostDocument>();
  const serverSnapshot = useRef<PostDocument>();
  const [isPageReady, setIsPageReady] = useState<boolean>(false);
  const [statusNavbar, setStatusNavbar] = useState<string>("");
  const [modalPublish, setModalPublish] = useState<boolean>(false);
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
  const initalRun = useCallback(() => {
    console.log("I am initallizing")
    onSnapshot(doc(db, "posts", postId), async (doc) => {
      if (!doc.exists()) return router.push(`/${lang}`);
      if (doc.data().owner !== session.firestore.data.uid) return router.push(`/${lang}`);
      serverSnapshot.current = doc.data() as PostDocument;
      queueData.current = serverSnapshot.current;
      if (!isPageReady) {
        setIsPageReady(true);
      } else {
        console.log("New Snapshot =>", doc.data());
      }
    })
  }, [],)
  useEffect(() => initalRun(), [initalRun]);
  // EditorListenr
  const editorListener = (data: OutputData | ChangeEvent<HTMLInputElement>) => {
    clearTimeout(queueToCloud);
    if (!queueData.current) return;
    if (isOutputData(data)) queueData.current.data = data;
    else queueData.current.title = data.target.value;
    queueData.current.isPublic = false;
    localStorage.setItem(postId, JSON.stringify(queueData.current));
    setStatusNavbar(`已排定在 - ${session.firestore.data.name} (雲端)`);
    queueToCloud = setTimeout(() => {
      if (!queueData) return;
      uploadToCloud(postId, queueData, session.firestore.data.name, setStatusNavbar);
      localStorage.setItem(postId, JSON.stringify(queueData));
    }, 60000);
  }
  const keyboardListener = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 's' && e.metaKey === true) {
      e.preventDefault();
      if (!isPageReady || !queueData.current) return;
      queueData.current.isPublic = false;
      localStorage.setItem(postId, JSON.stringify(queueData));
      uploadToCloud(postId, queueData, session.firestore.data.name, setStatusNavbar);
    }
  };
  const onPublishedClicked = () => {
    if (!queueData.current) return setStatusNavbar(`發布失敗 - ${session.firestore.data.name} (雲端)`);
    setStatusNavbar(`正在發布至 - ${session.firestore.data.name} (雲端)`);
    queueData.current.isPublic = true;
    localStorage.setItem(postId, JSON.stringify(queueData));
    uploadToCloud(postId, queueData, session.firestore.data.name, setStatusNavbar);
    setModalPublish(false);
    return setStatusNavbar(`已發布至 - ${session.firestore.data.name} (雲端)`);
  }
  return (
    <div className='min-h-screen bg-background' onKeyDown={(e) => keyboardListener(e)}>
      <div>
        <HeadUni title={Global.webMap.editor.title(lang)} description={Global.webMap.editor.description(lang)} lang={lang} pages='/editor' />
        <EditorNavbar lang={lang} status={statusNavbar} user={session.firestore} setModalPublish={setModalPublish} isPageReady={isPageReady} />
        {isPageReady && <div className={'max-w-xs md:max-w-3xl lg:max-w-4xl mx-auto'}>
          <EditorBlock lang={lang} initalData={{ title: serverSnapshot.current?.title || "", editor: serverSnapshot.current!.data }} onChange={editorListener} titleRef={titleRef} />
        </div>}
        {!isPageReady && <div className='flex flex-row justify-center items-center h-screen'>
          <span className='text-4xl text-main font-medium animate-pulse'>{_t(lang).editor.newEditorLoading}</span>
        </div>}
      </div>
      {isPageReady && <ModalEditorPublish lang={lang} modalOpen={modalPublish} setModalOpen={setModalPublish} queueData={queueData} user={session.firestore} titleRef={titleRef} onPublishedClick={onPublishedClicked} />}
    </div>
  )
}

const uploadToCloud = async (postId: string, dataRef: MutableRefObject<PostDocument | undefined>, username?: string, setStatus?: Dispatch<SetStateAction<string>>) => {
  dataRef.current!.lastEditTimestamp = serverTimestamp();
  try {
    if (username && setStatus) setStatus(`正在上傳 - ${username} （雲端）`);
    const res = await setDoc(doc(db, "posts", postId), dataRef.current);
    if (username && setStatus) setStatus(`已儲存在 - ${username} （雲端）`)
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

function isOutputData(data: OutputData | ChangeEvent<HTMLInputElement>): data is OutputData {
  return (data as OutputData).blocks !== undefined;
}

export default Editor

export const getServerSideProps: GetServerSideProps = getProps_PostID_Session;