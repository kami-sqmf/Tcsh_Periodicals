/* eslint-disable react-hooks/exhaustive-deps */
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import { Loading } from '../../components/Loading';
import { Breadcrumb } from '../../components/breadcrumb';
import { PageWrapper } from '../../components/page-wrapper';
import { PostCard } from '../../components/post-card';
import { PostDocument } from '../../types/firestore';
import { Global } from '../../types/global';
import { db } from '../../utils/firebase';
import { getPropsGlobalDB } from '../../utils/get-firestore';

const Home = ({ data, lang }: InferGetStaticPropsType<typeof getPropsGlobalDB>) => {
  const router = useRouter();
  const queryParams = router.query;
  const dataFetchedRef = useRef<boolean>(false);
  const [posts, setPosts] = useState<{ id: string; data: PostDocument }[]>();
  useEffect(() => {
    if (!router.isReady) return;
    if (dataFetchedRef.current) return;
    else dataFetchedRef.current = true;
    if (queryParams.tags && !Array.isArray(queryParams.tags)) queryParams.tags = queryParams.tags.split(',');
    getDocs(query(collection(db, 'posts'), (queryParams.tags ? where('tag', 'array-contains-any', queryParams.tags) : where('isPublic', '==', true)), orderBy("lastEditTimestamp", 'asc'))).then((posts) => {
      setPosts(posts.docs.map((doc) => {
        return { id: doc.id, data: doc.data() as PostDocument };
      }))
    }).catch((e) => {
      alert("頁面錯誤！請至控制台查看錯誤");
      console.log(e);
    });
  }, [router.isReady]);
  return (
    <PageWrapper className='text-main' lang={lang} page={Global.webMap.index} withNavbar={true} operating={false}>
      <Breadcrumb args={[{ title: Global.webMap.posts.title(lang), href: "/posts", icon: Global.webMap.posts.nav.icon }, { title: "標籤收尋", href: `/posts/tags?tags=${queryParams.tags?.toString()}`, icon: RiSearchLine }]} />
      <h1 className='mt-4 text-4xl space-x-3'>{Array.isArray(queryParams.tags) && (queryParams.tags as string[]).map((tag, key) => <span key={key}>#{tag}</span>)}</h1>
      {posts && <h2 className='text-sm text-main/80 font-medium'>共 {posts.length} 篇文章</h2>}
      {!posts && <Loading text='正在查詢中' />}
      {posts && <ResultContainer posts={posts} />}
    </PageWrapper>
  )
}

const ResultContainer = ({ posts }: { posts: { id: string; data: PostDocument }[] }) => {
  return (
    <div className='mt-8 space-y-6'>
      {posts.map((post, key) => <PostCard key={key} post={post} />)}
    </div>
  )
}

export default Home

export const getStaticProps: GetStaticProps = getPropsGlobalDB