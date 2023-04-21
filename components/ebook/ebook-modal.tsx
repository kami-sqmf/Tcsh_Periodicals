'use client';

import i18nDefault from '@/translation/ebook/zh.json';
import { EbookFile, EbookFileInfo } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import i18n from "@/utils/i18n";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { RiArrowUpSFill, RiCloseFill, RiCloseLine } from "react-icons/ri";
import { HoverICON } from "../global/hover-icon";

const EbookModal = ({ lang, modalOpen, setModalOpen, files }: { lang: LangCode; modalOpen: boolean; setModalOpen: Dispatch<SetStateAction<boolean>>; files: EbookFile }) => {
  const t = new i18n<typeof i18nDefault>(lang, "ebook");
  const [section, setSection] = useState<number>(0);
  if (files) return (<Transition show={modalOpen} as={Fragment}>
    <Dialog onClose={() => { setModalOpen(false); setSection(0); }} as="div" className="fixed z-50 inset-0 overflow-y-auto">

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
                <Dialog.Title as="div" className="flex flex-row w-full justify-between items-start select-none gap-2">
                  {section == 0 && <h1 className='font-medium text-xl mb-2'>{t._("select_platform")}</h1>}
                  {section != 0 && <h1 className='font-medium text-xl mb-2'>{t._("select_version")}</h1>}
                  <div onClick={() => { setModalOpen(false); setSection(0); }}><HoverICON className="w-7 h-7 cursor-pointer" Icon={RiCloseLine} IconHover={RiCloseFill} size={7} /></div>
                </Dialog.Title>
                <div className="mt-2 [&>div]:space-y-2">
                  {section == 0 && <div className="flex flex-col items-center">
                    <div onClick={() => { setSection(2) }}><Sections file={{ ...files["epub-compressed"], link: "#" }} type="EPUB" alt={t._("platform_apple") as string} /></div>
                    <div onClick={() => { setSection(1) }}><Sections file={{ ...files["pdf-compressed"], link: "#" }} type="PDF" alt={t._("platform_others") as string} /></div>
                  </div>}
                  {section == 1 && <div>
                    <Sections file={files.pdf} type="PDF" alt={t._("format", { format: "PDF" }) as string} />
                    <Sections file={files["pdf-compressed"]} type="PDF" alt={t._("format_compressed", { format: "PDF" }) as string} />
                  </div>}
                  {section == 2 && <div>
                    <Sections file={files.epub} type="EPUB" alt={t._("format", { format: "EPUB" }) as string} />
                    <Sections file={files["epub-compressed"]} type="EPUB" alt={t._("format_compressed", { format: "EPUB" }) as string} />
                  </div>}
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </div>
      </Transition.Child>
    </Dialog>
  </Transition>
  );
  else return (<></>)
}

const Sections = ({ file, alt, type }: { file: EbookFileInfo; alt: string; type: "EPUB" | "PDF"; }) => (
  <div className="flex flex-col items-center justify-center space-y-0.5">
    <ButtonLink file={file} type={type} />
    <div className="flex flex-row space-x-0.5 text-main">
      <RiArrowUpSFill className="h-4" />
      <p className="text-xs">{`${alt}${" (" + file.size + "MB)"}`}</p>
    </div>
  </div>
)

const ButtonLink = ({ file, type }: { file: EbookFileInfo; type: "EPUB" | "PDF"; }) => {
  return (<Link href={file.link == "#" ? "javascript:void(0);" : file.link} target={file.link == "#" ? "_self" : "_blank"} prefetch={false} className="flex flex-row items-center justify-around bg-background2 px-4 py-2 rounded-md w-[165px]">
    {type == "EPUB" && <Image alt="EPUB" src="/ebook/books.png" className="w-8 h-8 mr-2" width={32} height={32} />}
    {type == "PDF" && <Image alt="PDF" src="/ebook/PDF.png" className="w-11 h-11 -ml-2" width={44} height={44} />}
    <div className="flex flex-col">
      <p className="text-xs -mb-1">Get it {type == "EPUB" ? "on" : "with"}</p>
      <p className="text-md font-medium">{type == "EPUB" ? "Apple Books" : "PDF Format"}</p>
    </div>
  </Link>)
}

export { EbookModal };
