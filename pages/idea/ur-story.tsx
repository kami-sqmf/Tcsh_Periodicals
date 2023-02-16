/* eslint-disable react-hooks/exhaustive-deps */
import { FieldValue, addDoc, collection, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { StorageReference, deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChangeEvent, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { IconType } from 'react-icons';
import { RiArrowGoBackLine, RiImage2Fill, RiImage2Line, RiMic2Fill, RiMic2Line, RiPlaneFill, RiQuillPenFill, RiQuillPenLine } from 'react-icons/ri';
import { SetterOrUpdater } from 'recoil';
import { makeid } from '../../components/ebook-modal';
import HeadUni from '../../components/head-uni';
import { IdeaNavbar } from '../../components/idea-navbar';
import { langCode } from '../../language/lang';
import { db, storage } from '../../utils/firebase';

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

const UrStory = () => {
  const router = useRouter();
  const data = useRef<IdeaUrStory>();
  const dataFetchedRef = useRef(false);
  const sid = useRef(makeid(21));
  const [statusNavbar, setStatusNavbar] = useState<string>("");
  const [progressbar, setProgressbar] = useState<number>(33);
  const [section, setSection] = useState<number>(0);
  const lang = router.locale ? router.locale as langCode : "zh";

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    const localStorageID = localStorage.getItem('idea-urstory');
    if (localStorageID) {
      sid.current = localStorageID;
      // const res = await getDoc(doc(db, 'idea-urstory', sid.current));
      // if (res.exists()) {

      // }
    } else {
      localStorage.setItem('idea-urstory', sid.current);
    }
  }, [])

  useEffect(() => {
    switch (section) {
      case 0:
        setProgressbar(33);
        break;
      case 4:
        setProgressbar(99);
        break;
      default:
        setProgressbar(66);
    }
  }, [section])

  return (
    <div className='min-h-screen overflow-hidden bg-background'>
      <HeadUni title={"你的故事，我們來寫"} imagePath='https://firebasestorage.googleapis.com/v0/b/tcsh-periodicals.appspot.com/o/posts%2Fimage%2FIzrbxIQJHa3Z3VDPJR?alt=media&token=f970c48a-a9ab-4067-afd0-6a0120f98756' description={"生活中，我們總會面臨各式各樣的事，或好或壞。只要你願意與我們分享，不限題材，我們團隊就會將你的故事以文字、圖像定期呈現在刊物、貼文或限時動態與大家分享。"} lang={lang} pages='/idea/ur-story' />
      <IdeaNavbar lang={lang} />
      <div className={`h-1 bg-main2/50`}><div className={`h-1 bg-main animate-bright w-[${progressbar}%] transition-all duration-500`}><div className='hidden w-[33%] md:w-[66%] xl:w-[100%]' /></div></div>
      <div className='max-w-xs md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto'>
        {section !== 0 && section !== 4 && <div className='flex flex-row items-center space-x-2 cursor-pointer text-main ml-2 mt-2' onClick={() => setSection(0)}>
          <RiArrowGoBackLine className='h-4 w-4 md:h-5 md:w-5' />
          <span className='md:text-lg'>返回</span>
        </div>}
        {section === 0 && <SectionMain setSection={setSection} />}
        {section === 1 && <SectionText setSection={setSection} data={data} />}
        {section === 2 && <SectionVoice setSection={setSection} data={data} />}
        {section === 3 && <SectionPicture setSection={setSection} data={data} />}
        {section === 4 && <SectionFinish setSection={setSection} data={data} />}
      </div>
    </div>
  )
}

const SectionMain = ({ setSection }: { setSection: SetterOrUpdater<number>; }) => (
  <div className='min-h-[80vh] w-full flex flex-col justify-around md:justify-center md:space-y-12 text-main my-8'>
    <h1 className='text-4xl font-bold mb-4'>請問您想要如何呈現？</h1>
    <div className='grid grid-cols-1 md:grid-cols-3 w-full gap-12'>
      {sections.map((info, key) => (<App key={key} info={info} setSection={setSection} />))}
    </div>
  </div>
)

const SectionText = ({ setSection, data }: { setSection: SetterOrUpdater<number>; data: MutableRefObject<IdeaUrStory | undefined> }) => {
  const [rowTextarea, setTextarea] = useState<number>(1);
  const [nextDisabled, setNextDisabled] = useState<boolean>(true);
  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const hiddenTextarea = document.querySelector("#hidden-textarea") as HTMLTextAreaElement;
    if (hiddenTextarea) {
      hiddenTextarea.value = e.target.value;
      setTextarea(hiddenTextarea.scrollHeight / 24);
    }
    if (hiddenTextarea.value.length === 0) {
      setNextDisabled(true);
    } else {
      setNextDisabled(false);
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
  const onNextClick = () => {
    const hiddenTextarea = document.querySelector("#hidden-textarea") as HTMLTextAreaElement;
    data.current = {
      type: "text",
      content: hiddenTextarea.value,
      createdTimestamp: serverTimestamp()
    }
    setSection(4);
  }
  return (
    <div className='min-h-[74vh] w-full flex flex-col justify-center text-main my-8'>
      <h1 className='text-4xl font-bold mb-4'>請輸入您的故事！</h1>
      <textarea id="textarea" className="text-base resize-none w-[83vw] bg-transparent focus:outline-none" rows={rowTextarea} placeholder="我想要說⋯⋯" onChange={handleTextArea} />
      <textarea id="hidden-textarea" className="text-base resize-none w-[83vw] invisible absolute overflow-hidden" rows={1} ref={onRefChange} disabled></textarea>
      <button disabled={nextDisabled} className='group flex flex-row items-center space-x-2 self-end mt-6 select-none cursor-pointer disabled:cursor-default text-main disabled:opacity-70' onClick={onNextClick}>
        <RiPlaneFill className='h-4 w-4 md:h-5 md:w-5 rotate-[35deg] group-enabled:group-hover:rotate-[90deg] transition-all duration-300 mb-0.5' />
        <span className='md:text-lg group-enabled:group-hover:font-medium transition-all duration-300'>下一步</span>
      </button>
    </div>
  )
}

const SectionVoice = ({ setSection, data }: { setSection: SetterOrUpdater<number>; data: MutableRefObject<IdeaUrStory | undefined> }) => {
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [nextDisabled, setNextDisabled] = useState<boolean>(true);
  useEffect(() => {
    if (error == "") setNextDisabled(false);
    else setNextDisabled(true);
  }, [error])
  const onFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const files = e.target.files;
    if (files) {
      if (files.length != 1) return setError("您沒有選擇檔案！請再試一次。");
      const file = files[0];
      if (((file.size / 1024) / 1024) > 30) { return setError("您選擇檔案太大了！最多30MB") };
      if (!file.type.startsWith("audio/") && !file.type.includes("ogg") && !file.type.includes("mp4")) return setError("您選擇的格式並非語音檔案！支援的語音檔案（.mp3, .wav, .aifc, .aiff, .m4a, .mp2, .ogg）");
      return setNextDisabled(false);
    } else {
      return setError("您沒有選擇檔案！請再試一次。")
    }
  }
  const onNextClick = () => {
    data.current = {
      type: "voice",
      file: inputRef.current!.files![0],
      createdTimestamp: serverTimestamp()
    }
    setSection(4);
  }
  return (
    <div className='min-h-[74vh] w-full flex flex-col justify-center text-main my-8'>
      <h1 className='text-4xl font-bold mb-4'>請選擇您的語音檔案！</h1>
      <input type="file" id="input" accept="audio/*,application/ogg" onChange={onFileInput} ref={inputRef} />
      <span className='text-medium text-red-700'>{error}</span>
      <button disabled={nextDisabled} className='group flex flex-row items-center space-x-2 self-end mt-6 select-none cursor-pointer disabled:cursor-default text-main disabled:opacity-70' onClick={onNextClick}>
        <RiPlaneFill className='h-4 w-4 md:h-5 md:w-5 rotate-[35deg] group-enabled:group-hover:rotate-[90deg] transition-all duration-300 mb-0.5' />
        <span className='md:text-lg group-enabled:group-hover:font-medium transition-all duration-300'>下一步</span>
      </button>
    </div>
  )
}

const SectionPicture = ({ setSection, data }: { setSection: SetterOrUpdater<number>; data: MutableRefObject<IdeaUrStory | undefined> }) => {
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [nextDisabled, setNextDisabled] = useState<boolean>(true);
  useEffect(() => {
    if (error == "") setNextDisabled(false);
    else setNextDisabled(true);
  }, [error])
  const onFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const files = e.target.files;
    if (files) {
      if (files.length != 1) return setError("您沒有選擇檔案！請再試一次。");
      const file = files[0];
      if (((file.size / 1024) / 1024) > 30) { return setError("您選擇檔案太大了！最多30MB") };
      if (!file.type.startsWith("image/")) return setError("您選擇的格式並非語音檔案！支援的語音檔案（.jpg, .png, .tiff, .gif, .svg）");
      return setNextDisabled(false);
    } else {
      return setError("您沒有選擇檔案！請再試一次。")
    }
  }
  const onNextClick = () => {
    data.current = {
      type: "picture",
      file: inputRef.current!.files![0],
      createdTimestamp: serverTimestamp()
    }
    setSection(4);
  }
  return (
    <div className='min-h-[74vh] w-full flex flex-col justify-center text-main my-8'>
      <h1 className='text-4xl font-bold mb-4'>請選擇您的圖片檔案！</h1>
      <input type="file" id="input" accept="image/*" onChange={onFileInput} ref={inputRef} />
      <span className='text-medium text-red-700'>{error}</span>
      <button disabled={nextDisabled} className='group flex flex-row items-center space-x-2 self-end mt-6 select-none cursor-pointer disabled:cursor-default text-main disabled:opacity-70' onClick={onNextClick}>
        <RiPlaneFill className='h-4 w-4 md:h-5 md:w-5 rotate-[35deg] group-enabled:group-hover:rotate-[90deg] transition-all duration-300 mb-0.5' />
        <span className='md:text-lg group-enabled:group-hover:font-medium transition-all duration-300'>下一步</span>
      </button>
    </div>
  )
}

const SectionFinish = ({ setSection, data }: { setSection: SetterOrUpdater<number>; data: MutableRefObject<IdeaUrStory | undefined> }) => {
  const fileRef = useRef<any>();
  const [uploading, setUploading] = useState(true);
  const onRefChange = useCallback(async (node: HTMLDivElement) => {
    if (node === null) return;
    if (data.current?.type === "text") {
      const doc = await addDoc(collection(db, "idea-urstory"), {
        type: data.current?.type,
        content: data.current.content,
        createdTimestamp: data.current?.createdTimestamp,
      })
      fileRef.current = { docId: doc.id };
      setUploading(false);
    } else {
      try {
        const imageRef = ref(storage, `/idea-urstory/${makeid(18)}`);
        const snapshot = await uploadBytes(imageRef, data.current!.file)
        const downloadUrl = await getDownloadURL(imageRef);
        const doc = await addDoc(collection(db, "idea-urstory"), {
          type: data.current?.type,
          url: downloadUrl,
          createdTimestamp: data.current?.createdTimestamp,
        })
        fileRef.current = { docId: doc.id, imageRef: imageRef, downloadUrl: downloadUrl };
        setUploading(false);
      } catch (e) {
        setUploading(false);
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
    if (data.current?.type === "text") {
      await fetch("/api/sendNotificationLine", {
        method: "POST",
        body: JSON.stringify({
          message: `收到了一個新的匿名投稿！\n內容：${data.current.content}`
        })
      })
    } else if (data.current?.type === "voice") {
      await fetch("/api/sendNotificationLine", {
        method: "POST",
        body: JSON.stringify({
          message: "收到了一個新的匿名(語音)投稿！",
          voiceUrl: fileRef.current!.downloadUrl,
        })
      })
    } else if (data.current?.type === "picture") {
      await fetch("/api/sendNotificationLine", {
        method: "POST",
        body: JSON.stringify({
          message: "收到了一個新的匿名(圖片)投稿！",
          imageUrl: fileRef.current!.downloadUrl,
        })
      })
    }
    location.replace("/");
  }
  return (
    <>
      {uploading && <div className='min-h-[74vh] w-full flex flex-col justify-center items-center text-main my-8' ref={onRefChange}>
        <div role="status">
          <svg aria-hidden="true" className="w-14 h-14 animate-spin text-main2 fill-main" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">載入中...</span>
        </div>
        <span className='text-lg font-medium text-main mt-2'>正在處理中</span>
      </div>}
      {!uploading && <div className='min-h-[74vh] w-full flex flex-col justify-center items-center text-main my-8'>
        <h1 className='text-4xl font-bold mb-4'>預覽</h1>
        <div className='border-2 border-main px-6 py-4 rounded-md'>
          {data.current?.type === "text" && <span>{data.current.content}</span>}
          {data.current?.type === "voice" && <audio controls><source src={fileRef.current!.downloadUrl} />您的瀏覽器不支援播放啊啊啊！</audio>}
          {data.current?.type === "picture" && <div className="relative w-[65vw] min-h-[64vh]"><Image className='object-contain w-[65vw] min-h-[64vh]' fill={true} src={fileRef.current!.downloadUrl} alt="您的上傳，如果你看不到他可能代表您的網路不佳否則就代表你失敗了" /></div>}
        </div>
        <div className='flex flex-row space-x-2 mt-2'>
          <button className='bg-red-800/70 text-background2 rounded px-3 py-2' onClick={onCancelClicked}>刪除，再來一次</button>
          <button className='bg-green-800/70 text-background2 rounded px-3 py-2' onClick={onNextClicked}>確定了，提交 !</button>
        </div>
      </div>}
    </>
  )
}


const App = ({ setSection, info }: { setSection: SetterOrUpdater<number>; info: { title: string; section: number; icon: IconType; iconHover: IconType; } }) => (
  <div className='group bg-background2 px-8 py-6 flex flex-col justify-center items-center cursor-pointer' onClick={() => setSection(info.section)}>
    {info && <div className='text-main group-hover:text-main2'>
      {info.icon && <info.icon className='group-hover:hidden w-16 h-16' />}
      {info.iconHover && <info.iconHover className='hidden group-hover:block w-16 h-16' />}
    </div>}
    <p className='pt-2 -pb-2 text-center text-lg text-main group-hover:text-main2 group-hover:font-medium'>{info.title}</p>
  </div>
)

export default UrStory;

export type IdeaUrStory = {
  type: "text";
  content: string;
  createdTimestamp: FieldValue,
} | {
  type: "picture";
  file: File;
  url?: string;
  createdTimestamp: FieldValue,
} | {
  type: "voice";
  file: File;
  url?: string;
  createdTimestamp: FieldValue,
}