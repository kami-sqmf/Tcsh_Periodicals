import { doc, DocumentData, onSnapshot, updateDoc } from 'firebase/firestore';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RiAdminLine, RiArrowRightSLine } from 'react-icons/ri';
import { Global } from '../../components/global';
import HeadUni from '../../components/HeadUni';
import Navbar from '../../components/Navbar';
import { db } from '../../utils/firebase';
import { useScroll } from '../../utils/useScroll';

const Home: NextPage = () => {
    const [onTop, setOnTop] = useState(true)
    const [disable, setDisable] = useState({
        description: true,
        email: true,
        insta: true
    })
    const { scrollX, scrollY, scrollDirection } = useScroll();
    const [dataList, setDataList] = useState({
        "insta": "tcsh_periodicals",
        "text": {
            "tellus": "給予匿名回饋",
            "members": "一覽編輯團隊",
            "insta": "追蹤 IG",
            "description": "慈中後生團隊是由一群熱愛自由的人所創立的。而在座的各位思考的是你還有幾年『黃金時間』可以轉職。溫水煮青蛙雖然比較不痛喔。",
            "email": "聯絡我們"
        },
        "email": "s11@tcsh.hlc.edu.tw"
    } as DocumentData)
    useEffect(() => {
        return onSnapshot(doc(db, "Global", "About"), (doc) => {
            doc.exists() ? setDataList(doc.data()) : 0
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [db])
    const sendAdd = (name: string) => {
        const e = document.getElementsByName(name)[0] as HTMLInputElement;
        switch (name) {
            case "descriptionInput":
                updateDoc(doc(db, "Global/About"), { description: e.value })
                setDisable({ ...disable, description: true })
                break;
            case "emailInput":
                updateDoc(doc(db, "Global/About"), { email: e.value })
                setDisable({ ...disable, email: true })
                break;
            case "instaInput":
                updateDoc(doc(db, "Global/About"), { insta: e.value })
                setDisable({ ...disable, insta: true })
                break;
        }
    }
    const cancelAdd = (name: string) => {
        const e = document.getElementsByName(name)[0] as HTMLInputElement;
        switch (name) {
            case "descriptionInput":
                e.value = dataList.description
                setDisable({ ...disable, description: true })
                break;
            case "instaInput":
                e.value = dataList.insta
                setDisable({ ...disable, insta: true })
                break;
            case "emailInput":
                e.value = dataList.email
                setDisable({ ...disable, email: true })
                break;
        }
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
                    <span className='text-base md:text-lg font-medium'>網站設定</span>
                </div>
                <div id="appList" className='grid grid-cols-1 mt-6 max-w-full gap-12'>
                    <div className='group bg-background2 px-8 py-6 flex flex-col justify-center items-center space-y-8'>
                        <div>
                            <div className='flex flex-row justify-center items-center'>
                                <p className='text-main text-sm mr-2'>更改 Email：</p>
                                <input name="emailInput" defaultValue={dataList.email} className='text-main bg-transparent border-b border-main outline-none focus:text-main2 focus:border-main2' onChange={() => setDisable({ ...disable, email: false })} />
                                <p id="emailInputErr" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
                            </div>
                            <div className='flex flex-col-reverse md:flex-row w-full justify-around mt-4'>
                                <button className='px-3 py-2 bg-red-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0' onClick={() => cancelAdd("emailInput")}>取消</button>
                                <button disabled={disable.email} className='px-3 py-2 bg-green-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0 disabled:bg-green-600/70' onClick={(e) => sendAdd("emailInput")}>送出</button>
                            </div>
                        </div>
                        <div>
                            <div className='flex flex-row justify-center items-center'>
                                <p className='text-main text-sm mr-2'>更改 Insta：</p>
                                <input name="instaInput" defaultValue={dataList.insta} className='text-main bg-transparent border-b border-main outline-none focus:text-main2 focus:border-main2' onChange={() => setDisable({ ...disable, insta: false })} />
                                <p id="instaInputErr" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
                            </div>
                            <div className='flex flex-col-reverse md:flex-row w-full justify-around mt-4'>
                                <button className='px-3 py-2 bg-red-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0' onClick={() => cancelAdd("instaInput")}>取消</button>
                                <button disabled={disable.insta} className='px-3 py-2 bg-green-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0 disabled:bg-green-600/70' onClick={(e) => sendAdd("instaInput")}>送出</button>
                            </div>
                        </div>
                        <div>
                            <div className='flex flex-row justify-center items-center'>
                                <p className='text-main text-sm mr-2'>輸入『關於後生』：</p>
                                <textarea name="descriptionInput" defaultValue={dataList.description} className='text-main bg-transparent border-b border-main outline-none focus:text-main2 focus:border-main2 h-24 w-48 md:w-64' onChange={() => setDisable({ ...disable, description: false })} />
                                <p id="descriptionInputErr" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
                            </div>
                            <div className='flex flex-col-reverse md:flex-row w-full justify-around mt-4'>
                                <button className='px-3 py-2 bg-red-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0' onClick={() => cancelAdd("descriptionInput")}>取消</button>
                                <button disabled={disable.description} className='px-3 py-2 bg-green-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0 disabled:bg-green-600/70' onClick={(e) => sendAdd("descriptionInput")}>送出</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;