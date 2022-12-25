import { Dialog, Transition } from "@headlessui/react"
import { _t, langCode } from "../language/lang"
import { EbookFile, EbookFileInfo } from "../types/firestore"
import { Fragment } from "react"
import { SetterOrUpdater } from "recoil"
import Link from "next/link"
import Image from "next/image"
import { RiArrowUpSFill } from "react-icons/ri"

export const ModalEbook = ({ files, lang, modalOpen, setModalOpen }: { files: EbookFile; lang: langCode; modalOpen: boolean; setModalOpen: SetterOrUpdater<boolean> }) => {
  if (files)
    return (
      <Transition show={modalOpen} as={Fragment}>
        <Dialog onClose={() => setModalOpen(false)} as="div" className="fixed z-30 inset-0 overflow-y-auto" >

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
                <Dialog.Title>
                  {_t(lang).ebook.select}
                </Dialog.Title>
                <Dialog.Panel className="mt-2 space-y-3">
                  <ButtonLink file={files.pdf} type="PDF" alt={_t(lang).ebook.pdf} lang={lang} />
                  <ButtonLink file={files["pdf-compressed"]} type="PDF" alt={_t(lang).ebook.pdfCompressed} lang={lang} />
                  <ButtonLink file={files.epub} type="EPUB" alt={_t(lang).ebook.epub} lang={lang} />
                  <ButtonLink file={files["epub-compressed"]} type="EPUB" alt={_t(lang).ebook.epubCompressed} lang={lang} />
                </Dialog.Panel>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    )
  else return (<></>)
}

const ButtonLink = ({ file, alt, type, lang }: { file: EbookFileInfo; alt: string; type: "EPUB" | "PDF"; lang: langCode }) => (
  <div className="flex flex-col items-center justify-center space-y-0.5">
    <Link href={file.link} target="_blank" className="flex flex-row items-center justify-around bg-background2 px-4 py-2 rounded-md">
      {type == "EPUB" && <Image alt={_t(lang).imageAlt} src="/ebook/books.png" className="w-8 h-8 mr-2" width={32} height={32} />}
      {type == "PDF" && <Image alt={_t(lang).imageAlt} src="/ebook/PDF.png" className="w-11 h-11 -ml-2" width={44} height={44} />}
      <div className="flex flex-col">
        <p className="text-xs -mb-1">Get it {type == "EPUB" ? "on" : "with"}</p>
        <p className="text-md font-medium">{type == "EPUB" ? "Apple Books" : "PDF Format"}</p>
      </div>
    </Link>
    <div className="flex flex-row space-x-0.5 text-main">
      <RiArrowUpSFill className="h-4" />
      <p className="text-xs">{`${alt} (${file.size}MB)`}</p>
    </div>
  </div>
)