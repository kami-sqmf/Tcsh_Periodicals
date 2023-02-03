import type { GetServerSideProps, GetStaticProps, InferGetStaticPropsType } from 'next';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { Breadcrumb } from '../../components/breadcrumb';
import { Language } from '../../components/language';
import { PageWrapper } from '../../components/page-wrapper';
import { _t, langCode } from '../../language/lang';
import { isAdmin } from '../../middleware';
import { AccountsUni, EBooks, EbookFile } from '../../types/firestore';
import { Global } from '../../types/global';
import { getProps_Global_Books_DB } from '../../utils/get-firestore';


const Modal = dynamic(() => import('../../components/ebook-modal').then((res) => res.ModalEbook), {
  ssr: false,
})

const LoginModal = dynamic(() => import('../../components/login-modal').then((res) => res.ModalLogin), {
  ssr: false,
})

const PurchaseModal = dynamic(() => import('../../components/purchase-modal').then((res) => res.ModalPurchase), {
  ssr: false,
})

const Ebook = ({ data, books, lang, providers, userAgent }: InferGetStaticPropsType<typeof getProps_Global_Books_DB>) => {
  const session = useSession();
  const [book, setBook] = useState<EbookFile>();
  const [modal, setModal] = useState<boolean>(false);
  const [modalLogin, setModalLogin] = useState<boolean>(false);
  const [modalPurchase, setModalPurchase] = useState<boolean>(false);
  return (
    <div>
      <PageWrapper lang={lang} page={Global.webMap.ebook} withNavbar={true} operating={false} Noti={data.Notification}>
        <Breadcrumb args={[{ title: Global.webMap.ebook.title(lang), href: "/ebook", icon: Global.webMap.ebook.nav.icon }]} />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center my-4 px-8 py-12 bg-background2 rounded'>
          {books.sort((a: EBooks, b: EBooks) => a.timestamp - b.timestamp).map((book, key) => (
            <Book key={key} book={book} lang={lang} setBook={setBook} setModalOpen={setModal} setModalLogin={setModalLogin} setModalPurchase={setModalPurchase} session={session.data} />
          ))}
        </div>
        <div className="my-3 flex justify-end">
          <Language lang={lang} />
        </div>
      </PageWrapper>
      {session.status === "unauthenticated" && <LoginModal lang={lang} modalOpen={modalLogin} setModalOpen={setModalLogin} providers={providers} userAgent={userAgent} callback="/ebook" />}
      {session.status === "authenticated" && <PurchaseModal lang={lang} modalOpen={modalPurchase} setModalOpen={setModalPurchase} bookId={book?.bookId} userId={session.data.firestore.data.uid} />}
      {session.status === "authenticated" && <Modal files={book!} lang={lang} modalOpen={modal} setModalOpen={setModal} admin={isAdmin(session.data?.firestore!)} />}
    </div>
  )
}

const Book = ({ book, lang, setBook, setModalLogin, setModalOpen, setModalPurchase, session }: { book: EBooks; lang: langCode; setBook: Dispatch<SetStateAction<EbookFile | undefined>>; setModalLogin: Dispatch<SetStateAction<boolean>>; setModalPurchase: Dispatch<SetStateAction<boolean>>; setModalOpen: Dispatch<SetStateAction<boolean>>; session: Session | null }) => {
  const callModal = async () => {
    if (!book.published) return;
    setBook(book.files);
    const uid = session?.firestore.data.uid;
    console.log(uid)
    if (!uid) return setModalLogin(true);
    if (book.locked) {
      if (session?.firestore.type !== "Member") { if (!book.owner.includes(uid)) return setModalPurchase(true); }
    }
    setModalOpen(true);
  }
  return (
    <div className={`${book.published ? "cursor-pointer" : "cursor-not-allowed"} relative flex flex-col items-center px-2 py-4 space-y-2 rounded-lg hover:bg-background/60 transition-all duration-500 group`} onClick={callModal}>
      <span className={`${book.published ? "hidden" : ""} absolute top-[40%] z-20 text-main font-bold`}>{_t(lang).ebook.unpublished}</span>
      <div className={`${book.published ? "" : "blur-md"} relative w-[216px] h-[288px] z-10`}>
        <Image src={book.thumbnail} className='object-contain' alt={_t(lang).imageAlt} fill={true} />
      </div>
      <p className='text-main font-medium group-hover:text-main2 group-hover:font-bold transition-all duration-500'>{book.title}</p>
      <p className='text-main text-xs !-mt-0.5 group-hover:text-main2 transition-all duration-500'>{!book.published ? _t(lang).ebook.unpublishedCover : (book.price ? ownBook(session?.firestore, book) ? _t(lang).ebook.downloadNow : `${_t(lang).ebook.buy} NTD ${book.price}` : _t(lang).ebook.downloadFree)}</p>
    </div>
  )
}

function ownBook(firestore: AccountsUni | undefined, book: EBooks) {
  const uid = firestore?.data.uid;
  if (!uid) return false; // Call Login
  if (firestore?.type === "Member") return true;
  if (!book.owner.includes(uid)) return false;
  return true;
}

export default Ebook

export const getServerSideProps: GetServerSideProps = getProps_Global_Books_DB;