"use client";

const _ = require('lodash');
import { BreadcrumbWrapper } from "@/components/breadcumb/breadcumb";
import { HoverICON } from "@/components/global/hover-icon";
import { Loading } from "@/components/global/loading";
import { Slide } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { db, storage } from "@/utils/firebase";
import { Dialog, Transition } from "@headlessui/react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc, writeBatch } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import Image from "next/image";
import { ChangeEvent, Dispatch, FormEvent, Fragment, MouseEvent, SetStateAction, useEffect, useRef, useState } from "react";
import { RiAddCircleFill, RiAddCircleLine, RiArrowDownCircleFill, RiArrowDownCircleLine, RiArrowUpCircleFill, RiArrowUpCircleLine, RiCloseFill, RiCloseLine, RiDeleteBin5Fill, RiDeleteBin5Line, RiEdit2Fill, RiEdit2Line } from "react-icons/ri";

export default function Page({ params }: { params: { locale: LangCode } }) {
  const dataFetchedRef = useRef<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<ModalInfo>(null);
  const [modalType, setModalType] = useState<ModalType>("add");
  const [toolbarStatus, setToolbarStatus] = useState<"add" | "edit">("add");
  const [serverSnapshot, setServerSnapshot] = useState<{ id: string; data: Slide }[]>();
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    onSnapshot(query(collection(db, 'slides'), orderBy("order", 'asc')), snapshot => {
      setServerSnapshot(snapshot.docs.map((doc) => {
        return { id: doc.id, data: doc.data() as Slide };
      }));
    })
  })
  const onEbookContainerClicked = (e: MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.childNodes[0].contains(e.target as any)) return;
    if (e.currentTarget.childNodes[1] !== e.target && e.currentTarget.childNodes[1].contains(e.target as any)) {
      setToolbarStatus("edit");
    }
    else {
      setToolbarStatus("add");
      setModalType("add");
      setModalInfo(null)
    }
    return;
  }
  return (
    <>
      <BreadcrumbWrapper args={[{ title: webInfo.webMap.admin.title(params.locale) as string, href: webInfo.webMap.admin.href, icon: webInfo.webMap.admin.nav.icon }, { title: webInfo.webMap.admin.child.banner.title(params.locale) as string, href: webInfo.webMap.admin.child.banner.href, icon: webInfo.webMap.admin.child.banner.nav.icon }]} />
      {serverSnapshot ?
        <div className='mx-auto my-6 w-full bg-background2 rounded-md min-h-[70vh] px-8 py-6' onClickCapture={onEbookContainerClicked}>
          <ToolBar toolbarStatus={toolbarStatus} setModalOpen={setModalOpen} setModalType={setModalType} modalInfo={modalInfo} serverSnapshot={serverSnapshot} />
          <div className='mt-3 grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center mxy-4 h-full'>
            {serverSnapshot.sort((a, b) => a.data.order - b.data.order).map((slide, key) => (
              <div key={key} className={`w-full p-6 flex flex-col justify-center items-center space-y-2 ${modalInfo?.id === slide.id ? "bg-background/60" : "hover:bg-background/60"} rounded-md transition-all duration-500 `} onClick={() => setModalInfo({ id: slide.id, ...slide.data })}>
                <div className={`relative w-full h-auto aspect-[21/9] xl:aspect-[21/7] border-2 border-main rounded-lg cursor-pointer overflow-hidden`}>
                  <Image src={slide.data.image} fill={true} className="object-cover" alt="圖片" sizes="(max-width: 1024px) 272px, (max-width: 768px) 188vw, 268vw" />
                </div>
                <span className="flex-2 text-main2">{slide.data.title}</span>
              </div>
            ))}
          </div>
        </div>
        : <div className="min-h-[74vh] w-full flex justify-center items-center"><Loading text="載入中" /></div>
      }
      {serverSnapshot && <Modal modalOpen={modalOpen} setModalOpen={setModalOpen} modalType={modalType} modalInfo={modalInfo} nextOrder={serverSnapshot.reduce((prev, curr) => prev.data.order > curr.data.order ? prev : curr).data.order + 1} />}
    </>
  )
}

const ToolBar = ({ toolbarStatus, setModalOpen, setModalType, modalInfo, serverSnapshot }: { toolbarStatus: "add" | "edit"; setModalOpen: Dispatch<SetStateAction<boolean>>; setModalType: Dispatch<SetStateAction<ModalType>>; modalInfo: ModalInfo; serverSnapshot: { id: string; data: Slide }[] }) => {
  const onOrderChange = async (top: boolean) => {
    if (!serverSnapshot && !modalInfo) return;
    else {
      const operatingObject = serverSnapshot.filter(({ data }) => data.order === modalInfo!.order)[0];
      const swapingObjectChoices = serverSnapshot.filter(({ data }) => top ? data.order < modalInfo!.order : data.order > modalInfo!.order);
      if (swapingObjectChoices.length <= 0) return;
      const swapingObject = swapingObjectChoices.reduce((prev, curr) => top ? (prev.data.order > curr.data.order ? prev : curr) : (prev.data.order < curr.data.order ? prev : curr));
      if (!swapingObject) return;
      const batch = writeBatch(db);
      operatingObject.data.order -= top ? 1 : -1;
      swapingObject.data.order += top ? 1 : -1;
      batch.update(doc(db, "slides", operatingObject.id), { ...operatingObject.data });
      batch.update(doc(db, "slides", swapingObject.id), { ...swapingObject.data });
      await batch.commit();
    }
  }
  return (
    <div className='flex flex-row justify-end text-main space-x-6'>
      <div className='group flex flex-row space-x-1 hover:text-main2 cursor-pointer items-center' onClick={() => { setModalOpen(true); setModalType(toolbarStatus === "edit" ? "edit" : "add"); }}>
        <HoverICON className='w-5 h-5' Icon={toolbarStatus === "edit" ? RiEdit2Line : RiAddCircleLine} IconHover={toolbarStatus === "edit" ? RiEdit2Fill : RiAddCircleFill} size={5} />
        <span className='transition-all duration-300'>{toolbarStatus === "edit" ? "編輯焦點" : "新增焦點"}</span>
      </div>
      {toolbarStatus === "edit" && <div className='group flex flex-row space-x-1 hover:text-main2 cursor-pointer items-center' onClick={() => { setModalOpen(true); setModalType("delete") }}>
        <HoverICON className='w-5 h-5' Icon={RiDeleteBin5Line} IconHover={RiDeleteBin5Fill} size={5} />
        <span className='transition-all duration-300'>刪除焦點</span>
      </div>}
      {toolbarStatus === "edit" && <div className='group flex flex-row space-x-1 hover:text-main2 cursor-pointer items-center' onClick={() => { onOrderChange(true) }}>
        <HoverICON className='w-5 h-5' Icon={RiArrowUpCircleLine} IconHover={RiArrowUpCircleFill} size={5} />
        <span className='transition-all duration-300'>上移</span>
      </div>}
      {toolbarStatus === "edit" && <div className='group flex flex-row space-x-1 hover:text-main2 cursor-pointer items-center' onClick={() => { onOrderChange(false) }}>
        <HoverICON className='w-5 h-5' Icon={RiArrowDownCircleLine} IconHover={RiArrowDownCircleFill} size={5} />
        <span className='transition-all duration-300'>下移</span>
      </div>}
    </div>
  )
}

// Main Modal
const Modal = ({ modalOpen, setModalOpen, modalType, modalInfo, nextOrder }: { modalOpen: boolean; setModalOpen: Dispatch<SetStateAction<boolean>>; modalType: ModalType; modalInfo: ModalInfo; nextOrder: number }) => (
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
                  {modalType === "add" && <h1 className='font-medium text-xl mb-2'>新增焦點</h1>}
                  {modalType === "edit" && <h1 className='font-medium text-xl mb-2'>編輯焦點</h1>}
                  {modalType === "delete" && <h1 className='font-medium text-xl mb-2'>確定要移除此焦點嗎？</h1>}
                  <div onClick={() => setModalOpen(false)}><HoverICON className="w-7 h-7 cursor-pointer" Icon={RiCloseLine} IconHover={RiCloseFill} size={7} /></div>
                </Dialog.Title>
                {modalInfo &&
                  <div className="flex flex-col w-full items-start md:flex-row md:space-x-6 text-main">
                    {modalType === "edit" && <ModalEditOrAdd modalInfo={modalInfo} setModal={setModalOpen} nextOrder={nextOrder} />}
                    {modalType === "delete" && <ModalDelete modalInfo={modalInfo} setModal={setModalOpen} />}
                  </div>
                }
                {modalType === "add" && <ModalEditOrAdd modalInfo={false} setModal={setModalOpen} nextOrder={nextOrder} />}
              </Dialog.Panel>
            </div>
          </div>
        </div>
      </Transition.Child>
    </Dialog>
  </Transition>
)

// Modal - Delete
const ModalDelete = ({ modalInfo, setModal }: { modalInfo: ModalInfo; setModal: Dispatch<SetStateAction<boolean>> }) => {
  const [value, setValue] = useState("");
  const [lodaing, setLodaing] = useState<boolean>(false);
  const onDeleteSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLodaing(true);
    await deleteDoc(doc(db, "slides", modalInfo!.id));
    setLodaing(false);
    setModal(false);
  }
  if (lodaing) return (<div className="w-full h-full flex justify-center items-center"><Loading text="刪除中" /></div>)
  else return (
    <form className="flex flex-col space-y-2 max-w-xs" onSubmit={onDeleteSubmit}>
      <p className="w-full px-4 py-2 text-center text-background2 bg-main/60">若你未讀完以下資訊，你將會後悔莫及！</p>
      <h2>經過這個動作你將無法再透過網站找回最初的起點，所有人都不會再看到這個成員了！請問你確定嗎？</h2>
      <h3>如果你確定要刪除本成員的話，請在下方輸入框輸入他的 ID：『{modalInfo?.id}』</h3>
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} pattern={modalInfo?.id || ""} placeholder={modalInfo?.id || ""} autoComplete="false" className="px-2 py-1 bg-transparent border-2 border-red-700 focus:border-red-900 rounded-lg focus:outline-none" />
      <button disabled={value !== (modalInfo?.id || "")} className="disabled:bg-red-600/40 bg-red-600/90 py-1 text-background2 rounded-md">刪除</button>
    </form>
  )
}

const ModalEditOrAdd = ({ modalInfo = false, setModal, nextOrder }: { modalInfo?: ModalInfo | false, setModal: Dispatch<SetStateAction<boolean>>; nextOrder: number }) => {
  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const [lodaing, setLodaing] = useState<boolean>(false);
  const onChangeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files) {
      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0])
      }
      reader.onload = async (renderEvent) => {
        if (renderEvent.target) {
          if (typeof (renderEvent.target.result) == "string") {
            setLodaing(true);
            data.image.setValue(renderEvent.target.result);
            const imageRef = ref(storage, `Slide/slide-${Math.ceil(new Date().getTime() / 1000)}.jpg`)
            await uploadString(imageRef, renderEvent.target.result as any, "data_url").then(async snapshot => {
              const downloadUrl = await getDownloadURL(imageRef);
              data.image.setValue(downloadUrl);
            })
            setLodaing(false);
          }
        }
      }
    }
  }
  const DataState = (defaultValue: any) => {
    const [value, setValue] = useState(defaultValue);
    const [error, setError] = useState<string>("");
    return {
      value: value,
      error: error,
      setValue: setValue,
      setError: setError,
    }
  }
  const data = {
    href: DataState(modalInfo ? modalInfo.href : ""),
    image: DataState(modalInfo ? modalInfo.image : "/assests/banner_help.jpg"),
    title: DataState(modalInfo ? modalInfo.title : ""),
    order: DataState(modalInfo ? modalInfo.order : nextOrder)
  };
  const formOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLodaing(true);
    if (modalInfo) {
      updateDoc(doc(db, "slides", modalInfo.id), removeEmpty({
        href: data.href.value === modalInfo.href ? null : data.href.value,
        image: data.image.value === modalInfo.image ? null : data.image.value,
        title: data.title.value === modalInfo.title ? null : data.title.value,
        order: data.order.value === modalInfo.order ? null : data.order.value,
      }) as any)
    } else {
      addDoc(collection(db, "slides"), {
        href: data.href.value,
        image: data.image.value,
        title: data.title.value,
        order: data.order.value,
      })
    }
    setLodaing(false);
    setModal(false);
  }
  if (lodaing) {
    return (
      <div className="w-full h-full flex justify-center items-center"><Loading text="上傳中" /></div>
    )
  } else {
    return (
      <form className="flex flex-col w-full gap-8 items-center min-w-[65vw]" onSubmit={formOnSubmit}>
        <div className={`relative w-full h-auto aspect-[21/9] xl:aspect-[21/7] border-2 border-main rounded-lg cursor-pointer overflow-hidden group`} onClick={() => filePickerRef.current!.click()}>
          <Image src={data.image.value} fill={true} className="object-cover" alt="圖片" sizes="(max-width: 1024px) 272px, (max-width: 768px) 188vw, 268vw" />
          <div className='absolute opacity-0 group-hover:opacity-100 bottom-0 w-full h-6 bg-gray-600 bg-opacity-75 text-white text-xs text-center py-1 transition-opacity'>更換</div>
          <input name="thumbnail" type="file" accept="image/*" hidden={true} ref={filePickerRef} onChange={onChangeAvatar}></input>
        </div>
        <InputField name="title" text="標題" value={data.title.value} setValue={data.title.setValue} onError={data.title.error} />
        <InputField name="href" text="連結" value={data.href.value} setValue={data.href.setValue} onError={data.href.error} />
        <button type="submit" className='px-3 py-2 bg-green-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0 disabled:bg-green-600/70'>{modalInfo ? "更改" : "新增"}</button>
      </form>
    )
  }
}

const InputField = ({ className = "", name, text, value, setValue, onError, required = true, pattern = undefined }: { className?: string; name: string; text: string; value: string; setValue: Dispatch<SetStateAction<string>>; onError: string; required?: boolean; pattern?: string | undefined; }) => {
  return (
    <div className={`${className} w-full flex flex-col justify-center text-main2`}>
      <h2 className='text-lg font-medium text-main'>{text}</h2>
      <input required={required} pattern={pattern} name={name} className="resize-none bg-transparent focus:outline-none border-b-2 border-main/50 focus:border-main" value={value} placeholder={`請輸入${text}`} onChange={(e) => { setValue(e.target.value); }} />
      {onError && <span className="text-xs text-red-600">{onError}</span>}
    </div>
  )
}

type ModalInfo = Slide & { id: string } | null;
type ModalType = "add" | "edit" | "delete";

const removeEmpty = (obj: any) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}