import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { About } from '../../components/about';
import { PageWrapper } from '../../components/page-wrapper';
import { Recomended } from '../../components/recomended';
import { Slide } from '../../components/slide';
import { Global } from '../../types/global';
import { getPropsGlobalDB } from '../../utils/get-firestore';
import Link from 'next/link';
import { RiInstagramLine } from 'react-icons/ri';

const Home = ({ data, lang }: InferGetStaticPropsType<typeof getPropsGlobalDB>) => {
  const router = useRouter();
  const about = data.About;
  if (router.query.error === "1") alert("請使用教育帳號！")
  return (
    <PageWrapper lang={lang} page={Global.webMap.index} withNavbar={true} operating={false} Noti={data.Notification}>
      <div className='flex flex-row justify-center items-center space-y-4'>
        <span className='text-4xl'>目前本頁面正在維修中</span>
        <Link href={`https://www.instagram.com/${about.insta}`}>
          <div className="group flex flex-row items-center justify-around border-2 border-main rounded-2xl py-1.5 text-main cursor-pointer">
            <RiInstagramLine className="w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 group-hover:animate-spinIG" />
            <span className="text-lg md:text-base xl:text-lg mr-12 md:mr-1 lg:mr-6 font-medium">到 IG 查看更多文章</span>
          </div>
        </Link>
      </div>
    </PageWrapper>
  )
}

export default Home

export const getStaticProps: GetStaticProps = getPropsGlobalDB