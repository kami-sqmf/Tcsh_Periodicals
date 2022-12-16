import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { RiAdminLine, RiArrowGoBackFill, RiArrowRightSLine, RiSlideshowLine } from 'react-icons/ri';
import { useRecoilState } from 'recoil';
import { nowSlideState } from '../../atoms/slide-modal';
import { Breadcrumb } from '../../components/breadcrumb';
import { PageWrapper } from '../../components/page-wrapper';
import { Slide } from '../../components/slide';
import { langCode } from '../../language/lang';
import { Slide as SlideType } from '../../types/firestore';
import { Global } from '../../types/global';
import { db } from '../../utils/firebase';

const Menu = ({ setOperating, slide, setSlide }: { setOperating: Dispatch<SetStateAction<boolean>>, slide: SlideType[], setSlide: Dispatch<SetStateAction<SlideType[]>> }) => {
  const [disable, setDisable] = useState(true)
  const [nowSlide, setNowSlide] = useRecoilState(nowSlideState)
  const newSlide = {
    image: slide[0].image,
    href: "",
    title: ""
  }
  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const changeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    setOperating(true);
    const reader = new FileReader();
    if (e.target.files) {
      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0])
      }
      reader.onload = (renderEvent) => {
        if (renderEvent.target) {
          if (typeof (renderEvent.target.result) == "string") {
            newSlide.image = (renderEvent.target.result);
            if (newSlide.href != "" && newSlide.title != "") {
              console.log([newSlide, ...slide]);
              setRender(<Main />);
              setDoc(doc(db, "Global/Slide"), {
                slide: [newSlide, ...slide]
              }).then(() => setOperating(false));
            } else {
              const warn = document.getElementById("warn") as HTMLParagraphElement;
              warn.innerText = "請輸入網址！";
            }
          }
        }
      }
    }
  }
  const editAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files) {
      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0])
      }
      reader.onload = (renderEvent) => {
        if (renderEvent.target) {
          if (typeof (renderEvent.target.result) == "string") {
            newSlide.image = (renderEvent.target.result);
            newSlide.href = slide[nowSlide].href;
            newSlide.title = slide[nowSlide].title;
            const send = slide;
            send[nowSlide] = newSlide;
            setSlide(send);
            setRender(<Main />);
          }
        }
      }
    }
  }
  const editHref = () => {
    const send = slide
    send[nowSlide] = newSlide
    setSlide(send)
    setRender(<Main />)
  }
  const changeListener = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    const warn = document.getElementById("warn") as HTMLParagraphElement
    if (warn) {
      if (target.name == "href") {
        if (!target.value.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)) {
          warn.innerText = ("請輸入正確網址，請加上 HTTPS！");
          setDisable(true)
        } else {
          warn.innerText = ("");
          newSlide.href = target.value
          setDisable(false)
        }
      }
    }
  }
  const BackButton = () => (
    <div onClick={() => { setRender(<Main />) }} className='flex flex-row space-x-2 items-center cursor-pointer'>
      <RiArrowGoBackFill className='w-5 h-5' />
      <p className='font-bold text-md'>返回</p>
    </div>
  )
  const Add = () => (
    <div className='flex flex-col flex-grow space-y-2 self-start'>
      <BackButton />
      <div className="relative w-full h-8 !mt-6">
        <input type="text" name="href" onChange={changeListener} className="peer appearance-none h-full w-full border-0 border-b border-b-main focus:border-b-main2 focus:ring-0 bg-transparent" placeholder=" " />
        <label htmlFor="href" className="absolute text-xs text-main font-medium duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] left-2 peer-focus:text-main2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5">圖片超連結</label>
        <p id="warn" className='text-xs text-red-500 px-3 my-0.5 -mb-1'></p>
      </div>
      <div className="relative w-full h-8 !mt-6">
        <input type="text" name="href" onChange={changeListener} className="peer appearance-none h-full w-full border-0 border-b border-b-main focus:border-b-main2 focus:ring-0 bg-transparent" placeholder=" " />
        <label htmlFor="href" className="absolute text-xs text-main font-medium duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] left-2 peer-focus:text-main2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5">文字敘述</label>
        <p id="warn" className='text-xs text-red-500 px-3 my-0.5 -mb-1'></p>
      </div>
      <div className="relative w-full h-8 !mt-6">
        <button className='w-full text-center text-xs py-3 text-white bg-green-600 opacity-70 rounded' onClick={() => filePickerRef.current!.click()}>上傳圖片並新增</button>
        <input type={"file"} hidden ref={filePickerRef} onChange={changeAvatar}></input>
      </div>
    </div>
  )
  const Edit = () => (
    <div className='flex flex-col flex-grow space-y-2 self-start'>
      <BackButton />
      <div className="relative w-full h-8 !mt-6">
        <input type="text" name="href" onChange={changeListener} defaultValue={slide[nowSlide].href} className="peer appearance-none h-full w-full border-0 border-b border-b-main focus:border-b-main2 focus:ring-0 bg-transparent" placeholder=" " />
        <label htmlFor="href" className="absolute text-xs text-main font-medium duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] left-2 peer-focus:text-main2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5">圖片超連結</label>
        <p id="warn" className='text-xs text-red-500 px-3 my-0.5 -mb-1'></p>
      </div>
      <div className="relative w-full h-6 !mt-6">
        <input type="text" name="href" onChange={changeListener} defaultValue={slide[nowSlide].title} className="peer appearance-none h-full w-full border-0 border-b border-b-main focus:border-b-main2 focus:ring-0 bg-transparent" placeholder=" " />
        <label htmlFor="href" className="absolute text-xs text-main font-medium duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] left-2 peer-focus:text-main2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5">文字敘述</label>
        <p id="warn" className='text-xs text-red-500 px-3 my-0.5 -mb-1'></p>
      </div>
      <div className="relative w-full h-8 !mt-6 flex flex-row gap-x-2">
        <button className='w-full h-full text-center text-xs py-2 text-white bg-green-600 opacity-70 rounded' onClick={() => filePickerRef.current!.click()}>更改圖片</button>
        <button className='w-full h-full text-center text-xs py-2 text-white bg-green-600 opacity-70 rounded disabled:bg-green-600/60' disabled={disable} onClick={() => editHref()}>更改超連結</button>
        <input type={"file"} hidden ref={filePickerRef} onChange={editAvatar}></input>
      </div>
    </div>
  )
  const Main = () => (
    <div className='flex flex-col flex-grow space-y-2'>
      <button onClick={() => { setRender(<Add />) }} className='py-2 xl:py-3 w-full bg-green-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0 disabled:bg-green-600/70'>新增焦點</button>
      <button onClick={() => { setRender(<Edit />) }} className='py-2 xl:py-3 w-full bg-blue-600/70 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0'>編輯當前焦點</button>
      <button className='py-2 xl:py-3 w-full bg-red-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0'>刪除當前焦點</button>
      <button disabled className='py-2 xl:py-3 w-full bg-green-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0 disabled:bg-green-600/70 invisible'>送出</button>
    </div>
  )
  const [render, setRender] = useState(<Main />)
  return render
}

function Slides({ lang }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [operating, setOperating] = useState(false);
  const [slideAdd, setSlideAdd] = useState([{
    image: "/loading.gif",
    href: "/?=3",
    title: "正在載入中 ⋯⋯"
  }])
  useEffect(() => {
    return onSnapshot(doc(db, "Global", "Slide"), (doc) => {
      doc.exists() ? setSlideAdd(doc.data().slide) : 0
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db])
  return (
    <PageWrapper lang={lang} page={Global.webMap.admin.child.banner} withNavbar={true} operating={operating}>
      <Breadcrumb args={[{ title: "管理員", href: "/admin", icon: RiAdminLine }, { title: "焦點！", href: "/admin/slides", icon: RiSlideshowLine }]} />
      <div id="appList" className='grid grid-cols-1 mt-6 max-w-full gap-12'>
        <div className='flex flex-col text-main'>
          <p className='mt-4 text-2xl font-bold'>手機版樣式：</p>
          <div className='flex flex-row mt-4 md:mt-0 justify-between gap-x-8 items-end'>
            <div className='hidden md:block w-[316px]'>
              <Slide slides={slideAdd} />
            </div>
            <Menu setOperating={setOperating} slide={slideAdd} setSlide={setSlideAdd} />
          </div>
          <p className='mt-8 hidden md:block text-2xl font-bold'>電腦版樣式：</p>
          <Slide slides={slideAdd} />
        </div>
      </div>
    </PageWrapper>

  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      lang: (context.locale ? context.locale : "zh") as langCode,
    },
  };
}

export default Slides