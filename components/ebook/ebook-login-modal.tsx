'use client';

import { LangCode } from "@/types/i18n";
import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction } from "react";
import { LoginInner } from "../global/login-inner";

export const LoginModal = ({ lang, modalOpen, setModalOpen, userAgent, callback }: { lang: LangCode; modalOpen: boolean; setModalOpen: Dispatch<SetStateAction<boolean>>; userAgent: string | undefined; callback: string; }) => {
  return (
    <Transition show={modalOpen} as={Fragment}>
      <Dialog onClose={() => { setModalOpen(false) }} as="div" className="fixed z-30 inset-0 overflow-y-auto" >

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
              <Dialog.Title>請您先登入帳號！</Dialog.Title>
              <Dialog.Panel className="mt-2 px-8 bg-background2 rounded-xl">
                <LoginInner userAgent={userAgent ? userAgent : null} callback={callback} lang={lang} />
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}