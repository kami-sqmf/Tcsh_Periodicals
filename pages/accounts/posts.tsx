import type { GetServerSideProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { timestampBefrore } from '../../components/chat';
import { PageWrapper } from '../../components/page-wrapper';
import { Profile } from '../../components/profile';
import { _t, langCode } from '../../language/lang';
import { PostDocument } from '../../types/firestore';
import { Global } from '../../types/global';
import { getProps_Session_OwnPost } from '../../utils/get-firestore';

const Posts = ({ session, lang, ownPost, requestTime }: InferGetStaticPropsType<typeof getProps_Session_OwnPost>) => {
  return (
    <PageWrapper lang={lang} page={Global.webMap.member} withNavbar={true} operating={false}>
      <div className="grid grid-cols-1 md:grid-cols-4 h-max items-start relative mt-8">
        <div className='inline-grid md:col-span-3 mt-4 md:mt-0'>
          <div className='flex flex-col text-main'>
            <div className='flex flex-row'>
              <h1 className='text-3xl font-medium '>您的投稿</h1>
            </div>
            <div className='mr-8 flex flex-col divide-y divide-main/20'>
              {ownPost.length > 0 ? ownPost.map((post, key) => (
                <PostWrapper key={key} post={JSON.parse(post)} lang={lang} requestTime={requestTime} />
              )) : <div className='space-y-4 mt-4'>
                <h3>目前還沒有得到您的大力支持，請問乾爹要跟嗎？</h3>
                <Link href={Global.webMap.postIt.href} className="flex flex-row items-center space-x-2 cursor-pointer group hover:text-main2 border-2 border-main hover:border-main2 w-max py-2 px-4 rounded-lg">
                  <div className="relative h-5 w-5">
                    <Global.webMap.postIt.nav.icon className="absolute opacity-100 group-hover:opacity-0 h-5 w-5 transition-all duration-500" />
                    <Global.webMap.postIt.nav.iconHover className="absolute opacity-0 group-hover:opacity-100 h-5 w-5 transition-all duration-500" />
                  </div>
                  <span className="transition-all duration-500">{Global.webMap.postIt.title(lang)}</span>
                </Link>
                <Link href={`/${lang}/editor/new`} className="flex flex-row items-center space-x-2 cursor-pointer group hover:text-main2 border-2 border-main hover:border-main2 w-max py-2 px-4 rounded-lg">
                  <div className="relative h-5 w-5">
                    <Global.webMap.postIt.nav.icon className="absolute opacity-100 group-hover:opacity-0 h-5 w-5 transition-all duration-500" />
                    <Global.webMap.postIt.nav.iconHover className="absolute opacity-0 group-hover:opacity-100 h-5 w-5 transition-all duration-500" />
                  </div>
                  <span className="transition-all duration-500">{Global.webMap.postIt.title(lang)} (正在籌劃)</span>
                </Link>
              </div>}
            </div>
          </div>
        </div>
        <div className='inline-grid mt-2 md:mt-0 md:ml-2 border-2 border-main justify-center overflow-hidden sticky top-6'>
          <Profile profile={session.firestore} lang={lang} owned={true} rounded={false} />
        </div>
      </div>
    </PageWrapper>
  )
}
export default Posts

const PostWrapper = ({ post, lang, requestTime }: {
  post: {
    id: string;
    data: PostDocument;
  }; lang: langCode; requestTime: number;
}) => {
  return (
    <Link href={`/${lang}/editor/${post.id}`}>
      <div className="my-6 flex flex-col md:flex-row justify-start md:items-center cursor-pointer hover:scale-[1.01] transition-all">
        {post.data.thumbnail && <div className="relative w-full h-auto aspect-square md:aspect-[16/9] md:h-24 md:w-auto">
          <Image src={post.data.thumbnail} fill={true} className="object-cover" alt={_t(lang).imageAlt} loading="lazy" />
        </div>}
        <div className={`${post.data.thumbnail ? "md:ml-6" : ""} md:-mt-2 text-main`}>
          <h2 className="text-lg font-bold mt-1.5 line-clamp-2">{post.data.title || `未命名`}</h2>
          {post.data.description ? <h3 className="text-base text-main line-clamp-2">{post.data.description}</h3> : post.data.data.blocks[0].data.text && <h3 className="text-base text-main line-clamp-2">{post.data.data.blocks[0].data.text}</h3>}
          <div className='flex flex-row text-sm text-main/80 space-x-3'>
            <span>{post.data.lastEditTimestamp ? `Last edited  ${timestampBefrore((post.data.lastEditTimestamp as any).seconds * 1000)}` : `Created at ${timestampBefrore((post.data.createdTimestamp as any).seconds * 1000)}`}</span>
            <span>|</span>
            <div className='flex flex-row'>
              {post.data.tag.filter((item, index) => index < 3).map((category, key) => (
                <p className="mr-2" key={key}>{post.data.tag.length > 1 ? "#" : ""}{category.replaceAll(" ", "  ")}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export const getServerSideProps: GetServerSideProps = getProps_Session_OwnPost;