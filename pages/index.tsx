import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { About } from '../components/about';
import { PageWrapper } from '../components/page-wrapper';
import { Recomended } from '../components/recomended';
import { Slide } from '../components/slide';
import { Global } from '../types/global';
import { getPropsGlobalDB } from '../utils/get-firestore';

const Home = ({data, lang}: InferGetStaticPropsType<typeof getPropsGlobalDB>) => {
  return (
      <PageWrapper lang={lang} page={Global.webMap.index} withNavbar={true} operating={false} Noti={data.Notification}>
        <Slide slides={data.Slide.slide} />
        <div className='grid grid-cols-1 md:grid-cols-3 mt-9 md:mt-16'>
          <Recomended className="md:col-span-2" posts={data.Posts.posts} lang={lang} />
          <About className="md:ml-11" about={data.About} lang={lang} />
        </div>
      </PageWrapper>
  )
}

export default Home

export const getStaticProps: GetStaticProps = getPropsGlobalDB