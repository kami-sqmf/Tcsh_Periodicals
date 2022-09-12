import { collection, getDocs } from 'firebase/firestore';
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { useEffect, useState } from 'react';
import { RiArrowRightSLine, RiGroup2Line } from 'react-icons/ri';
import { Global } from '../components/global';
import HeadUni from '../components/HeadUni';
import Members from '../components/Members';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';
import ScrollToTop from '../components/scrollTop';
import { Members as MembersType } from '../types/firestore';
import { db } from '../utils/firebase';

const Member: NextPage = ({membersData}: InferGetStaticPropsType<typeof getStaticProps>) => {
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
      <HeadUni title={Global.webMap.member.title.slice(-2)} description='歡迎光臨後生團隊！請問今天想要來點什麼呢？投稿還是投訴⋯⋯' pages='member' />
      <div className='max-w-xs md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto pb-8'>
        <Navbar onTop={onTop} />
        <Notification className="md:hidden mt-6" />
        <div className='mt-4 flex flex-row items-center text-main space-x-2'>
          <RiArrowRightSLine className='h-4 w-4 md:h-5 md:w-5' />
          <RiGroup2Line className='h-5 w-5 md:h-6 md:w-6'/>
          <span className='text-base md:text-lg font-medium'>團隊成員</span>
        </div>
        <Members memberData={membersData} />
        <ScrollToTop />
      </div>
    </div>
  );
};

export default Member;

export const getServerSideProps: getServerSideProps = async (context) => {
  const snapshot = await getDocs(collection(db, "Members"))
  const data: MembersType[] = []
  snapshot.forEach(doc => {
    data.push({uid: doc.id, ...doc.data() as MembersType})
  });
  return {
    props: {
      membersData: data
    },
    revalidate: 60,
  }
}

// const doit = async () => {
//   const data = await getDocs(collection(db, "Role"))
//   const store: any = {}
//   data.forEach((doc) => {
//     const da = doc.data()
//     store[da.id] = {key: doc.id, ...doc.data()}
//   });
//   console.log(store)
// }
