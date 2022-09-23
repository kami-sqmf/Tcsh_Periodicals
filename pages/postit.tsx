import { collection, getDocs } from 'firebase/firestore';
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { useEffect, useState } from 'react';
import HeadUni from '../components/HeadUni';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';
import { db } from '../utils/firebase';
import { useScroll } from '../utils/useScroll';

const PostIt: NextPage = ({data}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { scrollX, scrollY, scrollDirection } = useScroll();
  return (
    <div className='min-h-screen bg-background/90 py-4'>
      <HeadUni title='首頁' description='歡迎來到屬於後生的地方，也是一個屬於您創造夢想的地方。慈中後生讓您可以挑戰自我，達成您沒有達成過的。' pages='postit' />
      <div className='max-w-xs md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto'>
        <Navbar onTop={scrollY < 38} />
        <Notification data={data.Notification.Now} className="md:hidden mt-6" />
      </div>
    </div>
  );
};

export default PostIt;

export const getStaticProps: GetStaticProps = async (context) => {
  const querySnapshot = await getDocs(collection(db, "Global"));
  const data: any = {}
  querySnapshot.forEach((doc) => {
    data[doc.id] = doc.data()
  });
  return {
    props: {
      data: data
    },
    revalidate: 900,
  }
}