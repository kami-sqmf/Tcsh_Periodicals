import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction } from "react";
import { RiCloseFill, RiCloseLine } from "react-icons/ri";
import { HoverICON } from "../global/hover-icon";
import { ModalInfos, Toolbar } from "./admin";

const AdminManageModal = ({ modalInfos, modalOpen, setModalOpen, modalType }: { modalInfos: ModalInfos['infos']; modalOpen: boolean; setModalOpen: Dispatch<SetStateAction<boolean>>; modalType: Toolbar['actions'][number]['name']; }) => (
  <Transition show={modalOpen} as={Fragment}>
    <Dialog onClose={() => { setModalOpen(false); }} as="div" className="fixed z-50 inset-0 overflow-y-auto">

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
        <div className="fixed inset-0" aria-hidden="true">
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel as="div" className="flex flex-col px-8 py-6 bg-background/95 text-main rounded-lg items-start justify-center min-w-[75vw] md:min-w-fit">
                <Dialog.Title as="div" className="flex flex-row w-full justify-between items-start">
                  {modalInfos.find((mod) => mod.name === modalType) && <h1 className='font-medium text-xl mb-2'>{modalInfos.find((mod) => mod.name === modalType)?.title}</h1>}
                  <div onClick={() => setModalOpen(false)}><HoverICON className="w-7 h-7 cursor-pointer" Icon={RiCloseLine} IconHover={RiCloseFill} size={7} /></div>
                </Dialog.Title>
                {modalInfos.find((mod) => mod.name === modalType)?.modal}
              </Dialog.Panel>
            </div>
          </div>
        </div>
      </Transition.Child>
    </Dialog>
  </Transition>
)
export { AdminManageModal };
