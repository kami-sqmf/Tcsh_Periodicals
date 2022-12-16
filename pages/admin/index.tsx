import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { IconType } from 'react-icons';
import { RiAdminLine, RiArrowRightSLine } from 'react-icons/ri';
import { Breadcrumb } from '../../components/breadcrumb';
import { PageWrapper } from '../../components/page-wrapper';
import { langCode } from '../../language/lang';
import { Global, webInfo } from '../../types/global';

const App = ({ info, lang }: { lang: langCode, info: webInfo }) => (
  <Link href={info.href}>
    <div className='group bg-background2 px-8 py-6 flex flex-col justify-center items-center cursor-pointer'>
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
    <PageWrapper lang={lang} page={Global.webMap.admin} withNavbar={true} operating={false}>
      <Breadcrumb args={[{ title: "管理員", href: "/admin", icon: RiAdminLine }]} />
      <div id="appList" className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6 max-w-full gap-12'>
        {Object.values(Global.webMap.admin.child).map((info, key) => (<App key={key} lang={lang} info={info} />))}
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