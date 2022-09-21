import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import type { NextPage } from 'next';
import Link from 'next/link';
import { ChangeEvent, useEffect, useState } from 'react';
import { RiAdminLine, RiArrowRightSLine } from 'react-icons/ri';
import { Global } from '../../components/global';
import HeadUni from '../../components/HeadUni';
import Navbar from '../../components/Navbar';
import Notification from '../../components/Notification';
import { db } from '../../utils/firebase';
import { useScroll } from '../../utils/useScroll';

export type notiType = { button: { href: string, text: string }, title: string, type: "error" | "success" | "alert" }

const Home: NextPage = () => {
    const [onTop, setOnTop] = useState(true)
    const [disable, setDisable] = useState({
        Add: true,
        Edit: [true],
    })
    const { scrollX, scrollY, scrollDirection } = useScroll();
    const [dataList, setDataList] = useState([] as notiType[])
    const [newNoti, setNewNoti] = useState({ button: { href: "/", text: "連結文字" }, title: "通知預覽", type: "alert" } as notiType)
    useEffect(() => {
        return onSnapshot(doc(db, "Global", "Notification"), async (doc) => {
            if (doc.exists()) {
                setDataList(doc.data().Now)
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [db])
    const changeAdd = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (e.target.name) {
            case "notiTitleAdd":
                setNewNoti((el) => {
                    el = { ...el, title: e.target.value }
                    return el;
                })
                break;
            case "notiButHrefAdd":
                setNewNoti((el) => {
                    el = { ...el, button: { ...el.button, href: e.target.value } }
                    return el;
                })
                break;
            case "notiButTextAdd":
                setNewNoti((el) => {
                    el = { ...el, button: { ...el.button, text: e.target.value } }
                    return el;
                })
                break;
            case "notiTypeAdd":
                setNewNoti((el) => {
                    el = { ...el, type: e.target.value as "error" | "success" | "alert" }
                    return el;
                })
                break;
        }
        if (e.target.value) {
            setDisable((e) => {
                e.Add = false
                return e
            })
        }
    }
    const cancelAdd = (e: string) => {
        document.querySelectorAll("input").forEach((input) => {
            if (input.name.includes(e)) {
                input.value = ""
            }
        })
        if (e == "Add") {
            setDisable((el) => {
                el["Add"] = true;
                return el
            })
        }
        if (e == "Edit") {
            setDisable((el) => {
                el["Edit"][parseInt(e.slice(-1))] = true;
                return el
            })
        }
    }
    const sendAdd = () => {
        const upData = dataList
        upData.push(newNoti)
        updateDoc(doc(db, "Global", "Notification"), {
            Now: upData
        })
        cancelAdd("Add")
    }
    const sendEdit = () => {
        const upData = dataList
        updateDoc(doc(db, "Global", "Notification"), {
            Now: upData
        })
        cancelAdd("Add")
    }
    const changeEdit = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (e.target.name.slice(0, -1)) {
            case "notiTitleEdit":
                setDataList((el) => {
                    el[parseInt(e.target.name.slice(-1))] = { ...el[parseInt(e.target.name.slice(-1))], title: e.target.value }
                    return el;
                })
                break;
            case "notiButHrefEdit":
                setDataList((el) => {
                    el[parseInt(e.target.name.slice(-1))] = { ...el[parseInt(e.target.name.slice(-1))], button: { ...el[parseInt(e.target.name.slice(-1))].button, href: e.target.value } }
                    return el;
                })
                break;
            case "notiButTextEdit":
                setDataList((el) => {
                    el[parseInt(e.target.name.slice(-1))] = { ...el[parseInt(e.target.name.slice(-1))], button: { ...el[parseInt(e.target.name.slice(-1))].button, text: e.target.value } }
                    return el;
                })
                break;
            case "notiTypeEdit":
                setDataList((el) => {
                    el[parseInt(e.target.name.slice(-1))] = { ...el[parseInt(e.target.name.slice(-1))], type: e.target.value as "error" | "success" | "alert" }
                    return el;
                })
                break;
        }
        if (e.target.value) {
            setDisable((el) => {
                el.Edit[parseInt(e.target.name.slice(-1))] = false
                return el
            })
        }
    }
    const deleteEdit = (e: number) => {
        console.log(e)
        const upData = console.log(dataList.splice(e, 1))
        updateDoc(doc(db, "Global", "Notification"), {
            Now: dataList
        })
    }
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
                    <span className='text-base md:text-lg font-medium'>通知</span>
                </div>
                <div id="appList" className='grid grid-cols-1 mt-6 max-w-full gap-8 justify-center items-center'>
                    <div className='flex flex-col'>
                        <p className='font-bold text-lg text-main mb-3'>目前通知：</p>
                        {dataList.length != 0 ? <Notification data={dataList} className="mt-2" /> : <p>正在載入中</p>}
                    </div>
                    <div className='flex flex-col'>
                        <p className='font-bold text-lg text-main mb-3'>新增通知：</p>
                        <Notification data={[newNoti]} className="mt-2" />
                        <div className='flex flex-row flex-wrap mt-2 md:space-x-8'>
                            <select name="notiTypeAdd" placeholder='選取模式！' className='flex mr-4 md:mr-0 text-main bg-transparent border-b border-main outline-none focus:text-main2 rounded-lg' onChange={(e) => changeAdd(e)}>
                                <option key={1} value={"alert"}>{"警示"}</option>
                                <option key={2} value={"success"}>{"成功"}</option>
                                <option key={3} value={"error"}>{"失敗"}</option>
                            </select>
                            <input name="notiTitleAdd" placeholder='請輸入標題！' className='flex grow text-main bg-transparent border-b border-main outline-none focus:text-main2 focus:border-main2' onChange={(e) => changeAdd(e)} />
                            <input name="notiButTextAdd" placeholder='按鈕文字' className='flex grow mt-2 md:mt-0 md:grow-0 text-main bg-transparent border-b border-main outline-none focus:text-main2 focus:border-main2' onChange={(e) => changeAdd(e)} />
                            <input name="notiButHrefAdd" placeholder='按鈕連結' className='flex grow mt-2 md:mt-0 md:grow-0 text-main bg-transparent border-b border-main outline-none focus:text-main2 focus:border-main2' onChange={(e) => changeAdd(e)} />
                        </div>
                        <div className='grid grid-rows-2 md:grid-cols-2 md:gap-8 w-full mt-4'>
                            <button className='px-3 py-2 bg-red-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0' onClick={() => cancelAdd("Add")}>取消</button>
                            <button disabled={disable.Add} className='px-3 py-2 bg-green-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0 disabled:bg-green-600/70' onClick={(e) => sendAdd()}>送出</button>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <p className='font-bold text-lg text-main mb-2'>編輯通知：</p>
                        {dataList.length != 0 ? dataList.map((noti, i) => {
                            return (
                                <div key={i}>
                                    <Notification data={[noti]} className="" />
                                    <div className='flex flex-row flex-wrap md:space-x-8'>
                                        <select name={`notiTypeEdit${i}`} placeholder='選取模式！' defaultValue={noti.type} className='flex mr-4 md:mr-0 text-main bg-transparent border-b border-main outline-none focus:text-main2 rounded-lg' onChange={(e) => changeEdit(e)}>
                                            <option key={1} value={"alert"}>{"警示"}</option>
                                            <option key={2} value={"success"}>{"成功"}</option>
                                            <option key={3} value={"error"}>{"失敗"}</option>
                                        </select>
                                        <input name={`notiTitleEdit${i}`} placeholder='請輸入標題！' defaultValue={noti.title} className='flex grow text-main bg-transparent border-b border-main outline-none focus:text-main2 focus:border-main2' onChange={(e) => changeEdit(e)} />
                                        <input name={`notiButTextEdit${i}`} placeholder='按鈕文字' defaultValue={noti.button.text} className='flex grow mt-2 md:mt-0 md:grow-0 text-main bg-transparent border-b border-main outline-none focus:text-main2 focus:border-main2' onChange={(e) => changeEdit(e)} />
                                        <input name={`notiButHrefEdit${i}`} placeholder='按鈕連結' defaultValue={noti.button.href} className='flex grow mt-2 md:mt-0 md:grow-0 text-main bg-transparent border-b border-main outline-none focus:text-main2 focus:border-main2' onChange={(e) => changeEdit(e)} />
                                    </div>
                                    <div className='grid grid-rows-2 md:grid-cols-2 md:gap-8 w-full my-4'>
                                        <button className='px-3 py-2 bg-red-700 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0' onClick={() => deleteEdit(i)}>刪除通知</button>
                                        <button disabled={disable.Edit[i]} className='px-3 py-2 bg-green-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0 disabled:bg-green-600/70' onClick={(e) => sendEdit()}>更改並觀看變化</button>
                                    </div>
                                </div>)
                        }) : <p>正在載入中</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;