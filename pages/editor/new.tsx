import type { GetServerSideProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { _t } from '../../language/lang';
import { newPostEditorLink } from '../../utils/editor';
import { getProps_Session } from '../../utils/get-firestore';

const Editor = ({ session, lang }: InferGetStaticPropsType<typeof getProps_Session>) => {
  const router = useRouter();
  const dataFetchedRef = useRef(false);
  
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    const postId = newPostEditorLink(session.firestore.data.uid);
    postId.then((link) => {
      router.push(link);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='min-h-screen bg-background'>
      <div className={'max-w-xs md:max-w-3xl lg:max-w-4xl mx-auto h-screen'}>
        <div className='flex flex-row justify-center items-center h-full w-full'>
          <span className='text-4xl text-main font-medium animate-pulse'>{_t(lang).editor.newEditorLoading}</span>
        </div>
      </div>
    </div>
  )
}
export default Editor

export const getServerSideProps: GetServerSideProps = getProps_Session;