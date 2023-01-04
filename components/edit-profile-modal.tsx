import { Dialog, Transition } from '@headlessui/react';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import Image from 'next/image';
import { ChangeEvent, Fragment, MouseEvent, useRef, useState } from "react";
import { SetterOrUpdater, useRecoilState, useRecoilValue } from "recoil";
import { profileModal, profileModalConfirm, profileModalSelection, profileModalUser } from "../atoms/account-modal";
import { langCode, _t } from '../language/lang';
import { Account, Member } from "../types/firestore";
import { db, storage } from '../utils/firebase';

export function Modal({ setOperate, lang }: { setOperate: SetterOrUpdater<boolean>, lang: langCode }) {
    const [modalOpen, setModalOpen] = useRecoilState(profileModal);
    const [modalConfirm, setModalConfirm] = useRecoilState(profileModalConfirm)
    const option = useRecoilValue(profileModalSelection);
    const profile = useRecoilValue(profileModalUser);
    const filePickerRef = useRef<HTMLInputElement | null>(null);
    const [profileAvatar, setProfileAvatar] = useState(profile.data.avatar);
    const changeListener = (sec: keyof Account) => {
        switch (sec) {
            case "bio":
                if ((document.getElementsByName(sec)[0] as HTMLInputElement).value.length <= 64) {
                    document.getElementById(`${sec}Err`)!.innerText = ""
                    setModalConfirm(false)
                } else {
                    document.getElementById(`${sec}Err`)!.innerText = "自我介紹太多字了！！ （最高 64 字元）"
                    setModalConfirm(true)
                }
                break;
            case "class":
                if ((document.getElementsByName(sec)[0] as HTMLInputElement).value.match(/^[J][1 | 2 | 3][1 | 2 | 3 | 4 | 5 | 6 | 7]$/) || (document.getElementsByName(sec)[0] as HTMLInputElement).value.match(/^[S][1 | 2 | 3][1 | 2 | 3 | 4 | 5 ]$/) || (document.getElementsByName(sec)[0] as HTMLInputElement).value == "Teacher") {
                    document.getElementById(`${sec}Err`)!.innerText = ""
                    setModalConfirm(false)
                } else {
                    document.getElementById(`${sec}Err`)!.innerText = "班級格式錯誤"
                    setModalConfirm(true)
                }
                break;
            case "customTitle":
                if ((document.getElementsByName(sec)[0] as HTMLInputElement).value.length <= 18) {
                    document.getElementById(`${sec}Err`)!.innerText = ""
                    setModalConfirm(false)
                } else {
                    document.getElementById(`${sec}Err`)!.innerText = "自我介紹太多字了！！ （最高 18 字元）"
                    setModalConfirm(true)
                }
                break;
            case "insta":
                if ((document.getElementsByName(sec)[0] as HTMLInputElement).value.match(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/)) {
                    console.log((document.getElementsByName(sec)[0] as HTMLInputElement).value.match(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/))
                    document.getElementById(`${sec}Err`)!.innerText = ""
                    setModalConfirm(false)
                } else {
                    document.getElementById(`${sec}Err`)!.innerText = "請輸入 Instagram 帳號"
                    setModalConfirm(true)
                }
                break;
            case "name":
                if ((document.getElementsByName(sec)[0] as HTMLInputElement).value.length <= 5) {
                    document.getElementById(`${sec}Err`)!.innerText = ""
                    setModalConfirm(false)
                } else {
                    document.getElementById(`${sec}Err`)!.innerText = "姓名最多只能有 5 個字"
                    setModalConfirm(true)
                }
                break;
            case "username":
                if ((document.getElementsByName(sec)[0] as HTMLInputElement).value.length <= 10) {
                    document.getElementById(`${sec}Err`)!.innerText = ""
                    setModalConfirm(false)
                } else {
                    document.getElementById(`${sec}Err`)!.innerText = "姓名最多只能有 10 個字"
                    setModalConfirm(true)
                }
                break;
        }
    }
    const clickListener = async (e: MouseEvent<HTMLButtonElement>) => {
        const profileData = profile.type == "Account" ? profile.data as Account : profile.data as Member;
        for (const input of document.querySelectorAll("input") as any) {
            if (input.type == "file") {
                const imageRef = ref(storage, `${profile.type}s/Avatar/${profileData.uid}-${new Date().getTime()}.jpg`)
                setOperate(true)
                await uploadString(imageRef, profileAvatar as any, "data_url").then(async snapshot => {
                    const downloadUrl = await getDownloadURL(imageRef)
                    await updateDoc(doc(db, `${profile.type}s/${profileData.uid}`,), {
                        avatar: downloadUrl
                    })
                    setModalOpen(false)
                    location.reload()
                })
                setOperate(false)
            }
            if (input.id == "bio" || input.id == "name" || input.id == "username" || input.id == "insta" || input.id == "customTitle" || input.id == "class") {
                const data: any = {}
                data[input.id] = input.value
                setOperate(true)
                await updateDoc(doc(db, `${profile.type}s/${profileData.uid}`), data)
                setModalOpen(false)
                setOperate(false)
                if (location.pathname != "/admin/members") location.reload()
            }
        }
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
                        <Image width={256} height={256} src={profileAvatar || profile.data.avatar} className="w-[256px] h-[256px] object-cover" alt={_t(lang).imageAlt} />
                        <div className='absolute opacity-0 group-hover:opacity-100 bottom-0 w-full h-6 bg-gray-600 bg-opacity-75 text-white text-xs text-center py-1 transition-opacity'>更換</div>
                        <input type={"file"} hidden ref={filePickerRef} onChange={changeAvatar}></input>
                    </div>
                )
            case "bio":
                return (<div key={key} className="relative w-[256px] ">
                    <input type="text" id="bio" name="bio" onChange={(e) => changeListener("bio")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-main/50 text-xs text-gray-800 bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-main peer" placeholder=" " defaultValue={profile.data.bio ? profile.data.bio : ""} />
                    <label className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">{_t(lang).profile.bio}</label>
                    <p id="bioErr" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
                </div>)
            case "name":
                return (<div key={key} className="relative w-[256px] ">
                    <input type="text" id="name" name="name" onChange={(e) => changeListener("name")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-main/50 text-xs text-gray-800 bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-main peer" placeholder=" " defaultValue={profile.data.name} />
                    <label htmlFor="name" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">{_t(lang).profile.name}</label>
                    <p id="nameErr" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
                </div>)
            case "username":
                return profile.type == "Account" ? (<div key={key} className="relative w-[256px] ">
                    <input type="text" id="username" name="username" onChange={(e) => changeListener("username")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-main/50 text-xs text-gray-800 bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-main peer" placeholder=" " defaultValue={profile.data.username ? profile.data.username : ""} />
                    <label htmlFor="name" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">{_t(lang).profile.username}</label>
                    <p id="usernameErr" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
                </div>) : (<></>)
            case "insta":
                return (<div key={key} className="relative w-[256px] ">
                    <input type="text" id="insta" name="insta" onChange={(e) => changeListener("insta")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-main/50 text-xs text-gray-800 bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-main peer" placeholder=" " defaultValue={profile.data.insta ? profile.data.insta : ""} />
                    <label htmlFor="name" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">{_t(lang).profile.insta}</label>
                    <p id="instaErr" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
                </div>)
            case "customTitle":
                return (<div key={key} className="relative w-[256px] ">
                    <input type="text" id="customTitle" name="customTitle" onChange={(e) => changeListener("customTitle")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-main/50 text-xs text-gray-800 bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-main peer" placeholder=" " defaultValue={profile.data.customTitle ? profile.data.customTitle : ""} />
                    <label htmlFor="name" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">{_t(lang).profile.customTitleChange}</label>
                    <p id="customTitleErr" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
                </div>)
            case "class":
                return (<div key={key} className="relative w-[256px] ">
                    <input type="text" id="class" name="class" onChange={(e) => changeListener("class")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-main/50 text-xs text-gray-800 bg-transparent appearance-none focus:outline-none focus:ring-0 focus:border-main peer" placeholder=" " defaultValue={profile.data.class || ""} />
                    <label htmlFor="name" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">{_t(lang).profile.classChange}</label>
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
                            <div className="inline-block align-bottom text-center bg-background2 rounded-md px-4 pt-5 pb-4 overflow-hidden shadow-sm transform transition-all sm:align-middle sm:max-w-sm sm:w-full">
                                <div className='space-y-4'>
                                    {option.map((selected, key) => (
                                        ModalContent(selected, key)
                                    ))}
                                    <div className='flex flex-col-reverse md:flex-row w-full justify-around'>
                                        <button className='px-3 py-2 bg-red-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0' onClick={() => setModalOpen(false)}>{_t(lang).form.cancel}</button>
                                        <button disabled={modalConfirm} className='px-3 py-2 bg-green-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0 disabled:bg-green-600/70' onClick={(e) => clickListener(e)}>{_t(lang).form.send}</button>
                                    </div>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    )
}