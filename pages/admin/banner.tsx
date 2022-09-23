import { addDoc, collection, doc, DocumentData, onSnapshot, setDoc } from 'firebase/firestore';
import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { RiAdminLine, RiArrowGoBackFill, RiArrowRightSLine } from 'react-icons/ri';
import { useRecoilState } from 'recoil';
import { nowSlideState } from '../../atoms/SlideModal';
import { Global } from '../../components/global';
import HeadUni from '../../components/HeadUni';
import Navbar from '../../components/Navbar';
import Slide from '../../components/Slide';
import { db } from '../../utils/firebase';
import { useScroll } from '../../utils/useScroll';

const Menu = ({ setOperating, slide, setSlide }: { setOperating: Dispatch<SetStateAction<boolean>>, slide: { image: string; href: string; }[], setSlide: Dispatch<SetStateAction<{ image: string; href: string; }[]>> }) => {
    const [image, setImage] = useState("");
    const [disable, setDisable] = useState(true)
    const [nowSlide, setNowSlide] = useRecoilState(nowSlideState)
    const newSlide = {
        image: slide[0].image,
        href: "",
    }
    const filePickerRef = useRef<HTMLInputElement | null>(null);
    const changeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        if (e.target.files) {
            if (e.target.files[0]) {
                reader.readAsDataURL(e.target.files[0])
            }
            reader.onload = (renderEvent) => {
                if (renderEvent.target) {  
                    if (typeof (renderEvent.target.result) == "string") {
                        newSlide.image = (renderEvent.target.result)
                        if (newSlide.href != "") {
                            console.log([newSlide, ...slide])
                            setRender(<Main />)
                            setDoc(doc(db, "Global/Slide"), {
                                slide: [newSlide, ...slide]
                            })
                        } else {
                            const warn = document.getElementById("warn") as HTMLParagraphElement
                            warn.innerText = "請輸入網址！"
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
                        newSlide.image = (renderEvent.target.result)
                        newSlide.href = slide[nowSlide].href
                        const send = slide
                        send[nowSlide] = newSlide
                        setSlide(send)
                        setRender(<Main />)
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
            <button onClick={() => { setRender(<Edit />) }}  className='py-2 xl:py-3 w-full bg-blue-600/70 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0'>編輯當前焦點</button>
            <button className='py-2 xl:py-3 w-full bg-red-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0'>刪除當前焦點</button>
            <button disabled className='py-2 xl:py-3 w-full bg-green-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0 disabled:bg-green-600/70 invisible'>送出</button>
        </div>
    )
    const [render, setRender] = useState(<Main />)
    return render
}

const Home: NextPage = () => {
    const [operating, setOperating] = useState(false)
    const { scrollX, scrollY, scrollDirection } = useScroll();
    const [slideAdd, setSlideAdd] = useState([{
        image: "/loading.png",
        href: "/?=3",
    }])
    useEffect(() => {
        return onSnapshot(doc(db, "Global", "Slide"), (doc) => {
            doc.exists() ? setSlideAdd(doc.data().slide) : 0
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [db])
    return (
        <div className='min-h-screen bg-background/90 py-4'>
            <HeadUni title={Global.webMap.admin.child.website.title} description='你是怎麼知道這個網頁的，不過我猜你開不起來。但你也不要駭我，因為會很痛！' pages={Global.webMap.admin.child.website.href} />
            <div className='max-w-xs md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto'>
                <Navbar onTop={scrollY < 38} />
                <div className='mt-4 flex flex-row items-center text-main space-x-2'>
                    <RiArrowRightSLine className='h-4 w-4 md:h-5 md:w-5' />
                    <RiAdminLine className='h-5 w-5 md:h-6 md:w-6' />
                    <Link href="/admin"><span className='text-base md:text-lg font-medium cursor-pointer hover:text-main2'>管理員</span></Link>
                    <RiArrowRightSLine className='h-4 w-4 md:h-5 md:w-5' />
                    <span className='text-base md:text-lg font-medium'>焦點！</span>
                </div>
                <div id="appList" className='grid grid-cols-1 mt-6 max-w-full gap-12'>
                    <div className='flex flex-col text-main'>
                        <p className='mt-4 text-2xl font-bold'>手機版樣式：</p>
                        <div className='flex flex-row mt-4 md:mt-0 justify-between gap-x-8 items-end'>
                            <div className='hidden md:block w-[316px]'>
                                <Slide slide={slideAdd} title={"點我更改焦點標題！"} />
                            </div>
                            <Menu setOperating={setOperating} slide={slideAdd} setSlide={setSlideAdd} />
                        </div>
                        <p className='mt-8 hidden md:block text-2xl font-bold'>電腦版樣式：</p>
                        <Slide slide={slideAdd} title={"點我更改焦點標題！"} />
                    </div>
                </div>
            </div>
            {operating ? <div className='fixed z-[80] top-0 left-0 w-screen h-screen bg-gray-200/40 duration-400 animate-opacity cursor-wait'></div> : <></>}
        </div>
    );
};

export default Home;