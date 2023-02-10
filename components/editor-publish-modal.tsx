/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Combobox, Dialog, Menu, Transition } from "@headlessui/react"
import { ChangeEvent, Dispatch, Fragment, MutableRefObject, SetStateAction, useCallback, useEffect, useState } from "react"
import { RiAddCircleFill, RiAddCircleLine, RiArrowDownSFill } from "react-icons/ri"
import { SetterOrUpdater } from "recoil"
import { _t, langCode } from "../language/lang"
import { AccountsUni, PostDocument } from "../types/firestore"
import { PostType } from "../types/posts"
import { FieldValue, addDoc, collection, getDocs, serverTimestamp, setDoc } from "firebase/firestore"
import { db } from "../utils/firebase"
import { timestampBefrore } from "./chat"

export const ModalEditorPublish = ({ lang, modalOpen, setModalOpen, data, setData, user, titleRef, onPublishedClick }: { lang: langCode; modalOpen: boolean; setModalOpen: SetterOrUpdater<boolean>; data: PostDocument; setData: SetterOrUpdater<PostDocument | undefined>; user: AccountsUni; titleRef: MutableRefObject<HTMLInputElement>; onPublishedClick: () => void }) => {
  const [rowTextarea, setTextarea] = useState<number>(1);
  const [currentPostType, setCurrentPostType] = useState(data.type || 0);
  const [addingTag, setAddingTag] = useState(false);
  const [tags, setTags] = useState<ComboboxTagsObject[]>([{ title: "請輸入想要新增的標籤", type: 0 }]);
  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const hiddenTextarea = document.querySelector("#hidden-textarea") as HTMLTextAreaElement;
    if (hiddenTextarea) {
      hiddenTextarea.value = e.target.value;
      setTextarea(hiddenTextarea.scrollHeight / 24);
    }
    setData(data => {
      if (data) data.description = e.target.value;
      return data;
    })
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
  const onAddTagClicked = async () => {
    if (addingTag) return setAddingTag(!addingTag);
    const firestoreQuery = await getDocs(collection(db, "tags"));
    setTags(firestoreQuery.docs.map(tag => {
      return { type: 1, ...tag.data() as any };
    }));
    return setAddingTag(!addingTag);
  }
  useEffect(() => {
    setData(data => {
      if (data) data.type = currentPostType;
      return data;
    })
    return () => { }
  }, [currentPostType])
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
                      <input className="bg-transparent focus:outline-none text-2xl" defaultValue={titleRef.current ? titleRef.current.value : "未命名"} onChange={e => { titleRef.current.value = e.target.value; setData(data => { if (data) data.title = e.target.value; return data }) }} />
                    </div>
                    <div className="flex flex-col border-main border-b-2">
                      <p className="text-xs text-main/80">預覽簡述：</p>
                      <textarea maxLength={140} defaultValue={data.description} id="textarea" className="text-base resize-none w-60 bg-transparent focus:outline-none" rows={rowTextarea} placeholder="請輸入簡述" onChange={handleTextArea} />
                      <textarea maxLength={140} defaultValue={data.description} id="hidden-textarea" className="text-base resize-none w-60 invisible absolute overflow-hidden" rows={1} ref={onRefChange} disabled></textarea>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-col w-full">
                    <p className="text-xs text-main/80">文章類型：</p>
                    <DropdownPostType currentPostType={currentPostType} setCurrentPostType={setCurrentPostType} />
                  </div>
                  {currentPostType !== 0 && Object.values(PostType[currentPostType].requiredInformation).map((title, key) => (
                    <div className="flex flex-col border-main border-b-2" key={key}>
                      <p className="text-xs text-main/80">{title}</p>
                      <input className="bg-transparent focus:outline-none" onChange={e => {
                        setData(data => {
                          if (data) {
                            if (!data.requiredAnswer) {
                              data.requiredAnswer = {};
                            }
                            (data.requiredAnswer as any)[Object.keys(PostType[currentPostType].requiredInformation)[key]] = e.target.value;
                          }
                          return data;
                        })
                      }} />
                    </div>
                  ))}
                  <div className={`flex flex-col mt-4 ${!addingTag && "pb-1"} border-b-2 border-main`}>
                    <p className="text-xs text-main/80">標籤：</p>
                    <div className="flex flex-row items-center text-main text-base space-x-2">
                      {data.tag.map((tag, key) => (
                        <span key={key}>#{tag}</span>
                      ))}
                      <div className="relative inline-block h-6 w-6 text-center group">
                        <RiAddCircleLine className={`absolute w-6 h-6 ${addingTag ? "opacity-0" : "opacity-100"} group-hover:opacity-0 transition-all duration-300`} />
                        <RiAddCircleFill className={`absolute w-6 h-6 ${addingTag ? "opacity-100" : "opacity-0"} group-hover:opacity-100 transition-all duration-300`} onClick={onAddTagClicked} />
                      </div>
                    </div>
                    {addingTag && <div className="block">
                      <ComboboxTag tags={tags} setBox={setAddingTag} setData={setData} />
                    </div>}
                  </div>
                  <div className='flex flex-col-reverse md:flex-row w-full justify-around'>
                    <button className='px-3 py-2 bg-red-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0' onClick={() => setModalOpen(false)}>關閉</button>
                    <button className='px-3 py-2 bg-green-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0 disabled:bg-green-600/70' onClick={onPublishedClick}>發布</button>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog >
    </Transition >
  )
}

function DropdownPostType({ currentPostType, setCurrentPostType }: { currentPostType: number; setCurrentPostType: Dispatch<SetStateAction<number>>; }) {
  return (
    <Menu as="div" className="w-full">
      <Menu.Button as="button" className="flex flex-row justify-center items-center space-x-2 border-main border-b-2 w-full">
        <span>{currentPostType !== 0 ? PostType[currentPostType].title : "請選擇類型"}</span>
        <RiArrowDownSFill />
      </Menu.Button>
      <Menu.Items as="div" className="flex flex-col items-center bg-background2 mt-2 rounded-lg w-full space-y-2">
        {Object.values(PostType).map((type, key) => (
          <Menu.Item
            as="span"
            key={key}
            className="hover:text-main2 cursor-pointer"
            onClick={() => setCurrentPostType(key + 1)}
          >
            {type.title}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  )
}

function ComboboxTag({ tags, setBox, setData }: { tags: ComboboxTagsObject[]; setBox: Dispatch<SetStateAction<boolean>>; setData: SetterOrUpdater<PostDocument | undefined>; }) {
  const [selectedTag, setSelectedTag] = useState('');
  const [queryState, setQuery] = useState('');
  const filteredTag: () => ComboboxTagsObject[] = () => {
    if (!queryState) return [{ title: "請輸入想要新增的標籤", type: 0 }];
    return [...tags.filter((tag) => {
      return tag.title.includes(queryState);
    }), { title: `+ 新增標籤 “${queryState}”`, type: 2 }]
  }
  const onTagSelected = async (e: string) => {
    let selected = e;
    if (e.startsWith("+")) {
      selected = e.slice(8, e.length - 1);
      setSelectedTag(`正在新增標籤 “${selected}”`);
      await addDoc(collection(db, "tags"), {
        title: selected,
        createdTimestamp: serverTimestamp(),
        lastAddedTimestamp: serverTimestamp(),
      })
    }
    setBox(false);
    return setData(data => { if (data) data.tag.push(selected); return data });
  }
  return (
    <Combobox value={selectedTag} onChange={onTagSelected}>
      <div className="relative group">
        <RiAddCircleFill className="absolute h-3 w-3 mt-[6.5px] group-focus:text-main2" />
        <Combobox.Input placeholder="請輸入想要新增的標籤" className="w-full bg-transparent focus:outline-none pl-4 group" onChange={(event) => setQuery(event.target.value)} />
      </div>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Combobox.Options className="mt-2 rounded bg-background2 px-4 py-2 space-y-1">
          {filteredTag().map((tag, key) => (
            <Combobox.Option as="div" key={key} value={tag.title} disabled={tag.type === 0} className={`${tag.type === 2 ? "text-green-800 text-sm ui-active:text-green-700" : "text-main ui-active:text-main2 ui-disabled:opacity-70"} select-none ui-not-disabled:cursor-pointer`}>
              {tag.type === 1 ? <div className="flex flex-row items-baseline justify-between">
                <span>{`# ${tag.title}`}</span>
                <div className="text-xs opacity-60">
                  <span>{tag.lastAddedTimestamp === tag.createdTimestamp ? "新增時間" : "上次修改"} </span>
                  <span>{timestampBefrore((tag.lastAddedTimestamp as any).seconds * 1000)}</span>
                </div>
              </div> : tag.title}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Transition>
    </Combobox>
  )
}

type ComboboxTagsObject = {
  title: string;
  type: 0;
} | {
  title: string;
  type: 1;
  createdTimestamp: FieldValue;
  lastAddedTimestamp: FieldValue;
} | {
  title: string;
  type: 2;
} 