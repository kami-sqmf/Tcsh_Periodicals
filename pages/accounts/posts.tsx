import { Tab } from '@headlessui/react';
import type { GetServerSideProps, InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { RiPenNibFill, RiPenNibLine, RiSendPlaneFill, RiSendPlaneLine } from 'react-icons/ri';
import { PageWrapper } from '../../components/page-wrapper';
import { PostCard } from '../../components/post-card';
import { Profile } from '../../components/profile';
import { langCode } from '../../language/lang';
import { PostDocument } from '../../types/firestore';
import { Global } from '../../types/global';
import { getProps_Session_OwnPost } from '../../utils/get-firestore';
import { ToolBar } from '../admin/posts';

const Posts = ({ session, lang, ownPost, requestTime }: InferGetStaticPropsType<typeof getProps_Session_OwnPost>) => {
  return (
    <PageWrapper lang={lang} page={Global.webMap.member} withNavbar={true} operating={false}>
      <div className="grid grid-cols-1 md:grid-cols-4 h-max items-start relative mt-8">
        <div className='inline-grid md:col-span-3 mt-4 md:mt-0'>
          <div className='flex flex-col text-main'>
            <div className='flex flex-row'>
              <h1 className='text-3xl font-medium'>您的投稿</h1>
            </div>
            <div className='mr-8 flex flex-col divide-y divide-main/20'>
              {
                ownPost.length > 0 ? <PostContainer ownPost={ownPost} lang={lang} /> :
                  <div className='space-y-4 mt-4'>
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
                  </div>
              }
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

const PostContainer = ({ ownPost, lang }: {
  ownPost: string[]; lang: langCode;
}) => {
  const posts = ownPost.map(post => JSON.parse(post) as { id: string; data: PostDocument })
  const [searchValue, setSearchValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const filteredSearch: () => { id: string; data: PostDocument }[] | null = () => {
    if (!searchValue) return null;
    return posts?.filter(data => data.data.title.includes(searchValue) || data.data.tag.some(substring => substring.includes(searchValue))) || null;
  }
  return (
    <div>
      <div className="relative text-main focus-within:text-main2 mt-2">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2 mb-4">
          <button type="submit" className="p-1 focus:outline-none focus:shadow-outline">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" className="w-4 h-4"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
        </span>
        <input type="search" value={searchValue} onChange={e => setSearchValue(e.target.value)} className="bg-transparent w-full mb-4 py-2 px-2 text-sm text-main focus:text-main2 border-main2 border focus:border-2 rounded-md pl-8 focus:outline-none" placeholder="收尋標題或標籤" autoComplete="off" />
      </div>
      {filteredSearch() && filteredSearch()?.map((doc, key) => (
        <div key={key} className='mt-8 space-y-6'>
          <ToolBar id={doc.id} published={doc.data.isPublic} />
          <PostCard post={doc} isEditor={true} />
        </div>
      ))}
      {searchValue === "" && <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex flex-row space-x-4 justify-center">
          <Tab as='div' className="flex flex-col md:flex-row items-center relative rounded bg-main group text-background px-4 py-2 md:text-lg space-x-2 hover:bg-background2 hover:text-main ui-selected:bg-main2 transition-all duration-500 outline-none cursor-pointer">
            <div className='absolute -top-3 -right-2 text-sm bg-main2 rounded-full px-[6px] text-background2'>{posts.filter((doc) => doc.data.isPublic).length}</div>
            <div className='relative w-6 h-6'>
              <RiSendPlaneFill className='absolute w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
              <RiSendPlaneLine className='absolute w-6 h-6 opacity-100 group-hover:opacity-0 transition-opacity duration-500' />
            </div>
            <span>已發佈</span>
          </Tab>
          <Tab as='div' className="flex flex-col md:flex-row items-center relative rounded bg-main group text-background px-4 py-2 md:text-lg space-x-2 hover:bg-background2 hover:text-main ui-selected:bg-main2 transition-all duration-500 outline-none cursor-pointer">
            <div className='absolute -top-3 -right-2 text-sm bg-main2 rounded-full px-[6px] text-background2'>{posts.filter((doc) => !doc.data.isPublic && doc.data.data.blocks).length}</div>
            <div className='relative w-6 h-6'>
              <RiPenNibFill className='absolute w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
              <RiPenNibLine className='absolute w-6 h-6 opacity-100 group-hover:opacity-0 transition-opacity duration-500' />
            </div>
            <span>草稿</span>
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            {posts.filter((doc) => doc.data.isPublic).map((doc, key) => (
              <div key={key} className='mt-8 space-y-6'>
                <ToolBar id={doc.id} published={doc.data.isPublic} />
                <PostCard post={doc} isEditor={true} />
              </div>
            ))}
          </Tab.Panel>
          <Tab.Panel>
            {posts.filter((doc) => !doc.data.isPublic && doc.data.data.blocks).map((doc, key) => (
              <div key={key} className='mt-8 space-y-6'>
                <ToolBar id={doc.id} published={doc.data.isPublic} />
                <PostCard post={doc} isEditor={true} />
              </div>
            ))}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = getProps_Session_OwnPost;