import { collection, getDocs } from 'firebase/firestore';
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { useRouter } from 'next/router';
import About from '../components/About';
import { Global } from '../components/global';
import HeadUni from '../components/HeadUni';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';
import Recomended from '../components/Recomended';
import Slide from '../components/Slide';
import { db } from '../utils/firebase';
import { useScroll } from '../utils/useScroll';

const Home: NextPage = ({ data }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter()
  switch (router.query.error) {
    case "1":
      alert("請使用慈中帳號登入！若非本校學生或老師，請聯繫我們的信箱。")
      router.replace("/")
      break;
    case "Oau)Dl,waJ":
      alert("你是這麼到那裡去的！。")
      router.replace("/")
      break;
  }
  const { scrollX, scrollY, scrollDirection } = useScroll();
  return (
    <div className='min-h-screen bg-background/90 py-4'>
      <HeadUni title={Global.webMap.index.title} description='歡迎來到屬於後生的地方，也是一個屬於您創造夢想的地方。慈中後生讓您可以挑戰自我，達成您沒有達成過的。' pages='' />
      <div className='max-w-xs md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto'>
        <Navbar onTop={scrollY < 38} />
        <Notification data={data.Notification.Now} className="md:hidden mt-6" />
        <Slide />
        <div className='grid grid-cols-1 md:grid-cols-3 mt-9 md:mt-16'>
          <Recomended className="md:col-span-2" posts={data.Posts.posts} />
          <About className="md:ml-11" data={data.About} />
        </div>
      </div>
    </div>
  );
};

export default Home;

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
