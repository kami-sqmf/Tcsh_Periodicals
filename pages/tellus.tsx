import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import HeadUni from '../components/HeadUni';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';

const TellUs: NextPage = () => {
  const [onTop, setOnTop] = useState(true)
  const handleScroll = () => {
    if(onTop != window.scrollY > 54) setOnTop(true)
    if(onTop != window.scrollY < 54) setOnTop(false)
  }
  useEffect(()=>{
    window.addEventListener("scroll", handleScroll); 
    return () => window.removeEventListener("scroll", handleScroll);
  }, [])
  return (
    <div className='min-h-screen bg-background/90 py-4'>
      <HeadUni title='首頁' description='歡迎來到屬於後生的地方，也是一個屬於您創造夢想的地方。慈中後生讓您可以挑戰自我，達成您沒有達成過的。' pages='TellUs' />
      <div className='max-w-xs md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto'>
        <Navbar onTop={onTop} />
        <Notification className="md:hidden mt-6" />
      </div>
    </div>
  );
};

export default PostIt;
