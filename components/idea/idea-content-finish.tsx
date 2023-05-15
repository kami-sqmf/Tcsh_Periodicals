/* eslint-disable react-hooks/exhaustive-deps */
import { IdeaUrStory } from "@/types/firestore";
import { makeid } from "@/utils/ebook-voucher";
import { db, storage } from "@/utils/firebase";
import { addDoc, collection, deleteDoc, doc, DocumentReference } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, StorageReference, deleteObject } from "firebase/storage";
import Image from "next/image";
import { MutableRefObject, useRef, useState, useCallback, Dispatch, SetStateAction } from "react";
import { encrypt } from "@/utils/crypt"

const IdeaSectionFinish = ({ setSection, data }: { setSection: Dispatch<SetStateAction<number>>; data: MutableRefObject<IdeaUrStory | undefined> }) => {
  const fileRef = useRef<any>();
  const [uploading, setUploading] = useState(0);
  const onRefChange = useCallback(async (node: HTMLDivElement) => {
    if (node === null) return;
    if (data.current?.type === "text") {
      const key = encrypt(data.current.content.slice(0, 6));
      const doc = await addDoc(collection(db, "idea-urstory"), {
        type: data.current?.type,
        content: data.current.content,
        createdTimestamp: data.current?.createdTimestamp,
      })
      fileRef.current = { docId: doc.id, key: key };
      setUploading(1);
    } else {
      try {
        const imageRef = ref(storage, `/idea-urstory/${makeid(18)}`);
        const snapshot = await uploadBytes(imageRef, data.current!.file);
        const downloadUrl = await getDownloadURL(imageRef);
        const key = encrypt(data.current?.content.slice(0, 6) || downloadUrl.slice(0, 6));
        const doc = await addDoc(collection(db, "idea-urstory"), {
          type: data.current?.type,
          url: downloadUrl,
          content: data.current?.content,
          createdTimestamp: data.current?.createdTimestamp,
        })
        fileRef.current = { docId: doc.id, imageRef: imageRef, downloadUrl: downloadUrl, key: key };
        setUploading(1);
      } catch (e) {
        setUploading(1);
      }
    }
  }, []);
  const onCancelClicked = async () => {
    if (fileRef.current.imageRef) {
      const imageRef = fileRef.current.imageRef as StorageReference;
      await deleteObject(imageRef);
    }
    const docId = fileRef.current.docId as string;
    await deleteDoc(doc(db, 'idea-urstory', docId));
    location.reload();
  }
  const onNextClicked = async () => {
    setUploading(2);
    if (data.current?.type === "text") {
      await fetch("/api/idea-urstory/send", {
        method: "POST",
        body: JSON.stringify({
          message: `收到了一個新的匿名投稿！\n內容：${data.current.content}`,
          key: fileRef.current.key,
          id: fileRef.current.docId
        })
      })
    } else if (data.current?.type === "voice") {
      await fetch("/api/idea-urstory/send", {
        method: "POST",
        body: JSON.stringify({
          message: `收到了一個新的匿名(語音)投稿！\n簡述：${data.current.content}`,
          voiceUrl: fileRef.current!.downloadUrl,
          key: fileRef.current.key,
          id: fileRef.current.docId
        })
      })
    } else if (data.current?.type === "picture") {
      await fetch("/api/idea-urstory/send", {
        method: "POST",
        body: JSON.stringify({
          message: `收到了一個新的匿名(圖片)投稿！\n簡述：${data.current.content}`,
          imageUrl: fileRef.current!.downloadUrl,
          key: fileRef.current.key,
          id: fileRef.current.docId
        })
      })
    }
  }
  return (
    <>
      {uploading === 0 && <div className='min-h-[74vh] w-full flex flex-col justify-center items-center text-main my-8' ref={onRefChange}>
        <div role="status">
          <svg aria-hidden="true" className="w-14 h-14 animate-spin text-main2 fill-main" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">載入中...</span>
        </div>
        <span className='text-lg font-medium text-main mt-2'>正在處理中</span>
      </div>}
      {uploading === 1 && <div className='min-h-[74vh] w-full flex flex-col justify-center items-center text-main my-8'>
        <h1 className='text-4xl font-bold mb-4'>預覽</h1>
        <div className='border-2 border-main px-6 py-4 rounded-md'>
          {data.current?.type === "voice" && <audio controls className='mb-4'><source src={fileRef.current!.downloadUrl} />您的瀏覽器不支援播放啊啊啊！</audio>}
          {data.current?.type === "picture" && <div className="relative w-[65vw] min-h-[64vh] mb-4 mx-auto"><Image className='object-contain w-[65vw] min-h-[64vh]' fill={true} src={fileRef.current!.downloadUrl} alt="您的上傳，如果你看不到他可能代表您的網路不佳否則就代表你失敗了" /></div>}
          {data.current?.type !== "text" && <span className='text-main font-medium'>簡述：</span>}
          <span className='text-main'>{data.current?.content}</span>
        </div>
        <div className='flex flex-row space-x-2 mt-2'>
          <button className='bg-red-800/70 text-background2 rounded px-3 py-2' onClick={onCancelClicked}>刪除，再來一次</button>
          <button className='bg-green-800/70 text-background2 rounded px-3 py-2' onClick={onNextClicked}>確定了，提交 !</button>
        </div>
      </div>}
      {uploading === 2 && <div className="min-h-[74vh] w-full flex flex-col justify-center items-center" onAnimationEnd={() => setTimeout(() => location.replace("/"), 1000)}>
        <div className="success-checkmark scale-75">
          <div className="check-icon">
            <span className="icon-line line-tip"></span>
            <span className="icon-line line-long"></span>
            <div className="icon-circle"></div>
            <div className="icon-fix"></div>
          </div>
        </div>
        <span className="text-green-700/80 select-none">上傳成功</span>
      </div>}
    </>
  )
}

export { IdeaSectionFinish }