import { doc, DocumentData, onSnapshot } from 'firebase/firestore';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RiAdminLine, RiArrowRightSLine } from 'react-icons/ri';
import { Global } from '../../components/global';
import HeadUni from '../../components/HeadUni';
import Navbar from '../../components/Navbar';
import { db } from '../../utils/firebase';

const Home: NextPage = () => {
    const [onTop, setOnTop] = useState(true)
    const [disable, setDisable] = useState({
        description: true,
        email: true,
        insta: true
    })
    const handleScroll = () => {
        if (onTop != window.scrollY > 38) setOnTop(true)
        if (onTop != window.scrollY < 38) setOnTop(false)
    }
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
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
    }, [db])
    return (
        <div className='min-h-screen bg-background/90 py-4'>
            <HeadUni title={Global.webMap.admin.child.website.title} description='你是怎麼知道這個網頁的，不過我猜你開不起來。但你也不要駭我，因為會很痛！' pages={Global.webMap.admin.child.website.href} />
            <div className='max-w-xs md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto'>
                <Navbar onTop={onTop} />
                <div className='mt-4 flex flex-row items-center text-main space-x-2'>
                    <RiArrowRightSLine className='h-4 w-4 md:h-5 md:w-5' />
                    <RiAdminLine className='h-5 w-5 md:h-6 md:w-6' />
                    <Link href="/admin"><span className='text-base md:text-lg font-medium cursor-pointer hover:text-main2'>管理員</span></Link>
                    <RiArrowRightSLine className='h-4 w-4 md:h-5 md:w-5' />
                    <span className='text-base md:text-lg font-medium'>焦點！</span>
                </div>
                <div id="appList" className='grid grid-cols-1 mt-6 max-w-full gap-12'>
                    設計設計！
                </div>
            </div>
        </div>
    );
};

export default Home;