import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { About } from '../components/about';
import { PageWrapper } from '../components/page-wrapper';
import { Recomended } from '../components/recomended';
import { Slide } from '../components/slide';
import { Global } from '../types/global';
import { getPropsGlobalDB } from '../utils/get-firestore';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const Chat = dynamic(() => import('../components/chat').then((res) => res.Chat), {
  ssr: false,
})

const Home = ({ data, lang }: InferGetStaticPropsType<typeof getPropsGlobalDB>) => {
  const router = useRouter();
  if (router.query.error === "1") alert("請使用教育帳號！")
  return (
    <PageWrapper lang={lang} page={Global.webMap.index} withNavbar={true} operating={false} Noti={data.Notification}>
      <Slide slides={data.Slide.slide} />
      <div className='grid grid-cols-1 md:grid-cols-3 mt-9 md:mt-16'>
        <Recomended className="md:col-span-2" posts={data.Posts.posts} lang={lang} />
        <About className="md:ml-11" about={data.About} lang={lang} />
      </div>
      <Chat className='fixed bottom-5 right-5' about={data.About} />
    </PageWrapper>
  )
}

export default Home

export const getStaticProps: GetStaticProps = getPropsGlobalDB