/* eslint-disable react-hooks/exhaustive-deps */
"use client";

const _ = require('lodash');
import { AdminManageWrapper } from "@/components/admin/admin";
import { BreadcrumbWrapper } from "@/components/breadcumb/breadcumb";
import { Loading } from "@/components/global/loading";
import i18nDefault from '@/translation/ebook/zh.json';
import { Account, EbookLicenses, EBooks } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { colors, webInfo } from "@/utils/config";
import { createEbookVoucher } from "@/utils/ebook-voucher";
import { db, storage } from "@/utils/firebase";
import i18n from "@/utils/i18n";
import { timestamp2Chinese } from "@/utils/timestamp";
import { Popover, Tab } from "@headlessui/react";
import { ArcElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip } from "chart.js";
import { addDoc, collection, deleteDoc, doc, DocumentData, DocumentReference, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { Line } from 'react-chartjs-2';
import { RiAddCircleFill, RiAddCircleLine, RiCheckDoubleFill, RiClipboardFill, RiClipboardLine, RiDeleteBin5Fill, RiDeleteBin5Line, RiEdit2Fill, RiEdit2Line, RiInformationFill, RiInformationLine, RiKey2Fill, RiKey2Line, RiLineChartFill, RiLineChartLine } from "react-icons/ri";

const EbookBookCover = ({ className = "", thumbnail, title, size }: { className?: string; thumbnail: string; title: string; size: "big" | "small"; }) => {
  return (<div className={`${className} book-container`}>
    <div className={`book relative w-auto ${size === "big" ? "h-[320px] before:h-[318px] after:h-[320px] book_animation" : "h-[220px] before:h-[218px] after:h-[220px] book-small-transform first:!shadow-none after:!shadow-none"} aspect-[14.8/21] after:w-auto after:aspect-[14.8/21] after:bg-main before:text-main`}>
      <Image priority={size === "big"} src={thumbnail} fill={true} className='object-contain z-20 shadow-main2' alt={title} />
    </div>
  </div>)
}

export default function AdminEbooks({ params }: { params: { locale: LangCode } }) {
  const t = new i18n<typeof i18nDefault>(params.locale, "ebook");
  const dataFetchedRef = useRef<boolean>(false);
  const [modalInfo, setModalInfo] = useState<ModalInfo>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [serverSnapshot, setServerSnapshot] = useState<{ id: string; data: EBooks }[]>();
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);
    onSnapshot(query(collection(db, 'books'), orderBy("timestamp", 'desc')), snapshot => {
      setServerSnapshot(snapshot.docs.map((doc) => {
        return { id: doc.id, data: doc.data() as EBooks };
      }));
    })
  })
  useEffect(() => {
    if (modalInfo && serverSnapshot) {
      const info = serverSnapshot.filter((doc) => doc.id === modalInfo.id)[0];
      if (info) {
        setModalInfo({
          id: info.id,
          data: info.data
        });
      } else {
        setModalInfo(null);
      }
    }
  }, [serverSnapshot])
  const onEbookClicked = (bId: string, book: EBooks) => {
    setModalInfo({
      id: bId,
      data: book
    });
  }
  return (
    <>
      <BreadcrumbWrapper args={[{ title: webInfo.webMap.admin.title(params.locale) as string, href: webInfo.webMap.admin.href, icon: webInfo.webMap.admin.nav.icon }, { title: webInfo.webMap.admin.child.ebooks.title(params.locale) as string, href: webInfo.webMap.admin.child.ebooks.href, icon: webInfo.webMap.admin.child.ebooks.nav.icon }]} />
      {serverSnapshot ?
        <AdminManageWrapper
          ready={!!serverSnapshot}
          toolbar={{
            actions: [{
              name: "add",
              text: "新增書籍",
              level: [0],
              icon: RiAddCircleLine,
              iconHover: RiAddCircleFill,
            }, {
              name: "edit",
              text: "編輯書籍",
              level: [1],
              icon: RiEdit2Line,
              iconHover: RiEdit2Fill,
            }, {
              name: "remove",
              text: "刪除書籍",
              level: [1],
              icon: RiDeleteBin5Line,
              iconHover: RiDeleteBin5Fill,
            }, {
              name: "voucher",
              text: "批量產生序號",
              level: [1],
              icon: RiKey2Line,
              iconHover: RiKey2Fill,
            }, {
              name: "analytics",
              text: "電子書下載分析",
              level: [1],
              icon: RiLineChartLine,
              iconHover: RiLineChartFill,
            }, {
              name: "info",
              text: "詳細資料",
              level: [1],
              icon: RiInformationLine,
              iconHover: RiInformationFill,
            }]
          }}
          modalInfos={{
            infos: [{
              name: "add",
              title: "新增書籍",
              modal: <ModalEditOrAdd modalInfo={false} setModal={setModalOpen} />
            }, {
              name: "edit",
              title: "編輯書籍",
              modal: <ModalEditOrAdd modalInfo={modalInfo} setModal={setModalOpen} />
            }, {
              name: "remove",
              title: `確定要刪除『${modalInfo?.data.title}』嗎？`,
              modal: <ModalDelete modalInfo={modalInfo} setModal={setModalOpen} />
            }, {
              name: "voucher",
              title: "批量產生序號",
              modal: <ModalVoucher modalInfo={modalInfo} setModal={setModalOpen} />
            }, {
              name: "analytics",
              title: "下載分析",
              modal: <ModalAnalytics modalInfo={modalInfo} setModal={setModalOpen} />
            }, {
              name: "info",
              title: "書籍資訊",
              modal: <ModalInfo modalInfo={modalInfo} />
            }],
            modalInfo: modalInfo,
            setModalInfo: setModalInfo,
            modalOpen: modalOpen,
            setModalOpen: setModalOpen
          }}
        >
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center my-4 h-full'>
            {serverSnapshot.map((book, key) => (
              <div className={`cursor-pointer relative flex flex-col items-center px-6 py-4 space-y-2 rounded-lg ${modalInfo?.id === book.id ? "bg-background/60" : "hover:bg-background/60"} transition-all duration-500 group`} key={key} onClick={() => onEbookClicked(book.id, book.data)}>
                <EbookBookCover thumbnail={book.data.thumbnail} title={book.data.title} size="small" key={key} />
                <p className={`${modalInfo?.id === book.id ? "text-main2 font-bold" : "text-main font-medium group-hover:text-main2 group-hover:font-bold"} transition-all duration-500`}>{book.data.title}</p>
                <p className={`text-xs !-mt-0.5 ${modalInfo?.id === book.id ? "text-main2" : "text-main group-hover:text-main2"} transition-all duration-500`}>{!book.data.published ? t._("unpublished") : (book.data.price ? `定價 NTD ${book.data.price}` : "免費開放下載")}</p>
              </div>
            ))}
          </div>
        </AdminManageWrapper>
        : <div className="min-h-[74vh] w-full flex justify-center items-center"><Loading text="載入中" /></div>
      }
    </>
  )
}

// Modal - Info
const ModalInfo = ({ modalInfo }: { modalInfo: ModalInfo }) => (
  <>
    <div className="relative w-auto h-[220px] aspect-[14.8/21] mb-2"><Image src={modalInfo!.data.thumbnail} fill={true} alt={modalInfo!.data.title || "書籍封面"} className="ring-2 ring-main" /></div>
    <div className="flex flex-col w-full space-y-2 md:space-y-3 prose-h2:text-main/80 prose-h2:after:ml-1 prose-h2:after:content-[':']">
      <div className="flex flex-col md:flex-row gap-2 md:gap-6">
        <InfoItems title="標題" content={modalInfo!.data.title} />
        <InfoItems title="檔案名稱" content={modalInfo!.data.name} />
      </div>
      <InfoItems title="簡述" content={modalInfo!.data.description} />
      <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-4">
        <InfoItems title="定價" content={modalInfo!.data.locked ? `NTD $${modalInfo!.data.price}` : "可供免費下載"} />
        <InfoItems title="狀態" content={modalInfo!.data.published ? "已發布" : "向未發布"} />
        <InfoItems title="建立時間" content={timestamp2Chinese(modalInfo!.data.timestamp)} />
      </div>
      {modalInfo!.data.files &&
        <div className="w-full">
          <h2 className="text-lg font-medium">連結</h2>
          <ul>
            <InfoItemsWithLink title={`蘋果 (${modalInfo!.data.files.epub.size}MB)`} link={modalInfo!.data.files.epub.link} />
            <InfoItemsWithLink title={`蘋果-壓縮 (${modalInfo!.data.files["epub-compressed"].size}MB)`} link={modalInfo!.data.files["epub-compressed"].link} />
            <InfoItemsWithLink title={`其他 (${modalInfo!.data.files.pdf.size}MB)`} link={modalInfo!.data.files.pdf.link} />
            <InfoItemsWithLink title={`其他-壓縮 (${modalInfo!.data.files["pdf-compressed"].size}MB)`} link={modalInfo!.data.files["pdf-compressed"].link} />
          </ul>
        </div>
      }
    </div>
  </>
)
const InfoItems = ({ title, content }: { title: string; content: string }) => (
  <div>
    <h2 className="text-lg font-medium">{title}</h2>
    <p>{content}</p>
  </div>
)
const InfoItemsWithLink = ({ title, link }: { title: string; link: string }) => (
  <li className="truncate space-x-2 max-w-lg">
    <span>{title}</span>
    <Link className="text-main2 outline-none" href={link}>{link}</Link>
  </li>
)

// Modal - Edit Or Add
const ModalEditOrAdd = ({ modalInfo = false, setModal }: { modalInfo?: ModalInfo | false, setModal: Dispatch<SetStateAction<boolean>> }) => {
  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const [lodaing, setLodaing] = useState<boolean>(false);
  const onChangeBookImage = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files) {
      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0])
      }
      reader.onload = async (renderEvent) => {
        if (renderEvent.target) {
          if (typeof (renderEvent.target.result) == "string") {
            setLodaing(true);
            const imageRef = ref(storage, `books/cover/${new Date().getTime()}.jpg`)
            await uploadString(imageRef, renderEvent.target.result as any, "data_url").then(async snapshot => {
              const downloadUrl = await getDownloadURL(imageRef)
              data.thumbnail.setValue(downloadUrl);
            })
            setLodaing(false);
          }
        }
      }
    }
  }
  const placeholder = {
    name: "範例： vol.1_spring",
    thumbnail: "/assests/ebook_cover_help.jpg",
    title: "範例：秋・無咎",
    price: "120",
    description: "請輸入簡述",
    "file-pdf": "範例：https://......",
    "file-pdf-compressed": "範例：https://......",
    "file-epub": "範例：https://......",
    "file-epub-compressed": "範例：https://......",
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
    name: DataState(modalInfo ? modalInfo.data.name : ""),
    thumbnail: DataState(modalInfo ? modalInfo.data.thumbnail : ""),
    title: DataState(modalInfo ? modalInfo.data.title : ""),
    price: DataState(modalInfo ? modalInfo.data.price : 100),
    description: DataState(modalInfo ? modalInfo.data.description : ""),
    published: DataState(modalInfo ? modalInfo.data.published : false),
    locked: DataState(modalInfo ? modalInfo.data.locked : true),
    "file-pdf": DataState(modalInfo && modalInfo.data.files ? modalInfo.data.files.pdf.link : ""),
    "file-pdf-compressed": DataState(modalInfo && modalInfo.data.files ? modalInfo.data.files["pdf-compressed"].link : ""),
    "file-epub": DataState(modalInfo && modalInfo.data.files ? modalInfo.data.files.epub.link : ""),
    "file-epub-compressed": DataState(modalInfo && modalInfo.data.files ? modalInfo.data.files["epub-compressed"].link : ""),
    "size-pdf": DataState(modalInfo && modalInfo.data.files ? modalInfo.data.files.pdf.size : 0),
    "size-pdf-compressed": DataState(modalInfo && modalInfo.data.files ? modalInfo.data.files["pdf-compressed"].size : 0),
    "size-epub": DataState(modalInfo && modalInfo.data.files ? modalInfo.data.files.epub.size : 0),
    "size-epub-compressed": DataState(modalInfo && modalInfo.data.files ? modalInfo.data.files["epub-compressed"].size : 0),
  }
  const formOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLodaing(true);
    if (modalInfo) {
      const file = {
        "epub": { link: data["file-epub"].value, size: parseInt(data["size-epub"].value) },
        "bookId": modalInfo.id,
        "pdf-compressed": { link: data["file-pdf-compressed"].value, size: parseInt(data["size-pdf-compressed"].value) },
        "epub-compressed": { link: data["file-epub-compressed"].value, size: parseInt(data["size-epub-compressed"].value) },
        "pdf": { link: data["file-pdf"].value, size: parseInt(data["size-pdf"].value) },
      }
      const uploadData = removeEmpty({
        thumbnail: modalInfo.data.thumbnail === data.thumbnail.value ? null : data.thumbnail.value,
        title: modalInfo.data.title === data.title.value ? null : data.title.value,
        name: modalInfo.data.name === data.name.value ? null : data.name.value,
        description: modalInfo.data.description === data.description.value ? null : data.description.value,
        files: _.isEqual(modalInfo.data.files, file) ? null : file,
        price: modalInfo.data.price === parseInt(data.price.value) ? null : parseInt(data.price.value),
        locked: modalInfo.data.locked === data.locked.value ? null : data.locked.value,
        published: modalInfo.data.published === data.published.value ? null : data.published.value,
      });
      if (!_.isEmpty(uploadData)) {
        await updateDoc(doc(db, "books", modalInfo.id), uploadData as any);
      }
    } else {
      const uploadData = {
        thumbnail: data.thumbnail.value,
        title: data.title.value,
        name: data.name.value,
        description: data.description.value,
        price: parseInt(data.price.value),
        locked: data.locked.value,
        published: data.published.value,
        timestamp: (new Date().getTime() / 1000),
      };
      const docRef = await addDoc(collection(db, "books"), uploadData as any);
      const file = {
        "epub": { link: data["file-epub"].value, size: parseInt(data["size-epub"].value) },
        "bookId": docRef.id,
        "pdf-compressed": { link: data["file-pdf-compressed"].value, size: parseInt(data["size-pdf-compressed"].value) },
        "epub-compressed": { link: data["file-epub-compressed"].value, size: parseInt(data["size-epub-compressed"].value) },
        "pdf": { link: data["file-pdf"].value, size: parseInt(data["size-pdf"].value) },
      }
      await updateDoc(doc(db, "books", docRef.id), { files: file });
    }
    setLodaing(false);
    setModal(false);
  }
  if (lodaing) {
    return (
      <div className="w-full h-full flex justify-center items-center"><Loading text="上傳中" /></div>
    )
  } else {
    return (<form className="flex flex-col md:flex-row gap-4" onSubmit={formOnSubmit}>
      <div>
        <div className="relative w-auto h-[220px] aspect-[14.8/21] mb-2 cursor-pointer group" onClick={() => filePickerRef.current!.click()}>
          <Image src={data.thumbnail.value || placeholder.thumbnail} fill={true} alt={modalInfo ? modalInfo.data.title : "書籍封面"} className="ring-2 ring-main" />
          <div className='absolute opacity-0 group-hover:opacity-100 bottom-0 w-full h-6 bg-gray-600 bg-opacity-75 text-white text-xs text-center py-1 transition-opacity'>更換</div>
          <input name="thumbnail" type="file" accept="image/*" hidden={true} ref={filePickerRef} onChange={onChangeBookImage}></input>
        </div>
        {!modalInfo && <div className="flex flex-row items-center text-sm space-x-2">
          <input type="checkbox" name="thumbnail_undecide" value="true" onChange={(e) => data.thumbnail.setValue(e.target.checked ? "/assests/ebook_cover_undecided.jpg" : "/assests/ebook_cover_help.jpg")} />
          <label>使用向未決定的封面</label>
        </div>}
      </div>
      <div className="flex flex-col w-full space-y-2 md:space-y-3 prose-h2:text-main/80 prose-h2:after:ml-1 prose-h2:after:content-[':']">
        <div className="flex flex-col md:flex-row gap-2 md:gap-6">
          <InputField name="title" text="標題" value={data.title.value} setValue={data.title.setValue} onError={data.title.error} />
          <InputField name="name" text="檔案名稱" value={data.name.value} setValue={data.name.setValue} onError={data.name.error} />
        </div>
        <TextAreaField name="description" text="簡述" value={data.description.value} setValue={data.description.setValue} onError={data.description.error} />
        <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-4">
          <InputField name="price" text="定價" value={data.price.value} setValue={data.price.setValue} onError={data.price.error} />
          <div className="flex flex-row items-center text-sm space-x-2 w-max">
            <input type="checkbox" name="public" value="true" checked={data.published.value} onChange={(e) => data.published.setValue(e.target.checked)} />
            <label className="w-max">發布狀態</label>
          </div>
          <div className="flex flex-row items-center text-sm space-x-2 w-max">
            <input type="checkbox" name="locked" value="true" checked={!data.locked.value} onChange={(e) => data.locked.setValue(!e.target.checked)} />
            <label className="w-max">免費狀態</label>
          </div>
        </div>
        <div className="w-full">
          <h2 className="text-lg font-medium">連結</h2>
          <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-4">
            <InputField name="file-epub" className="basis-5/6" text={`EPUB格式`} value={data["file-epub"].value} setValue={data["file-epub"].setValue} onError={data["file-epub"].error} />
            <InputField name="size-epub" className="basis-1/6" text={`檔案大小 (MB)`} value={data["size-epub"].value} setValue={data["size-epub"].setValue} onError={data["size-epub"].error} />
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-4">
            <InputField name="file-epub-compressed" text={`EPUB格式-壓縮`} value={data["file-epub-compressed"].value} setValue={data["file-epub-compressed"].setValue} onError={data["file-epub-compressed"].error} />
            <InputField name="size-epub-compressed" className="basis-1/6" text={`檔案大小 (MB)`} value={data["size-epub-compressed"].value} setValue={data["size-epub-compressed"].setValue} onError={data["size-epub-compressed"].error} />
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-4">
            <InputField name="file-pdf" text={`PDF格式`} value={data["file-pdf"].value} setValue={data["file-pdf"].setValue} onError={data["file-pdf"].error} />
            <InputField name="size-pdf" className="basis-1/6" text={`檔案大小 (MB)`} value={data["size-pdf"].value} setValue={data["size-pdf"].setValue} onError={data["file-epub"].error} />
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-4">
            <InputField name="file-pdf-compressed" text={`PDF格式-壓縮`} value={data["file-pdf-compressed"].value} setValue={data["file-pdf-compressed"].setValue} onError={data["file-pdf-compressed"].error} />
            <InputField name="size-pdf-compressed" className="basis-1/6" text={`檔案大小 (MB)`} value={data["size-pdf-compressed"].value} setValue={data["size-pdf-compressed"].setValue} onError={data["size-pdf-compressed"].error} />
          </div>
        </div>
        <button type="submit" className='px-3 py-2 bg-green-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0 disabled:bg-green-600/70'>{modalInfo ? "更改" : "新增"}</button>
      </div>
    </form>)
  }
}
const TextAreaField = ({ className = "", name, text, value, setValue, onError }: { className?: string; name: string; text: string; value: string; setValue: Dispatch<SetStateAction<string>>; onError: string; }) => {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [rowTextarea, setTextarea] = useState<number>(1);
  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const hiddenTextarea = document.querySelector("#hidden-textarea") as HTMLTextAreaElement;
    if (hiddenTextarea) {
      setTextarea(hiddenTextarea.scrollHeight / 24);
    }
  }
  const onRefChange = useCallback((node: HTMLTextAreaElement) => {
    if (node === null) return;
    const lookMount = setInterval(() => {
      if (node.scrollHeight !== 0) {
        clearInterval(lookMount);
        setTextarea(node.scrollHeight / 24);
      }
    }, 1)
  }, []);
  return (
    <div className={`${className} w-full flex flex-col justify-center text-main2`}>
      <h1 className='text-xl font-bold mb-4 text-main'>{text}</h1>
      <textarea required name={name} className="text-base resize-none w-[65vw] md:w-[45vw] bg-transparent focus:outline-none border-b-2 border-main/50 focus:border-main" rows={rowTextarea} ref={textRef} value={value} placeholder={`請輸入${text}`} onChange={handleTextArea} />
      <textarea id="hidden-textarea" className="text-base resize-none w-[65vw] md:w-[45vw] invisible absolute overflow-hidden" rows={1} ref={onRefChange} value={value} disabled></textarea>
      {onError && <span className="text-xs text-red-600">{onError}</span>}
    </div>
  )
}
const InputField = ({ className = "", name, text, value, setValue, onError }: { className?: string; name: string; text: string; value: string; setValue: Dispatch<SetStateAction<string>>; onError: string; }) => {
  return (
    <div className={`${className} w-full flex flex-col justify-center text-main2`}>
      <h2 className='text-lg font-medium text-main'>{text}</h2>
      <input required name={name} className="resize-none bg-transparent focus:outline-none border-b-2 border-main/50 focus:border-main" value={value} placeholder={`請輸入${text}`} onChange={(e) => { setValue(e.target.value); }} />
      {onError && <span className="text-xs text-red-600">{onError}</span>}
    </div>
  )
}
const removeEmpty = (obj: any) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

// Modal - Delete
const ModalDelete = ({ modalInfo, setModal }: { modalInfo: ModalInfo; setModal: Dispatch<SetStateAction<boolean>> }) => {
  const [value, setValue] = useState("");
  const [lodaing, setLodaing] = useState<boolean>(false);
  const onDeleteSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLodaing(true);
    await deleteDoc(doc(db, "books", modalInfo!.id));
    setLodaing(false);
    setModal(false);
  }
  if (lodaing) return (<div className="w-full h-full flex justify-center items-center"><Loading text="刪除中" /></div>)
  else return (
    <form className="flex flex-col space-y-2 max-w-xs" onSubmit={onDeleteSubmit}>
      <p className="w-full px-4 py-2 text-center text-background2 bg-main/60">若你未讀完以下資訊，你將會後悔莫及！</p>
      <h2>經過這個動作你將無法再透過網站找回最初的起點，所有人都不會再看到這個東西了！請問你確定嗎？</h2>
      <h3>如果你確定要刪除本書籍的話，請在下方輸入框輸入：『{modalInfo?.data.title}』</h3>
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} pattern={modalInfo?.data.title} placeholder={modalInfo?.data.title} autoComplete="false" className="px-2 py-1 bg-transparent border-2 border-red-700 focus:border-red-900 rounded-lg focus:outline-none" />
      <button disabled={value !== modalInfo?.data.title} className="disabled:bg-red-600/40 bg-red-600/90 py-1 text-background2 rounded-md">刪除</button>
    </form>
  )
}

// Modal - Generate Voucher
const ModalVoucher = ({ modalInfo, setModal }: { modalInfo: ModalInfo; setModal: Dispatch<SetStateAction<boolean>> }) => {
  const [value, setValue] = useState(5);
  const [lodaing, setLodaing] = useState<boolean>(false);
  const [vouchers, setVouchers] = useState<string[]>([]);
  const [clipboard, setClipboard] = useState<boolean>(false);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLodaing(true);
    const vouchers = await createEbookVoucher(modalInfo!.id, value);
    setVouchers(vouchers);
    setLodaing(false);
  }
  if (lodaing) return (<div className="w-full h-full flex justify-center items-center"><Loading text="序號產生中" /></div>)
  else if (vouchers.length !== 0) return (<div className="flex flex-row items-center justify-center space-x-4">
    <div className="flex flex-col space-y-1">
      {vouchers.map((vouchers, key) => (
        <p key={key}>{vouchers}</p>
      ))}
    </div>
    <div className="relative text-main group cursor-pointer w-5 h-5" onClick={() => { navigator.clipboard.writeText(vouchers.toString()); setClipboard(true); setTimeout(() => setClipboard(false), 1500) }}>
      <RiClipboardFill className={`${!clipboard ? "visible" : "hidden"} absolute opacity-0 group-hover:opacity-100 w-5 h-5 transition-all duration-300`} />
      <RiClipboardLine className={`${!clipboard ? "visible" : "hidden"} absolute opacity-100 group-hover:opacity-0 w-5 h-5 transition-all duration-300`} />
      <RiCheckDoubleFill className={`${!clipboard ? "invisible" : "visible"} absolute w-5 h-5 animate-mailFly`} />
    </div>
  </div>)
  else return (
    <form className="flex flex-col space-y-2 max-w-xs" onSubmit={onSubmit}>
      <h3>請問你要產生幾組序號？</h3>
      <input type="number" value={value} onChange={(e) => setValue(parseInt(e.target.value))} autoComplete="false" className="px-2 py-1 bg-transparent text-center border-2 border-green-700 focus:border-green-900 rounded-lg focus:outline-none" />
      <button className="bg-green-600 py-1 rounded-md text-background2">產生</button>
    </form>
  )
}

const ModalAnalytics = ({ modalInfo, setModal }: { modalInfo: ModalInfo; setModal: Dispatch<SetStateAction<boolean>> }) => {
  const dataFetchedRef = useRef<boolean>(false);
  const [data, setData] = useState<EbookLicenses[]>();
  const [account, setAccount] = useState<Account | null>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getDocs(query(collection(db, "books", modalInfo!.id, "license"))).then((data) => {
      setData(data.docs.map(d => d.data()) as EbookLicenses[])
    });
  })
  const onGetAccountClick = async (memberRef: DocumentReference<DocumentData>) => {
    const doc = await getDoc(memberRef);
    if (doc.exists()) {
      setAccount(doc.data() as Account);
    } else {
      setAccount(null);
    }
  }
  if (!data) return (<div className="w-full h-full flex justify-center items-center"><Loading className="justify-center items-center" text="正在載入資料中" /></div>)
  else return (
    <div className="border-main/80 border rounded-xl overflow-hidden bg-background w-[60vw] min-h-[70vh]">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List as="div" className="flex flex-row w-full border-b border-main/80 select-none outline-none cursor-pointer">
          <Tab as="div" className="px-6 py-2 border-r border-main/80 hover:bg-background2/60 hover:border-b-2 ui-selected:bg-background2/60 ui-selected:border-b-2 transition-all duration-300">
            <h2 className="text-sm">下載人數</h2>
            <span className="text-xl font-bold">{data.filter(d => d.used === true).length} 人</span>
          </Tab>
          <Tab as="div" className="px-6 py-2 border-r border-main/80 hover:bg-background2/60 hover:border-b-2 ui-selected:bg-background2/60 ui-selected:border-b-2 transition-all duration-300">
            <h2 className="text-sm">序號分析</h2>
            <span className="text-xl font-bold">{data.filter(d => d.voucher).length} 組</span>
          </Tab>
        </Tab.List>
        <Tab.Panels className="px-6 py-4 select-none outline-none h-[70vh] overflow-y-scroll">
          <Tab.Panel className="">
            <Line
              datasetIdKey='download_count'
              data={{
                datasets: [{
                  label: "下載人數",
                  pointHitRadius: 25,
                  borderWidth: 3,
                  borderColor: colors.main + "CD",
                  backgroundColor: colors.main,
                  hoverBackgroundColor: colors.main2,
                  borderCapStyle: "round",
                  data: data.filter(d => d.used === true).sort((a: any, b: any) => a.usedTimestamp - b.usedTimestamp).reduce((tmp: any, license: any) => {
                    const time = new Date(license.usedTimestamp.seconds * 1000).toISOString().slice(0, 10);
                    const index = tmp.findIndex((t: any) => t.x === time);
                    index >= 0 ? tmp[index] = { x: time, y: tmp[index].y + 1 } : tmp.push({ x: time, y: 1 })
                    return tmp;
                  }, [{ x: new Date(modalInfo!.data.timestamp * 1000).toISOString().slice(0, 10), y: 0 }]),
                }, {
                  label: "免費下載",
                  pointHitRadius: 25,
                  borderWidth: 3,
                  borderColor: colors.main2 + "CD",
                  backgroundColor: colors.main2,
                  hoverBackgroundColor: colors.main,
                  borderCapStyle: "round",
                  data: data.filter(d => d.used === true).filter(d => d.voucher === false).sort((a: any, b: any) => a.usedTimestamp - b.usedTimestamp).reduce((tmp: any, license: any) => {
                    const time = new Date(license.usedTimestamp.seconds * 1000).toISOString().slice(0, 10);
                    const index = tmp.findIndex((t: any) => t.x === time);
                    index >= 0 ? tmp[index] = { x: time, y: tmp[index].y + 1 } : tmp.push({ x: time, y: 1 })
                    return tmp;
                  }, [{ x: new Date(modalInfo!.data.timestamp * 1000).toISOString().slice(0, 10), y: 0 }]),
                }, {
                  label: "序號兌換",
                  pointHitRadius: 25,
                  borderWidth: 3,
                  borderColor: colors.background2 + "CD",
                  backgroundColor: colors.background2,
                  hoverBackgroundColor: colors.background,
                  borderCapStyle: "round",
                  data: data.filter(d => d.used === true).filter(d => d.voucher === true).sort((a: any, b: any) => a.usedTimestamp - b.usedTimestamp).reduce((tmp: any, license: any) => {
                    const time = new Date(license.usedTimestamp.seconds * 1000).toISOString().slice(0, 10);
                    const index = tmp.findIndex((t: any) => t.x === time);
                    index >= 0 ? tmp[index] = { x: time, y: tmp[index].y + 1 } : tmp.push({ x: time, y: 1 })
                    return tmp;
                  }, [{ x: new Date(modalInfo!.data.timestamp * 1000).toISOString().slice(0, 10), y: 0 }]),
                }]
              }}
            />
            <div className="mt-4 text-main space-y-2">
              <h2 className="text-xl font-bold">下載資訊</h2>
              <table className="border-collapse border border-main/80 table-auto w-full font-normal">
                <thead>
                  <tr>
                    <th className="border-collapse border border-main/80">種類</th>
                    <th className="border-collapse border border-main/80">授權帳號ID</th>
                    <th className="border-collapse border border-main/80">授權時間</th>
                  </tr>
                </thead>
                <tbody>
                  {data.filter(d => d.used).sort((a: any, b: any) => b.usedTimestamp - a.usedTimestamp).map((d, index) => {
                    if (!d.used) return (<></>);
                    return (
                      <tr key={index}>
                        <th className="border-collapse border border-main/80">{d.voucher ? "序號" : "免費"}</th>
                        <th className="border-collapse border border-main/80">
                          <Popover className="relative">
                            <Popover.Button as="div" className="relative cursor-pointer group" onClick={() => onGetAccountClick(d.customer)}>
                              <span>{d.customer.id}</span>
                              <div className="absolute w-max px-2 py-1 text-xs z-40 bg-background2 rounded-md hidden opacity-0 group-hover:block group-hover:opacity-90 transition-opacity top-0 right-0">
                                <span>點擊以獲取詳細用戶資訊</span>
                              </div>
                            </Popover.Button>
                            <Popover.Panel as="div" className="absolute left-1/2 -translate-x-1/2 z-50 px-4 py-3 border-2 rounded-lg border-main bg-background2 shadow-xl flex flex-col items-center justify-center select-auto">
                              <div className="relative text-main h-24 w-24">
                                <Image placeholder='blur' blurDataURL="/assests/defaultProfile.png" src={account?.avatar || "/assests/defaultProfile.png"} fill={true} className="rounded-full overflow-hidden object-cover bg-background2" alt={`${account?.name}的大頭貼`} sizes="(max-width: 1024px) 272px, (max-width: 768px) 188vw, 268vw" />
                              </div>
                              <p>{account?.name}</p>
                              <div className='flex flex-col mt-3 items-baseline font-serif'>
                                <p className='text-main2 text-sm'>電子郵件</p>
                                <p className='text-main whitespace-pre-line'>{account?.email || "無法取得電子郵件"}</p>
                              </div>
                            </Popover.Panel>
                          </Popover>
                        </th>
                        <th className="border-collapse border border-main/80">{timestamp2Chinese((d.usedTimestamp as any).seconds)}</th>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <Line
              datasetIdKey='voucher_count'
              data={{
                datasets: [{
                  label: "已兌換",
                  pointHitRadius: 25,
                  borderWidth: 3,
                  borderColor: colors.main2 + "CD",
                  backgroundColor: colors.main2,
                  hoverBackgroundColor: colors.main,
                  borderCapStyle: "round",
                  data: data.filter(d => d.used === true).filter(d => d.voucher === true).sort((a: any, b: any) => a.createdTimestamp.seconds - b.createdTimestamp.seconds).reduce((tmp: any, license: any) => {
                    const time = new Date(license.createdTimestamp.seconds * 1000).toISOString().slice(0, 10);
                    const index = tmp.findIndex((t: any) => t.x === time);
                    index >= 0 ? tmp[index] = { x: time, y: tmp[index].y + 1 } : tmp.push({ x: time, y: 1 })
                    return tmp;
                  }, [{ x: new Date(modalInfo!.data.timestamp * 1000).toISOString().slice(0, 10), y: 0 }]),
                }, {
                  label: "未兌換",
                  pointHitRadius: 25,
                  borderWidth: 3,
                  borderColor: colors.background2 + "CD",
                  backgroundColor: colors.background2,
                  hoverBackgroundColor: colors.background,
                  borderCapStyle: "round",
                  data: data.filter(d => d.used === false).filter(d => d.voucher === true).sort((a: any, b: any) => a.createdTimestamp - b.createdTimestamp).reduce((tmp: any, license: any) => {
                    const time = new Date(license.createdTimestamp.seconds * 1000).toISOString().slice(0, 10);
                    const index = tmp.findIndex((t: any) => t.x === time);
                    index >= 0 ? tmp[index] = { x: time, y: tmp[index].y + 1 } : tmp.push({ x: time, y: 1 })
                    return tmp;
                  }, [{ x: new Date(modalInfo!.data.timestamp * 1000).toISOString().slice(0, 10), y: 0 }]),
                }, {
                  label: "所有序號",
                  pointHitRadius: 25,
                  borderWidth: 3,
                  borderColor: colors.main + "CD",
                  backgroundColor: colors.main,
                  hoverBackgroundColor: colors.main2,
                  borderCapStyle: "round",
                  data: data.filter(d => d.voucher === true).sort((a, b) => (a.createdTimestamp as any).seconds - (b.createdTimestamp as any).seconds).reduce((tmp: any, license: any) => {
                    const time = new Date(license.createdTimestamp.seconds * 1000).toISOString().slice(0, 10);
                    const index = tmp.findIndex((t: any) => t.x === time);
                    index >= 0 ? tmp[index] = { x: time, y: tmp[index].y + 1 } : tmp.push({ x: time, y: 1 })
                    return tmp;
                  }, [{ x: new Date(modalInfo!.data.timestamp * 1000).toISOString().slice(0, 10), y: 0 }]),
                }]
              }}
            />
            <div className="mt-4 text-main space-y-2">
              <h2 className="text-xl font-bold">序號資訊</h2>
              <table className="border-collapse border border-main/80 table-auto w-full font-normal">
                <thead>
                  <tr>
                    <th className="border-collapse border border-main/80">狀態</th>
                    <th className="border-collapse border border-main/80">序號</th>
                    <th className="border-collapse border border-main/80">授權帳號ID</th>
                    <th className="border-collapse border border-main/80">授權時間</th>
                  </tr>
                </thead>
                <tbody>
                  {data.filter(d => d.voucher).sort((a: any, b: any) => b.createdTimestamp - a.createdTimestamp).map((d, index) => {
                    if (!d.voucher) return (<></>);
                    return (
                      <tr key={index}>
                        <th className="border-collapse border border-main/80">{d.used ? "v" : "o"}</th>
                        <th className="border-collapse border border-main/80">{d.code}</th>
                        <th className="border-collapse border border-main/80">
                          {d.used ? <Popover className="relative">
                            <Popover.Button as="div" className="relative cursor-pointer group" onClick={() => onGetAccountClick(d.customer)}>
                              <span>{d.customer.id}</span>
                              <div className="absolute w-max px-2 py-1 text-xs z-40 bg-background2 rounded-md hidden opacity-0 group-hover:block group-hover:opacity-90 transition-opacity top-0 right-0">
                                <span>點擊以獲取詳細用戶資訊</span>
                              </div>
                            </Popover.Button>
                            <Popover.Panel as="div" className="absolute left-1/2 -translate-x-1/2 z-50 px-4 py-3 border-2 rounded-lg border-main bg-background2 shadow-xl flex flex-col items-center justify-center select-auto">
                              <div className="relative text-main h-24 w-24">
                                <Image placeholder='blur' blurDataURL="/assests/defaultProfile.png" src={account?.avatar || "/assests/defaultProfile.png"} fill={true} className="rounded-full overflow-hidden object-cover bg-background2" alt={`${account?.name}的大頭貼`} sizes="(max-width: 1024px) 272px, (max-width: 768px) 188vw, 268vw" />
                              </div>
                              <p>{account?.name}</p>
                              <div className='flex flex-col mt-3 items-baseline font-serif'>
                                <p className='text-main2 text-sm'>電子郵件</p>
                                <p className='text-main whitespace-pre-line'>{account?.email || "無法取得電子郵件"}</p>
                              </div>
                            </Popover.Panel>
                          </Popover> : "未使用"
                          }
                        </th>
                        <th className="border-collapse border border-main/80">{timestamp2Chinese((d.createdTimestamp as any).seconds)}</th>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

    </div>
  )
}

type ModalInfo = {
  id: string;
  data: EBooks
} | null;