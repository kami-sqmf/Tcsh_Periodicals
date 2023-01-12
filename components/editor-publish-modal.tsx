import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import { RiCheckDoubleFill, RiClipboardFill, RiClipboardLine } from "react-icons/ri"
import { SetterOrUpdater } from "recoil"
import { _t, langCode } from "../language/lang"

export const ModalEditorPublish = ({ lang, modalOpen, setModalOpen }: { lang: langCode; modalOpen: boolean; setModalOpen: SetterOrUpdater<boolean>; }) => {
  const [section, setSection] = useState<number>(0);
  const [voucher, setVoucher] = useState<string>("正在生產中⋯⋯");
  const [clipboard, setClipboard] = useState<boolean>(false);

  return (
    <Transition show={modalOpen} as={Fragment}>
      <Dialog onClose={() => { setModalOpen(false); setSection(0); setVoucher("正在生產中⋯⋯") }} as="div" className="fixed z-30 inset-0 overflow-y-auto" >

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
            <div className="flex flex-col px-8 py-6 bg-background/95 rounded-lg items-center justify-center">
              <Dialog.Title className="text-main select-none">
                {section == 0 && _t(lang).ebook.selectPlatform}
                {section != 0 && _t(lang).ebook.selectCompressed}
              </Dialog.Title>
              <Dialog.Panel className="mt-2 [&>div]:space-y-2">
                {section == 0 && <div className="flex flex-col items-center">
                  <div onClick={(e) => { setSection(2) }}></div>
                  <div onClick={(e) => { setSection(1) }}></div>
                </div>}
                {section == 3 && <div className="flex flex-col items-center">
                  <div className="flex flex-row space-x-2 items-center">
                    <span className="text-lg font-bold text-main">{voucher}</span>
                    <div className="relative text-main group cursor-pointer w-5 h-5" onClick={() => { navigator.clipboard.writeText(voucher); setClipboard(true); setTimeout(() => setClipboard(false), 1500) }}>
                      <RiClipboardFill className={`${!clipboard ? "visible" : "hidden"} absolute opacity-0 group-hover:opacity-100 w-5 h-5 transition-all duration-300`} />
                      <RiClipboardLine className={`${!clipboard ? "visible" : "hidden"} absolute opacity-100 group-hover:opacity-0 w-5 h-5 transition-all duration-300`} />
                      <RiCheckDoubleFill className={`${!clipboard ? "invisible" : "visible"} absolute w-5 h-5 animate-mailFly`} />
                    </div>
                  </div>
                </div>}
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog >
    </Transition >
  )
}