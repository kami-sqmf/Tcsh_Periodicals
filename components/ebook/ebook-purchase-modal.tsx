"use client";

import i18nDefault from '@/translation/ebook/zh.json';
import { LangCode } from "@/types/i18n";
import { db } from '@/utils/firebase';
import i18n from '@/utils/i18n';
import { Dialog, Transition } from "@headlessui/react";
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import { Fragment, useState } from "react";
import { RiCoupon3Line } from "react-icons/ri";
import { SetterOrUpdater } from "recoil";
import { Loading } from '../global/loading';

export const PurchaseModal = ({ lang, modalOpen, setModalOpen, bookId, userId }: { lang: LangCode; modalOpen: boolean; setModalOpen: SetterOrUpdater<boolean>; userId: string; bookId: string | undefined }) => {
  const router = useRouter();
  const t = new i18n<typeof i18nDefault>(lang, "ebook");
  const [section, setSection] = useState<number>(0);
  const [process, setProcess] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const validateVoucher = async (bookId: string | undefined, userId: string, voucher: string) => {
    if (!bookId) {
      setMessage(t._("message_book_not_exist") as string)
      return setProcess(false);
    }
    setProcess(true);
    const res = await getDocs(query(collection(db, "books", bookId, "license"), where("used", "==", false), where("code", "==", voucher)));
    if (res.empty) {
      setMessage(t._("message_voucher_unmatched") as string);
      return setProcess(false);
    }
    await updateDoc(doc(db, "accounts", userId), { ownedBooks: arrayUnion(bookId) });
    await updateDoc(doc(db, "books", bookId, "license", res.docs[0].id), {
      used: true,
      usedTimestamp: serverTimestamp(),
      customer: doc(db, "accounts", userId),
    });
    setSuccess(true);
    setProcess(false);
    return setMessage(t._("message_purchase_successfully") as string);
  }
  return (
    <Transition show={modalOpen} as={Fragment}>
      <Dialog onClose={() => {
        setModalOpen(false);
        setSection(0);
        setMessage("");
        setSuccess(false);
        if (success) router.refresh();
      }} as="div" className="fixed z-30 inset-0 overflow-y-auto" >

        {/* BackBlur */}
        <Transition.Child as={Fragment}
          enter="transition duration-75 ease-out"
          leave="transition duration-75 ease-out"
          enterFrom="transform opacity-0"
          enterTo="transform opacity-100"
          leaveFrom="transform opacity-100"
          leaveTo="transform opacity-0">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        {/* MenuContainer */}
        <Transition.Child as={Fragment}
          enter="transition duration-100 ease-out"
          leave="transition duration-75 ease-out"
          enterFrom="transform scale-75 opacity-50"
          enterTo="transform scale-100 opacity-100"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-75 opacity-50"
        >
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="flex flex-col px-8 py-6 bg-background rounded-lg items-center justify-center text-main font-medium">
              <Dialog.Title>
                {section === 0 && <span>{t._("purchase_method")}</span>}
                {section === 1 && !process && !success && <span>{t._("purchase_voucher")}</span>}
              </Dialog.Title>
              <Dialog.Panel className="mt-3">
                {section === 0 && <div>
                  <div onClick={() => setSection(1)} className="flex flex-row items-center justify-center space-x-2 bg-background2 px-4 py-1 rounded-lg w-48 cursor-pointer hover:scale-105 transition-all duration-300">
                    <RiCoupon3Line className="w-6 h-6" />
                    <span>{t._("purchase_voucher_use")}</span>
                  </div>
                </div>}
                {section === 1 && <div>
                  {!process && !success && <div className="flex flex-col items-center space-y-2">
                    <input id="voucher" type="text" className="px-2 py-1 rounded w-52" placeholder={t._("purchase_voucher_input") as string} />
                    <span className="text-red-600 text-xs font-normal">{message}</span>
                    <div className='flex flex-col-reverse md:flex-row w-full justify-around'>
                      <button className='px-3 py-2 bg-red-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0' onClick={() => setSection(0)}>返回</button>
                      <button className='px-3 py-2 bg-green-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0 disabled:bg-green-600/70' onClick={(e) => validateVoucher(bookId, userId, (document.querySelector("#voucher") as any).value)}>送出</button>
                    </div>
                  </div>}
                  {process && <Loading className='h-20 w-24 items-center mb-2' text='交易處理中' />}
                  {success && <div className=" flex flex-col items-center">
                    <div className="success-checkmark scale-75">
                      <div className="check-icon">
                        <span className="icon-line line-tip"></span>
                        <span className="icon-line line-long"></span>
                        <div className="icon-circle"></div>
                        <div className="icon-fix"></div>
                      </div>
                    </div>
                    <span className="text-green-700/80 select-none">{message}</span>
                  </div>}
                </div>}
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}