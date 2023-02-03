'use client'

import { OutputData } from "@editorjs/editorjs"
import { Dialog, Transition } from "@headlessui/react"
import { ChangeEvent, Fragment, MutableRefObject, useEffect, useRef, useState } from "react"
import { SetterOrUpdater } from "recoil"
import { langCode } from "../language/lang"
import { AccountsUni } from "../types/firestore"

export const ModalEditorPublish = ({ lang, modalOpen, setModalOpen, data, user, titleRef }: { lang: langCode; modalOpen: boolean; setModalOpen: SetterOrUpdater<boolean>; data: OutputData; user: AccountsUni; titleRef: MutableRefObject<HTMLInputElement> }) => {
  const hiddenTextarea = useRef<any>(null);
  const [rowTextarea, setTextarea] = useState<number>(1);
  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    hiddenTextarea.current.value = e.target.value;
    setTextarea(hiddenTextarea.current.scrollHeight / 24);
  }
  useEffect(() => {
    hiddenTextarea.current.value = data?.blocks[0]?.data?.text.slice(0, 140);
    setTextarea(hiddenTextarea.current.scrollHeight / 24);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hiddenTextarea]);
  return (
    <Transition show={modalOpen} as={Fragment}>
      <Dialog onClose={() => { setModalOpen(false); }} as="div" className="fixed z-30 inset-0 overflow-y-auto" >

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
              <Dialog.Panel as="div" className="grid grid-cols-1 md:grid-cols-2 gap-4 text-main">
                <div className="flex flex-col prose-h1:font-medium prose-h1:text-4xl">
                  <div className="space-y-4">
                    <h1>投稿成品預覽</h1>
                    <div className="flex flex-col border-main border-b-2">
                      <p className="text-xs text-main/80">標題</p>
                      <input className="bg-transparent focus:outline-none text-2xl" defaultValue={titleRef.current ? titleRef.current.value : "未命名"} />
                    </div>
                    <div className="flex flex-col border-main border-b-2">
                      <p className="text-xs text-main/80">預覽簡述：</p>
                      <textarea maxLength={140} className="text-base resize-none w-60 bg-transparent focus:outline-none" rows={rowTextarea} defaultValue={data?.blocks[0]?.data?.text.slice(0, 140)} placeholder="請輸入簡述" onChange={handleTextArea}/>
                      <textarea maxLength={140} className="text-base resize-none w-60 invisible absolute overflow-hidden" rows={1} ref={hiddenTextarea} disabled></textarea>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  Right
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog >
    </Transition >
  )
}