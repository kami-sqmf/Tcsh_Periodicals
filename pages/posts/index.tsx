/* eslint-disable react-hooks/exhaustive-deps */
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { About } from '../../components/about';
import { PageWrapper } from '../../components/page-wrapper';
import { Recomended } from '../../components/recomended';
import { Slide } from '../../components/slide';
import { Global } from '../../types/global';
import { getPropsGlobalDB } from '../../utils/get-firestore';
import Link from 'next/link';
import { RiInstagramLine, RiPenNibLine } from 'react-icons/ri';
import { Breadcrumb } from '../../components/breadcrumb';
import { useEffect, useRef, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { PostDocument } from '../../types/firestore';
import { Loading } from '../../components/Loading';
import { PostCard } from '../../components/post-card';
import { db } from '../../utils/firebase';

const Home = ({ data, lang }: InferGetStaticPropsType<typeof getPropsGlobalDB>) => {
  const router = useRouter();
  const queryParams = router.query;
  const dataFetchedRef = useRef<boolean>(false);
  const [searchValue, setSearchValue] = useState("");
  const [posts, setPosts] = useState<{ id: string; data: PostDocument }[]>();
  useEffect(() => {
    if (!router.isReady) return;
    if (dataFetchedRef.current) return;
    else dataFetchedRef.current = true;
    if (queryParams.tags && !Array.isArray(queryParams.tags)) queryParams.tags = queryParams.tags.split(',');
    getDocs(query(collection(db, 'posts'), where('isPublic', '==', true), orderBy("lastEditTimestamp", 'asc'))).then((posts) => {
      setPosts(posts.docs.map((doc) => {
        return { id: doc.id, data: doc.data() as PostDocument };
      }))
    }).catch((e) => {
      alert("頁面錯誤！請至控制台查看錯誤");
      console.log(e);
    });
  }, [router.isReady]);
  const filteredSearch: () => { id: string; data: PostDocument }[] = () => {
    if (!searchValue) return posts!;
    return posts?.filter(data => data.data.title.includes(searchValue) || data.data.tag.some(substring => substring.includes(searchValue))) || posts!;
  }
  return (
    <PageWrapper className='text-main' lang={lang} page={Global.webMap.index} withNavbar={true} operating={false} Noti={data.Notification}>
      <Breadcrumb args={[{ title: Global.webMap.posts.title(lang), href: "/posts", icon: Global.webMap.posts.nav.icon }]} />
      {posts && <div className="relative text-main focus-within:text-main2 mt-2">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2 mb-4">
          <button type="submit" className="p-1 focus:outline-none focus:shadow-outline">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" className="w-4 h-4"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
        </span>
        <input type="search" value={searchValue} onChange={e => setSearchValue(e.target.value)} className="bg-transparent w-full mb-4 py-2 px-2 text-sm text-main focus:text-main2 border-main2 border focus:border-2 rounded-md pl-8 focus:outline-none" placeholder="收尋標題或標籤" autoComplete="off" />
      </div>}
      {posts && <h2 className='text-sm text-main/80 font-medium'>共 {filteredSearch().length} 篇文章</h2>}
      {!posts && <Loading text='正在查詢中' />}
      {posts && <div className='mt-8 space-y-6'>
        {filteredSearch().map((post, key) => <PostCard key={key} post={post} />)}
      </div>}
    </PageWrapper>
  )
}

export default Home

export const getStaticProps: GetStaticProps = getPropsGlobalDB