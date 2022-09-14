import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Global } from '../../components/global';
import HeadUni from '../../components/HeadUni';
import Navbar from '../../components/Navbar';
import Notification from '../../components/Notification';

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [onTop, setOnTop] = useState(true)
  const handleScroll = () => {
    if (onTop != window.scrollY > 38) setOnTop(true)
    if (onTop != window.scrollY < 38) setOnTop(false)
  }
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [])
  return (
    <div className='min-h-screen bg-background/90 py-4'>
      <HeadUni title={Global.webMap.admin.child.members.title} description='你是怎麼知道這個網頁的，不過我猜你開不起來。但你也不要駭我，因為會很痛！' pages={Global.webMap.admin.child.members.href} />
      <div className='max-w-xs md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto'>
        <Navbar onTop={onTop} />
        <Notification className="md:hidden mt-6" />
        <div className='grid grid-cols-1 md:grid-cols-3 mt-9 md:mt-16'>
        </div>
      </div>
    </div>
  );
};

export default Home;
