import { Tab } from '@headlessui/react';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useEffect, useRef, useState } from 'react';
import { RiAdminLine, RiArrowGoBackFill, RiArrowGoBackLine, RiCheckLine, RiCloseLine, RiDeleteBin2Fill, RiDeleteBin2Line, RiPenNibFill, RiPenNibLine, RiSendPlaneFill, RiSendPlaneLine, RiSettings3Line } from 'react-icons/ri';
import { Loading } from '../../components/Loading';
import { Breadcrumb } from '../../components/breadcrumb';
import { PageWrapper } from '../../components/page-wrapper';
import { PostCard } from '../../components/post-card';
import { langCode } from '../../language/lang';
import { PostDocument } from '../../types/firestore';
import { Global } from '../../types/global';
import { db } from '../../utils/firebase';

function Noti({ lang }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataFetchedRef = useRef<boolean>(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [serverSnapshot, setServerSnapshot] = useState<{ id: string; data: PostDocument }[]>();
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    onSnapshot(query(collection(db, 'posts'), orderBy("createdTimestamp", 'desc')), snapshot => {
      setServerSnapshot(snapshot.docs.map((doc) => {
        return { id: doc.id, data: doc.data() as PostDocument };
      }));
    })
  }, [])
  const filteredSearch: () => { id: string; data: PostDocument }[] | null = () => {
    if (!searchValue) return null;
    return serverSnapshot?.filter(data => data.data.title.includes(searchValue) || data.data.tag.some(substring => substring.includes(searchValue))) || null;
  }
  return (
    <PageWrapper lang={lang} page={Global.webMap.admin.child.notification} withNavbar={true} operating={false}>
      <Breadcrumb args={[{ title: "管理員", href: "/admin", icon: RiAdminLine }, { title: Global.webMap.admin.child.posts.title(lang), href: Global.webMap.admin.child.posts.href, icon: Global.webMap.admin.child.posts.nav.icon }]} />
      {!serverSnapshot && <Loading text='正在載入中' />}
      {serverSnapshot && <div className='mx-auto my-6 w-full'>
        <div className="relative text-main focus-within:text-main2">
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
              <div className='absolute -top-3 -right-2 text-sm bg-main2 rounded-full px-[6px] text-background2'>{serverSnapshot?.filter((doc) => doc.data.isPublic).length}</div>
              <div className='relative w-6 h-6'>
                <RiSendPlaneFill className='absolute w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                <RiSendPlaneLine className='absolute w-6 h-6 opacity-100 group-hover:opacity-0 transition-opacity duration-500' />
              </div>
              <span>已發佈</span>
            </Tab>
            <Tab as='div' className="flex flex-col md:flex-row items-center relative rounded bg-main group text-background px-4 py-2 md:text-lg space-x-2 hover:bg-background2 hover:text-main ui-selected:bg-main2 transition-all duration-500 outline-none cursor-pointer">
              <div className='absolute -top-3 -right-2 text-sm bg-main2 rounded-full px-[6px] text-background2'>{serverSnapshot?.filter((doc) => !doc.data.isPublic && doc.data.data.blocks).length}</div>
              <div className='relative w-6 h-6'>
                <RiPenNibFill className='absolute w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                <RiPenNibLine className='absolute w-6 h-6 opacity-100 group-hover:opacity-0 transition-opacity duration-500' />
              </div>
              <span>草稿</span>
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              {serverSnapshot?.filter((doc) => doc.data.isPublic).map((doc, key) => (
                <div key={key} className='mt-8 space-y-6'>
                  <ToolBar id={doc.id} published={doc.data.isPublic} />
                  <PostCard post={doc} isEditor={true} />
                </div>
              ))}
            </Tab.Panel>
            <Tab.Panel>
              {serverSnapshot?.filter((doc) => !doc.data.isPublic && doc.data.data.blocks).map((doc, key) => (
                <div key={key} className='mt-8 space-y-6'>
                  <ToolBar id={doc.id} published={doc.data.isPublic} />
                  <PostCard post={doc} isEditor={true} />
                </div>
              ))}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        }
      </div>}
    </PageWrapper>
  );
}

export const ToolBar = ({ id, published }: { id: string; published: boolean }) => {
  const operationType = useRef<"Delete" | "Unpublised">();
  const [confirmAsk, setConfirmAsk] = useState<boolean>(false);
  const onUnpublishedClick = () => {
    setConfirmAsk(true);
    operationType.current = "Unpublised";
    setTimeout(() => {
      setConfirmAsk(false);
    }, 5000)
  }
  const onDeleteClick = () => {
    setConfirmAsk(true);
    operationType.current = "Delete";
    setTimeout(() => {
      setConfirmAsk(false);
    }, 5000)
  }
  const handleOperation = async () => {
    if (!operationType.current) return setConfirmAsk(false);
    if (operationType.current === "Delete") {
      await deleteDoc(doc(db, "posts", id));
    }
    if (operationType.current === "Unpublised") {
      await updateDoc(doc(db, "posts", id), { isPublic: false });
    }
    return setConfirmAsk(false);
  }
  return (
    <div className='flex flex-row justify-between items-center -mb-4 text-main'>
      {published && <div className='flex flex-row space-x-2'>
        <RiSettings3Line className='w-6 h-6 opacity-100 group-hover:opacity-0 transition-opacity duration-500' />
        <span>設定</span>
      </div>}
      {!published && <div className='flex flex-row space-x-2 text-main'>
        <RiPenNibLine className='w-6 h-6 opacity-100 group-hover:opacity-0 transition-opacity duration-500' />
        <span>未發佈</span>
      </div>}
      {!confirmAsk && <div className='flex flex-row space-x-4'>
        {published && <div className='group flex flex-row space-x-2 hover:text-main2 cursor-pointer' onClick={onUnpublishedClick}>
          <div className='relative w-5 h-5'>
            <RiArrowGoBackFill className='absolute w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300' />
            <RiArrowGoBackLine className='absolute w-5 h-5 opacity-100 group-hover:opacity-0 transition-all duration-300' />
          </div>
          <span className='transition-all duration-300'>取消發布</span>
        </div>}
        <div className='group flex flex-row space-x-2 hover:text-main2 cursor-pointer' onClick={onDeleteClick}>
          <div className='relative w-5 h-5'>
            <RiDeleteBin2Fill className='absolute w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300' />
            <RiDeleteBin2Line className='absolute w-5 h-5 opacity-100 group-hover:opacity-0 transition-all duration-300' />
          </div>
          <span className='transition-all duration-300'>刪除</span>
        </div>
      </div>}
      {confirmAsk && <div className='flex flex-row space-x-4'>
        <div className='flex flex-row space-x-2 text-main hover:text-main2 cursor-pointer' onClick={handleOperation}>
          <RiCheckLine className='w-6 h-6' />
          <span>確認</span>
        </div>
        <div className='flex flex-row space-x-2 text-main hover:text-main2 cursor-pointer' onClick={handleOperation}>
          <RiCloseLine className='w-6 h-6' />
          <span>退回</span>
        </div>
      </div>}
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      lang: (context.locale ? context.locale : "zh") as langCode,
    },
  };
}

export default Noti