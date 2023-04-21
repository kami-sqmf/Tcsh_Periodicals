"use client";

const _ = require('lodash');
import i18nDefault from '@/translation/accounts/zh.json';
import i18nProfileDefault from '@/translation/profile/zh.json';
import { Account } from '@/types/firestore';
import { LangCode } from '@/types/i18n';
import { db, storage } from '@/utils/firebase';
import i18n from '@/utils/i18n';
import { Dialog, Transition } from '@headlessui/react';
import { doc, writeBatch } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, Dispatch, Fragment, MouseEvent, SetStateAction, useRef, useState } from "react";
import { Loading } from '../global/loading';

export function ProfileEditModal({ option, profile, setProfile, modalOpen, setModalOpen, lang }: { option: (keyof Account)[]; profile: Account; setProfile: Dispatch<SetStateAction<Account>>; modalOpen: boolean; setModalOpen: Dispatch<SetStateAction<boolean>>; lang: LangCode }) {
  const t = new i18n<typeof i18nDefault>(lang, "accounts");
  const tp = new i18n<typeof i18nProfileDefault>(lang, "profile");
  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const [operating, setOperating] = useState<boolean>(false);
  const [modalConfirm, setModalConfirm] = useState<boolean>(false);
  const [profileAvatar, setProfileAvatar] = useState(profile.avatar);
  const router = useRouter();
  const changeListener = (sec: keyof Account) => {
    const value = (document.getElementsByName(sec)[0] as HTMLInputElement).value;
    switch (sec) {
      case "bio":
        if (value.length <= 64) {
          document.getElementById(`${sec}Err`)!.innerText = "";
          setModalConfirm(false);
        } else {
          document.getElementById(`${sec}Err`)!.innerText = t._("edit_bio_up64") as string;
          setModalConfirm(true);
        }
        break;
      case "class":
        if (value.match(/^[J][1 | 2 | 3][1 | 2 | 3 | 4 | 5 | 6 | 7]$/) || value.match(/^[S][1 | 2 | 3][1 | 2 | 3 | 4 | 5 ]$/) || value == "Teacher") {
          document.getElementById(`${sec}Err`)!.innerText = "";
          setModalConfirm(false);
        } else {
          document.getElementById(`${sec}Err`)!.innerText = t._("edit_class_format_error") as string;
          setModalConfirm(true);
        }
        break;
      case "customTitle":
        if (value.length <= 18) {
          document.getElementById(`${sec}Err`)!.innerText = "";
          setModalConfirm(false);
        } else {
          document.getElementById(`${sec}Err`)!.innerText = t._("edit_customTitle_up18") as string;
          setModalConfirm(true);
        }
        break;
      case "insta":
        if (value.match(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/)) {
          document.getElementById(`${sec}Err`)!.innerText = "";
          setModalConfirm(false);
        } else {
          document.getElementById(`${sec}Err`)!.innerText = t._("edit_insta_format_error") as string;
          setModalConfirm(true);
        }
        break;
      case "name":
        if (value.match(/[\u3400-\u9FBF]/) && value.length > 5) {
          document.getElementById(`${sec}Err`)!.innerText = t._("edit_name_zh_up5") as string;
          setModalConfirm(true);
        }
        else if (value.length > 30) {
          document.getElementById(`${sec}Err`)!.innerText = t._("edit_name_up30") as string;
          setModalConfirm(true);
        }
        else if (value.length === 0) {
          document.getElementById(`${sec}Err`)!.innerText = t._("edit_name_empty") as string;
          setModalConfirm(true);
        }
        else {
          document.getElementById(`${sec}Err`)!.innerText = "";
          setModalConfirm(false);
        }
        break;
      case "username":
        if (value.match(/[\u3400-\u9FBF]/) && value.length > 5) {
          document.getElementById(`${sec}Err`)!.innerText = t._("edit_name_zh_up5") as string;
          setModalConfirm(true);
        }
        else if (value.length > 30) {
          document.getElementById(`${sec}Err`)!.innerText = t._("edit_name_up30") as string;
          setModalConfirm(true);
        }
        else if (value.length === 0) {
          document.getElementById(`${sec}Err`)!.innerText = t._("edit_name_empty") as string;
          setModalConfirm(true);
        }
        else {
          document.getElementById(`${sec}Err`)!.innerText = "";
          setModalConfirm(false);
        }
        break;
    }
  }
  const clickListener = async (e: MouseEvent<HTMLButtonElement>) => {
    const batch = writeBatch(db);
    for (const input of document.querySelectorAll("input") as any) {
      const accountType = profile.memberRef ? "Members" : "Accounts";
      if (input.type == "file") {
        const imageRef = ref(storage, `${accountType}/Avatar/${profile.uid}-${new Date().getTime()}.jpg`);
        setOperating(true);
        setProfile({ ...profile, avatar: profileAvatar });
        await uploadString(imageRef, profileAvatar as any, "data_url").then(async snapshot => {
          const batch = writeBatch(db);
          const downloadUrl = await getDownloadURL(imageRef);
          if (accountType === "Members") batch.update(doc(db, profile.memberRef as any), {
            avatar: downloadUrl
          });
          batch.update(doc(db, `accounts/${profile.uid}`,), {
            avatar: downloadUrl
          });
          await batch.commit();
          setOperating(false);
          setModalOpen(false);
          router.refresh();
        })
      }
      if (input.id == "bio" || input.id == "name" || input.id == "username" || input.id == "insta" || input.id == "customTitle" || input.id == "class") {
        const data: any = {};
        data[input.id] = input.value;
        setProfile({ ...profile, ...data });
        if (accountType === "Members") batch.update(doc(db, profile.memberRef as any), data);
        setOperating(true);
        batch.update(doc(db, `accounts/${profile.uid}`), data);
      }
    }
    await batch.commit();
    setModalOpen(false);
    setOperating(false);
    router.refresh();
  }
  const changeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files) {
      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0])
      }
      reader.onload = (renderEvent) => {
        if (renderEvent.target) {
          if (typeof (renderEvent.target.result) == "string") {
            setProfileAvatar(renderEvent.target.result)
            setModalConfirm(false)
          }
        }
      }
    }
  }
  const ModalContent = (type: keyof Account, key: number) => {
    switch (type) {
      case "avatar":
        return (
          <div key={key} className="relative rounded-lg overflow-hidden group cursor-pointer" onClick={() => filePickerRef.current!.click()}>
            <Image width={256} height={256} src={profileAvatar || profile.avatar} className="w-[256px] h-[256px] object-cover" alt={"Avatar"} />
            <div className='absolute opacity-0 group-hover:opacity-100 bottom-0 w-full h-6 bg-gray-600 bg-opacity-75 text-white text-xs text-center py-1 transition-opacity'>更換</div>
            <input type={"file"} hidden ref={filePickerRef} onChange={changeAvatar}></input>
          </div>
        )
      case "bio":
        return (<div key={key} className="relative w-[256px] ">
          <input type="text" id="bio" name="bio" onChange={(e) => changeListener("bio")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-main/50 text-xs text-gray-800 bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-main peer" placeholder=" " defaultValue={profile.bio ? profile.bio : ""} />
          <label className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">{tp._("bio")}</label>
          <p id="bioErr" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
        </div>)
      case "name":
        return (<div key={key} className="relative w-[256px] ">
          <input type="text" id="name" name="name" onChange={(e) => changeListener("name")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-main/50 text-xs text-gray-800 bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-main peer" placeholder=" " defaultValue={profile.name} />
          <label htmlFor="name" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">{tp._("name")}</label>
          <p id="nameErr" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
        </div>)
      case "username":
        return (<div key={key} className="relative w-[256px] ">
          <input type="text" id="username" name="username" onChange={(e) => changeListener("username")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-main/50 text-xs text-gray-800 bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-main peer" placeholder=" " defaultValue={profile.username ? profile.username : ""} />
          <label htmlFor="name" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">{tp._("username")}</label>
          <p id="usernameErr" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
        </div>)
      case "insta":
        return (<div key={key} className="relative w-[256px] ">
          <input type="text" id="insta" name="insta" onChange={(e) => changeListener("insta")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-main/50 text-xs text-gray-800 bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-main peer" placeholder=" " defaultValue={profile.insta ? profile.insta : ""} />
          <label htmlFor="name" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">{tp._("insta")}</label>
          <p id="instaErr" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
        </div>)
      case "customTitle":
        return (<div key={key} className="relative w-[256px] ">
          <input type="text" id="customTitle" name="customTitle" onChange={(e) => changeListener("customTitle")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-main/50 text-xs text-gray-800 bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-main peer" placeholder=" " defaultValue={profile.customTitle ? profile.customTitle : ""} />
          <label htmlFor="name" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">{tp._("customTitleChange")}</label>
          <p id="customTitleErr" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
        </div>)
      case "class":
        return (<div key={key} className="relative w-[256px] ">
          <input type="text" id="class" name="class" onChange={(e) => changeListener("class")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-main/50 text-xs text-gray-800 bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-main peer" placeholder=" " defaultValue={profile.class || ""} />
          <label htmlFor="name" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">{tp._("classChange")}</label>
          <p id="classErr" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
        </div>)
      default:
        return (<></>)
    }
  }
  return (
    <Transition show={modalOpen} as={Fragment}>
      <Dialog onClose={() => setModalOpen(false)} as="div" className="fixed z-10 inset-0 overflow-y-auto" >
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
          <div className="fixed inset-0 flex items-center justify-center p-4 min-h-screen">
            <Dialog.Panel className="mx-auto max-w-2xl rounded">
              {operating && <div className="h-32 w-full flex justify-center items-center bg-background2 px-6 rounded-lg"><Loading className='justify-center items-center' text="更新中" /></div>}
              {!operating && <div className="inline-block align-bottom text-center bg-background2 rounded-md px-4 pt-5 pb-4 overflow-hidden shadow-sm transform transition-all sm:align-middle sm:max-w-sm sm:w-full">
                <div className='space-y-4'>
                  {option.map((selected, key) => (
                    ModalContent(selected, key)
                  ))}
                  <div className='flex flex-col-reverse md:flex-row w-full justify-around'>
                    <button className='px-3 py-2 bg-red-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0' onClick={() => setModalOpen(false)}>取消</button>
                    <button disabled={modalConfirm} className='px-3 py-2 bg-green-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0 disabled:bg-green-600/70' onClick={(e) => clickListener(e)}>送出</button>
                  </div>
                </div>
              </div>}
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}