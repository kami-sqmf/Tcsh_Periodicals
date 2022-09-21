import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { RiAdminLine, RiArrowRightSLine, RiNotification2Line, RiSlideshowFill, RiSlideshowLine, RiUserSettingsFill, RiUserSettingsLine, RiWindow2Fill, RiWindow2Line } from 'react-icons/ri';
import { Global } from '../../components/global';
import HeadUni from '../../components/HeadUni';
import Navbar from '../../components/Navbar';
import { useScroll } from '../../utils/useScroll';

const app = [
    { name: "成員", icon: RiUserSettingsLine, iconHover: RiUserSettingsFill, href: "/admin/members" },
    { name: "網站", icon: RiWindow2Line, iconHover: RiWindow2Fill, href: "/admin/website" },
    { name: "焦點！", icon: RiSlideshowLine, iconHover: RiSlideshowFill, href: "/admin/banner" },
    { name: "通知", icon: RiNotification2Line, iconHover: RiNotification2Line, href: "/admin/notification" },
]

const App = ({ info }: { info: { name: string, icon: IconType, iconHover: IconType, href: string } }) => (
    <Link href={info.href}>
        <div className='group bg-background2 px-8 py-6 flex flex-col justify-center items-center cursor-pointer' key={info.name}>
            <div className='text-main group-hover:text-main2'>
                <info.icon className='group-hover:hidden w-16 h-16' />
                <info.iconHover className='hidden group-hover:block w-16 h-16' />
            </div>
            <p className='pt-2 -pb-2 text-center text-lg text-main group-hover:text-main2 group-hover:font-medium'>{info.name}</p>
        </div>
    </Link>
)

const Home: NextPage = () => {
    const [onTop, setOnTop] = useState(true)
    const { scrollX, scrollY, scrollDirection } = useScroll();
    return (
        <div className='min-h-screen bg-background/90 py-4'>
            <HeadUni title={Global.webMap.admin.title} description='你是怎麼知道這個網頁的，不過我猜你開不起來。但你也不要駭我，因為會很痛！' pages={Global.webMap.admin.href} />
            <div className='max-w-xs md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto'>
                <Navbar onTop={scrollY < 38} />
                <div className='mt-4 flex flex-row items-center text-main space-x-2'>
                    <RiArrowRightSLine className='h-4 w-4 md:h-5 md:w-5' />
                    <RiAdminLine className='h-5 w-5 md:h-6 md:w-6' />
                    <span className='text-base md:text-lg font-medium'>管理員</span>
                </div>
                <div id="appList" className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6 max-w-full gap-12'>
                    {app.map((info) => (<App key={info.name} info={info} />))}
                </div>
            </div>
        </div>
    );
};

export default Home;