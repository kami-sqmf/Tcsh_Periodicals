import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { IconType } from 'react-icons';
import { RiAdminLine, RiArrowRightSLine, RiAttachment2 } from 'react-icons/ri';
import { Breadcrumb } from '../../components/breadcrumb';
import { PageWrapper } from '../../components/page-wrapper';
import { langCode } from '../../language/lang';
import { Global, webInfo } from '../../types/global';

const App = ({ info, lang }: { lang: langCode, info: webInfo }) => (
  <Link href={info.href}>
    <div className='group bg-background2 px-8 py-6 flex flex-col justify-center items-center cursor-pointer md:w-72 lg:w-[28rem] hover:scale-110 transition-all duration-300'>
      {info.nav && <div className='text-main group-hover:text-main2'>
        {info.nav.icon && <info.nav.icon className='group-hover:hidden w-16 h-16' />}
        {info.nav.iconHover && <info.nav.iconHover className='hidden group-hover:block w-16 h-16' />}
      </div>}
      <p className='pt-2 -pb-2 text-center text-lg text-main group-hover:text-main2 group-hover:font-medium'>{info.title(lang)}</p>
    </div>
  </Link>
)

function Index({ lang }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <PageWrapper lang={lang} page={Global.webMap.policy} withNavbar={true} operating={false} className='h-[95vh]'>
      <Breadcrumb args={[{ title: Global.webMap.policy.title(lang), href: "/policy", icon: RiAttachment2 }]} />
      <div id="appList" className='flex flex-col space-y-8 md:flex-row md:space-x-8 md:space-y-0 mt-4 h-[75vh] justify-center md:items-center'>
        {Object.values(Global.webMap.policy.child).map((info, key) => (<App key={key} lang={lang} info={info} />))}
      </div>
    </PageWrapper>

  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      lang: (context.locale ? context.locale : "zh") as langCode,
    },
  };
}

export default Index