import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import { SetterOrUpdater } from "recoil"
import { _t, langCode } from "../language/lang"
import { RiCheckLine, RiCheckboxCircleFill, RiCheckboxCircleLine, RiCoupon3Fill, RiCoupon3Line } from "react-icons/ri"
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../utils/firebase"
import { useRouter } from "next/router"

export const ModalPurchase = ({ lang, modalOpen, setModalOpen, bookId, userId }: { lang: langCode; modalOpen: boolean; setModalOpen: SetterOrUpdater<boolean>; userId: string; bookId: string | undefined }) => {
  const [section, setSection] = useState<number>(0);
  const [process, setProcess] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const validateVoucher = async (bookId: string | undefined, userId: string, voucher: string) => {
    if (!bookId) {
      setMessage(_t(lang).ebook.purchase.message.notExist)
      return setProcess(false);
    }
    setProcess(true);
    const res = await getDoc(doc(db, "books", bookId));
    if (!res.exists()) {
      setMessage(_t(lang).ebook.purchase.message.notExist)
      return setProcess(false);
    }
    const data = res.data();
    const vouchers = data.voucher;
    if (!vouchers.includes(voucher)) {
      setMessage(_t(lang).ebook.purchase.message.unmatched);
      return setProcess(false);
    }
    await updateDoc(doc(db, "books", bookId), { owner: arrayUnion(userId) });
    await updateDoc(doc(db, "books", bookId), { voucher: arrayRemove(voucher) });
    setSuccess(true);
    setProcess(false);
    return setMessage(_t(lang).ebook.purchase.message.success);
  }
  const router = useRouter();
  return (
    <Transition show={modalOpen} as={Fragment}>
      <Dialog onClose={() => {
        if (success) {
          router.reload();
        } else {
          setModalOpen(false);
          setSection(0);
          setMessage("");
          setSuccess(false);
        }
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
                {section === 0 && <span>{_t(lang).ebook.purchase.chooseMethod}</span>}
                {section === 1 && !process && !success && <span>{_t(lang).ebook.purchase.voucher.title}</span>}
              </Dialog.Title>
              <Dialog.Panel className="mt-3">
                {section === 0 && <div>
                  <div onClick={() => setSection(1)} className="flex flex-row items-center justify-center space-x-2 bg-background2 px-4 py-1 rounded-lg w-48 cursor-pointer hover:scale-105 transition-all duration-300">
                    <RiCoupon3Line className="w-6 h-6" />
                    <span>{_t(lang).ebook.purchase.voucher.use}</span>
                  </div>
                </div>}
                {section === 1 && <div>
                  {!process && !success && <div className="flex flex-col items-center space-y-2">
                    <input id="voucher" type="text" className="px-2 py-1 rounded w-52" placeholder={_t(lang).ebook.purchase.voucher.input} />
                    <span className="text-red-600 text-xs font-normal">{message}</span>
                    <div className='flex flex-col-reverse md:flex-row w-full justify-around'>
                      <button className='px-3 py-2 bg-red-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0' onClick={() => setSection(0)}>{_t(lang).form.back}</button>
                      <button className='px-3 py-2 bg-green-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0 disabled:bg-green-600/70' onClick={(e) => validateVoucher(bookId, userId, (document.querySelector("#voucher") as any).value)}>{_t(lang).form.send}</button>
                    </div>
                  </div>}
                  {process && <span className="text-lg animate-pulse">{_t(lang).processing}</span>}
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