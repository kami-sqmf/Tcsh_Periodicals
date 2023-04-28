'use client';

import { AccountsUni, EBooks } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { db } from "@/utils/firebase";
import { addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useRef, useState } from "react";
import { checkOwnedBook } from "./ebook-current-book";
import { LoginModal } from "./ebook-login-modal";
import { EbookModal } from "./ebook-modal";
import { PurchaseModal } from "./ebook-purchase-modal";

const EbookModalWrapper = ({ lang, book, account, EbookBookCoverComponent }: { lang: LangCode; book: EBooks; account: AccountsUni | undefined; EbookBookCoverComponent: JSX.Element; }) => {
  const uploadConfirmRef = useRef<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalSelect, setModalSelect] = useState<number>(0);
  const onBookClick = () => {
    if (account) {
      if (uploadConfirmRef.current) return;
      if (!uploadConfirmRef.current) uploadConfirmRef.current = true;
      if (account.data.ownedBooks && account.data.ownedBooks.includes(book.files.bookId)) setModalSelect(2);
      else if (!book.locked) {
        addDoc(collection(db, "books", book.files.bookId, "license"), {
          voucher: false,
          used: true,
          usedTimestamp: serverTimestamp(),
          customer: doc(db, "accounts", account.data.uid),
          payment: "unlocked",
          createdTimestamp: serverTimestamp()
        });
        updateDoc(doc(db, "accounts", account.data.uid), { ownedBooks: arrayUnion(book.files.bookId) })
        setModalSelect(2);
      } else if (checkOwnedBook(account, book.files.bookId)) setModalSelect(2);
      else setModalSelect(3);
    } else setModalSelect(1);
    return setModalOpen(true);
  }
  return (
    <>
      <div onClick={onBookClick}>{EbookBookCoverComponent}</div>
      {modalSelect === 1 && <LoginModal lang={lang} modalOpen={modalOpen} setModalOpen={setModalOpen} userAgent={window.navigator.userAgent} callback="/ebook" />}
      {modalSelect === 2 && <EbookModal lang={lang} modalOpen={modalOpen} setModalOpen={setModalOpen} files={book.files} />}
      {modalSelect === 3 && <PurchaseModal lang={lang} modalOpen={modalOpen} setModalOpen={setModalOpen} bookId={book.files.bookId} userId={account!.data.uid} />}
    </>
  )
}

export { EbookModalWrapper };
