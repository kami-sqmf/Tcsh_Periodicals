import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { UIEvent, useEffect, useState } from 'react';
import About from '../components/About';
import { Global } from '../components/global';
import HeadUni from '../components/HeadUni';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';
import Recomended from '../components/Recomended';
import Slide from '../components/Slide';

const Home: NextPage = () => {
  const { data: session } = useSession();
  // console.log(session)
  const [onTop, setOnTop] = useState(true)
  const handleScroll = () => {
    if(onTop != window.scrollY > 38) setOnTop(true)
    if(onTop != window.scrollY < 38) setOnTop(false)
  }
  useEffect(()=>{
    window.addEventListener("scroll", handleScroll); 
    return () => window.removeEventListener("scroll", handleScroll);
  }, [])
  return (
    <div className='min-h-screen bg-background/90 py-4'>
      <HeadUni title={Global.webMap.index.title} description='歡迎來到屬於後生的地方，也是一個屬於您創造夢想的地方。慈中後生讓您可以挑戰自我，達成您沒有達成過的。' pages='' />
      <div className='max-w-xs md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto'>
        <Navbar onTop={onTop} />
        <Notification className="md:hidden mt-6" />
        <Slide />
        <div className='grid grid-cols-1 md:grid-cols-3 mt-9 md:mt-16'>
          <Recomended className="md:col-span-2" />
          <About className="md:ml-11"/>
        </div>
      </div>
    </div>
  );
};

export default Home;
