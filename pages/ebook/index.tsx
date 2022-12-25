import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import { PageWrapper } from '../../components/page-wrapper';
import { _t, langCode } from '../../language/lang';
import { EBooks, EbookFile } from '../../types/firestore';
import { Global } from '../../types/global';
import { getProps_Global_Books_DB } from '../../utils/get-firestore';
import dynamic from 'next/dynamic';
import { Dispatch, SetStateAction, useState } from 'react';
import { Language } from '../../components/language';
import { Breadcrumb } from '../../components/breadcrumb';

const Modal = dynamic(() => import('../../components/ebook-modal').then((res) => res.ModalEbook), {
  ssr: false,
})

const Ebook = ({ data, books, lang }: InferGetStaticPropsType<typeof getProps_Global_Books_DB>) => {
  const [book, setBook] = useState<EbookFile>();
  const [modal, setModal] = useState<boolean>(false);
  return (
    <div>
      <PageWrapper lang={lang} page={Global.webMap.ebook} withNavbar={true} operating={false} Noti={data.Notification}>
        <Breadcrumb args={[{ title: Global.webMap.ebook.title(lang), href: "/ebook", icon: Global.webMap.ebook.nav.icon }]} />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center my-4 px-8 py-12 bg-background2 rounded'>
          {books.sort((a: EBooks, b: EBooks) => a.timestamp - b.timestamp).map((book, key) => (
            <Book key={key} book={book} lang={lang} setBook={setBook} setModalOpen={setModal} />
          ))}
        </div>
        <div className="my-3 flex justify-end">
          <Language lang={lang} />
        </div>
      </PageWrapper>
      <Modal files={book!} lang={lang} modalOpen={modal} setModalOpen={setModal} />
    </div>
  )
}

const Book = ({ book, lang, setBook, setModalOpen }: { book: EBooks; lang: langCode; setBook: Dispatch<SetStateAction<EbookFile | undefined>>; setModalOpen: Dispatch<SetStateAction<boolean>> }) => {
  const callModal = () => {
    if (!book.published) return;
    setBook(book.files);
    setModalOpen(true);
    console.log("asadas")
  }
  return (
    <div className={`${book.published ? "cursor-pointer" : "cursor-not-allowed"} relative flex flex-col items-center px-2 py-4 space-y-2 rounded-lg hover:bg-background/60 transition-all duration-500 group`} onClick={callModal}>
      <span className={`${book.published ? "hidden" : ""} absolute top-[40%] z-20 text-main font-bold`}>{_t(lang).ebook.unpublished}</span>
      <div className={`${book.published ? "" : "blur-md"} relative w-[216px] h-[288px] z-10`}>
        <Image src={book.thumbnail} className='object-contain' alt={_t(lang).imageAlt} fill={true} />
      </div>
      <p className='text-main font-medium group-hover:text-main2 group-hover:font-bold transition-all duration-500'>{book.title}</p>
    </div>
  )
}

export default Ebook

export const getStaticProps: GetStaticProps = getProps_Global_Books_DB;