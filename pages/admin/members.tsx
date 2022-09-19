import { Dialog, Transition } from '@headlessui/react';
import { addDoc, collection, doc, DocumentData, onSnapshot, orderBy, query, QueryDocumentSnapshot, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, Fragment, MouseEvent, useEffect, useRef, useState } from 'react';
import { RiAdminLine, RiArrowRightSLine } from 'react-icons/ri';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import { accountIndexModalConfirm, accountIndexModalSection, accountIndexModalState, adminSelectProfile, operatingPage } from '../../atoms/AccountModal';
import AccountProfile from '../../components/AccountProfile';
import { Global } from '../../components/global';
import HeadUni from '../../components/HeadUni';
import Navbar from '../../components/Navbar';
import { Accounts, canChangeProfile, instanceOfMembers, Members } from '../../types/firestore';
import role from '../../types/role';
import { db, storage } from '../../utils/firebase';

function Modal({ isOpen, setIsOpen, setOperate }: { isOpen: boolean, setIsOpen: SetterOrUpdater<boolean>, setOperate: SetterOrUpdater<boolean> }) {
  const [adminSelect, setAdminSelect] = useRecoilState(adminSelectProfile)
  const [modalSection, setModalSection] = useRecoilState(accountIndexModalSection)
  const [modalConfirm, setModalConfirm] = useRecoilState(accountIndexModalConfirm)
  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const [profileAvatar, setProfileAvatar] = useState(adminSelect.avatar)
  const changeListener = (sec: canChangeProfile) => {
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
    for (const input of document.querySelectorAll("input") as any) {
      if (input.name.includes("Add")) { }
      else if (input.type == "file") {
        setOperate(true)
        const imageRef = ref(storage, `${instanceOfMembers(adminSelect) ? "Members" : "Accounts"}/Avatar/${adminSelect.uid}.jpg`)
        await uploadString(imageRef, profileAvatar as any, "data_url").then(async snapshot => {
          const downloadUrl = await getDownloadURL(imageRef)
          await updateDoc(doc(db, `${instanceOfMembers(adminSelect) ? "Members" : "Accounts"}/${adminSelect.uid}`,), {
            avatar: downloadUrl
          })
          setOperate(false)
          setIsOpen(false)
        })
      }
      else if (input.id == "bio" || input.id == "name" || input.id == "username" || input.id == "insta" || input.id == "customTitle" || input.id == "class") {

        const data: any = {}
        data[input.id] = input.value
        setOperate(true)
        await updateDoc(doc(db, `${instanceOfMembers(adminSelect) ? "Members" : "Accounts"}/${adminSelect.uid}`), data)
        setOperate(false)
        setIsOpen(false)
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
  const modalContent = {
    "avatar": (profile: Accounts | Members) => {
      return (
        <div key={profile.uid} className="relative w-[256px] h-[256px] rounded-lg overflow-hidden group cursor-pointer" onClick={() => filePickerRef.current!.click()}>
          <Image width={256} height={256} src={profileAvatar} objectFit="contain" alt="你的大大大頭貼！" />
          <div className='absolute opacity-0 group-hover:opacity-100 bottom-0 w-full h-6 bg-gray-600 bg-opacity-75 text-white text-xs text-center py-1 transition-opacity'>更換</div>
          <input type={"file"} hidden ref={filePickerRef} onChange={changeAvatar}></input>
        </div>
      )
    },
    "bio": (profile: Accounts | Members) => {
      return (<div key={profile.uid} className="relative w-[256px] ">
        <input type="text" id="bio" name="bio" onChange={(e) => changeListener("bio")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-gray-200 text-xs text-gray-800 bg-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " defaultValue={profile.bio ? profile.bio : ""} />
        <label className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">自我介紹</label>
        <p id="bioErr" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
      </div>)
    },
    "name": (profile: Accounts | Members) => {
      return (<div key={profile.uid} className="relative w-[256px] ">
        <input type="text" id="name" name="name" onChange={(e) => changeListener("name")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-gray-200 text-xs text-gray-800 bg-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " defaultValue={profile.name} />
        <label htmlFor="name" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">名稱</label>
        <p id="nameErr" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
      </div>)
    },
    "username": (profile: Accounts | Members) => {
      return !instanceOfMembers(profile) ? (<div key={profile.uid} className="relative w-[256px] ">
        <input type="text" id="username" name="username" onChange={(e) => changeListener("username")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-gray-200 text-xs text-gray-800 bg-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " defaultValue={profile.username ? profile.username : ""} />
        <label htmlFor="name" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">用戶名稱</label>
        <p id="usernameErr" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
      </div>) : (<></>)
    },
    "insta": (profile: Accounts | Members) => {

      return (<div key={profile.uid} className="relative w-[256px] ">
        <input type="text" id="insta" name="insta" onChange={(e) => changeListener("insta")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-gray-200 text-xs text-gray-800 bg-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " defaultValue={profile.insta ? profile.insta : ""} />
        <label htmlFor="name" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">Instagram 帳號</label>
        <p id="instaErr" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
      </div>)
    },
    "customTitle": (profile: Accounts | Members) => {
      return (<div key={profile.uid} className="relative w-[256px] ">
        <input type="text" id="customTitle" name="customTitle" onChange={(e) => changeListener("customTitle")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-gray-200 text-xs text-gray-800 bg-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " defaultValue={profile.customTitle ? profile.customTitle : "自我介紹："} />
        <label htmlFor="name" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">更改自我介紹標題</label>
        <p id="customTitleErr" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
      </div>)
    },
    "class": (profile: Accounts | Members) => {

      return (<div key={profile.uid} className="relative w-[256px] ">
        <input type="text" id="class" name="class" onChange={(e) => changeListener("class")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-gray-200 text-xs text-gray-800 bg-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " defaultValue={profile.class} />
        <label htmlFor="name" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">班級 （請輸入班級代號，如 J11、S11）</label>
        <p id="classErr" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
      </div>)
    },
  }
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={() => setIsOpen(false)} as="div" className="fixed z-10 inset-0 overflow-y-auto" >
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
                  {modalSection.map((sec) => {
                    return modalContent[sec](adminSelect)
                  })}
                  <div className='flex flex-col-reverse md:flex-row w-full justify-around'>
                    <button className='px-3 py-2 bg-red-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0' onClick={() => setIsOpen(false)}>取消</button>
                    <button disabled={modalConfirm} className='px-3 py-2 bg-green-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0 disabled:bg-green-600/70' onClick={(e) => clickListener(e)}>送出</button>
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

const AddProfile = ({ setOperate }: { setOperate: SetterOrUpdater<boolean> }) => {
  const [modalConfirm, setModalConfirm] = useState(0 as number)
  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const [profileAvatar, setProfileAvatar] = useState("/defaultProfile.png")
  const changeListener = (sec: canChangeProfile) => {
    switch (sec) {
      case "bio":
        if ((document.getElementsByName(`${sec}Add`)[0] as HTMLInputElement).value.length <= 64) {
          document.getElementById(`${sec}ErrAdd`)!.innerText = ""
          return true
        } else {
          document.getElementById(`${sec}ErrAdd`)!.innerText = "自我介紹太多字了！！ （最高 64 字元）"
          return false
        }
        break;
      case "class":
        if ((document.getElementsByName(`${sec}Add`)[0] as HTMLInputElement).value.match(/^[J][1 | 2 | 3][1 | 2 | 3 | 4 | 5 | 6 | 7]$/) || (document.getElementsByName(`${sec}Add`)[0] as HTMLInputElement).value.match(/^[S][1 | 2 | 3][1 | 2 | 3 | 4 | 5 ]$/) || (document.getElementsByName(`${sec}Add`)[0] as HTMLInputElement).value == "Teacher") {
          document.getElementById(`${sec}ErrAdd`)!.innerText = ""
          return true
        } else {
          document.getElementById(`${sec}ErrAdd`)!.innerText = "班級格式錯誤"
          return false
        }
        break;
      case "customTitle":
        if ((document.getElementsByName(`${sec}Add`)[0] as HTMLInputElement).value.length <= 18) {
          document.getElementById(`${sec}ErrAdd`)!.innerText = ""
          return true
        } else {
          document.getElementById(`${sec}ErrAdd`)!.innerText = "自我介紹太多字了！！ （最高 18 字元）"
          return false
        }
        break;
      case "insta":
        if ((document.getElementsByName(`${sec}Add`)[0] as HTMLInputElement).value.match(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/)) {
          document.getElementById(`${sec}ErrAdd`)!.innerText = ""
          return true
        } else {
          document.getElementById(`${sec}ErrAdd`)!.innerText = "請輸入 Instagram 帳號"
          return false
        }
        break;
      case "name":
        if ((document.getElementsByName(`${sec}Add`)[0] as HTMLInputElement).value.length <= 5) {
          document.getElementById(`${sec}ErrAdd`)!.innerText = ""
          return true
        } else {
          document.getElementById(`${sec}ErrAdd`)!.innerText = "姓名最多只能有 5 個字"
          return false
        }
        break;
    }
  }
  // const clickListener = async (e: MouseEvent<HTMLButtonElement>) => {
  //   for (const input of document.querySelectorAll("input") as any) {
  //     if (input.type == "file") {
  //       const imageRef = ref(storage, `${instanceOfMembers(adminSelect) ? "Members" : "Accounts"}/Avatar/${adminSelect.uid}.jpg`)
  //       await uploadString(imageRef, profileAvatar as any, "data_url").then(async snapshot => {
  //         const downloadUrl = await getDownloadURL(imageRef)
  //         await updateDoc(doc(db, `${instanceOfMembers(adminSelect) ? "Members" : "Accounts"}/${adminSelect.uid}`,), {
  //           avatar: downloadUrl
  //         })
  //         setIsOpen(false)
  //       })
  //     }
  //     if (input.id == "bio" || input.id == "name" || input.id == "username" || input.id == "insta" || input.id == "customTitle" || input.id == "class") {
  //       const data: any = {}
  //       data[input.id] = input.value
  //       await updateDoc(doc(db, `${instanceOfMembers(adminSelect) ? "Members" : "Accounts"}/${adminSelect.uid}`), data)
  //       setIsOpen(false)
  //     }
  //   }
  // }
  const cancelAdd = () => {
    (document.getElementsByName(`nameAdd`)[0] as HTMLInputElement).value = "";
    (document.getElementsByName(`bioAdd`)[0] as HTMLInputElement).value = "";
    (document.getElementsByName(`customTitleAdd`)[0] as HTMLInputElement).value = "";
    (document.getElementsByName(`instaAdd`)[0] as HTMLInputElement).value = "";
    (document.getElementsByName(`classAdd`)[0] as HTMLInputElement).value = "";
    (document.getElementsByName(`emailAdd`)[0] as HTMLInputElement).value = "";
    setProfileAvatar("/defaultProfile.png")
  }
  const sendAdd = async () => {
    if (changeListener("name") && changeListener("bio") && changeListener("customTitle") && changeListener("insta") && changeListener("class")) {
      setOperate(true)
      const data = {
        name: (document.getElementsByName(`nameAdd`)[0] as HTMLInputElement).value,
        customTitle: (document.getElementsByName(`customTitleAdd`)[0] as HTMLInputElement).value,
        bio: (document.getElementsByName(`bioAdd`)[0] as HTMLInputElement).value,
        insta: (document.getElementsByName(`instaAdd`)[0] as HTMLInputElement).value,
        class: (document.getElementsByName(`classAdd`)[0] as HTMLInputElement).value,
        email: (document.getElementsByName(`emailAdd`)[0] as HTMLInputElement).value,
        role: (document.getElementsByName("role")[0] as HTMLSelectElement).value,
        avatar: profileAvatar
      }
      const docu = await addDoc(collection(db, `Members`), data);
      setOperate(false)
      const imageRef = ref(storage, `${"Members"}/Avatar/${docu.id}.jpg`)
      await uploadString(imageRef, profileAvatar as any, "data_url").then(async snapshot => {
        const downloadUrl = await getDownloadURL(imageRef)
        await updateDoc(doc(db, `Members/${docu.id}`,), {
          avatar: downloadUrl
        })
        cancelAdd()
      })
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
          }
        }
      }
    }
  }
  return (<div className='w-72 rounded-2xl flex flex-col min-w-72 min-h-[32em] bg-white-light shadow-xl overflow-hidden bg-background2/90'>
    <div className='relative aspect-square w-72 h-72'>
      <div className="relative aspect-square w-72 h-72 overflow-hidden group cursor-pointer" onClick={() => filePickerRef.current!.click()}>
        <Image alt={`大頭照！！`} src={profileAvatar} layout="fill" objectFit='cover' />
        <div className='absolute opacity-0 group-hover:opacity-100 bottom-0 w-full h-6 bg-gray-600 bg-opacity-75 text-white text-xs text-center py-1 transition-opacity'>更換</div>
        <input name='imageAdd' type={"file"} hidden ref={filePickerRef} onChange={changeAvatar}></input>
      </div>
    </div>
    <div className='flex flex-col px-5 py-6 space-y-4'>
      <div className='flex flex-row items-baseline font-["GenJyuuGothic"]'>
        <p className='basis-5/12 text-2xl font-bold text-main'>{"新增成員"}</p>
      </div>
      <div className='flex flex-col mt-3 space-y-2'>
        <div className='flex flex-col'>
          <p className='text-main2 text-sm'>輸入姓名：</p>
          <input name="nameAdd" className='text-main rounded-sm my-1 bg-gray-100 focus:bg-gray-50' onChange={(e) => changeListener("name")} />
          <p id="nameErrAdd" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
        </div>
        <div className='flex flex-col'>
          <p className='text-main2 text-sm'>選取組別：</p>
          <select name="role" id="role" className='text-main text-sm py-1 my-1'>
            {Object.values(role).map((role) => (
              role.id == 0 ? <></> : <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>
        <div className='flex flex-col'>
          <p className='text-main2 text-sm'>輸入班級：</p>
          <input name="classAdd" className='text-main rounded-sm my-1 bg-gray-100 focus:bg-gray-50' onChange={(e) => changeListener("class")} />
          <p id="classErrAdd" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
        </div>
        <div className='flex flex-col'>
          <p className='text-main2 text-sm'>自我介紹標題：</p>
          <input name="customTitleAdd" className='text-main rounded-sm my-1 bg-gray-100 focus:bg-gray-50' onChange={(e) => changeListener("customTitle")} />
          <p id="customTitleErrAdd" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
        </div>
        <div className='flex flex-col'>
          <p className='text-main2 text-sm'>輸入自我介紹：</p>
          <input name="bioAdd" className='text-main rounded-sm my-1 bg-gray-100 focus:bg-gray-50' onChange={(e) => changeListener("bio")} />
          <p id="bioErrAdd" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
        </div>
        <div className='flex flex-col'>
          <p className='text-main2 text-sm'>輸入 Instagram：</p>
          <input name="instaAdd" className='text-main rounded-sm my-1 bg-gray-100 focus:bg-gray-50' onChange={(e) => changeListener("insta")} />
          <p id="instaErrAdd" className='mx-3 mt-0.5 text-xs text-main2 text-start'></p>
        </div>
        <div className='flex flex-col'>
          <p className='text-main2 text-sm'>輸入 Email：</p>
          <input name="emailAdd" className='text-main rounded-sm my-1 bg-gray-100 focus:bg-gray-50' />
        </div>
      </div>
      <div className='flex flex-col-reverse md:flex-row w-full justify-around'>
        <button className='px-3 py-2 bg-red-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0' onClick={() => cancelAdd()}>取消</button>
        <button className='px-3 py-2 bg-green-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0 disabled:bg-green-600/70' onClick={(e) => sendAdd()}>送出</button>
      </div>
    </div>
  </div>)
}

const Home: NextPage = () => {
  const session = useSession();
  const [onTop, setOnTop] = useState(true)
  const [isOpen, setIsOpen] = useRecoilState(accountIndexModalState)
  const [operating, setOperating] = useRecoilState(operatingPage)
  const handleScroll = () => {
    if (onTop != window.scrollY > 38) setOnTop(true)
    if (onTop != window.scrollY < 38) setOnTop(false)
  }
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [])
  const [membersList, setMembersList] = useState([] as QueryDocumentSnapshot<DocumentData>[])
  useEffect(() => {
    return onSnapshot(query(collection(db, 'Members'), orderBy("role", 'asc')), snapshot => {
      setMembersList(snapshot.docs)
    })
  }, [db])
  return (
    <div className='min-h-screen bg-background/90 py-4'>
      <HeadUni title={Global.webMap.admin.child.members.title} description='你是怎麼知道這個網頁的，不過我猜你開不起來。但你也不要駭我，因為會很痛！' pages={Global.webMap.admin.child.members.href} />
      <div className='max-w-xs md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto'>
        <Navbar onTop={onTop} />
        <div className='mt-4 flex flex-row items-center text-main space-x-2'>
          <RiArrowRightSLine className='h-4 w-4 md:h-5 md:w-5' />
          <RiAdminLine className='h-5 w-5 md:h-6 md:w-6' />
          <Link href="/admin"><span className='text-base md:text-lg font-medium cursor-pointer hover:text-main2'>管理員</span></Link>
          <RiArrowRightSLine className='h-4 w-4 md:h-5 md:w-5' />
          <span className='text-base md:text-lg font-medium'>管理成員</span>
        </div>
        <div id="stuList" className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6 max-w-full gap-y-12 justify-items-center'>
          {!membersList[0] ? <div className='flex flex-row items-center justify-center text-2xl animate-pulse'>頁面正在載入中</div> : <></>}
          {membersList.map((memberProfile => (
            <div className='w-72' key={memberProfile.id}>
              <AccountProfile profile={{ ...memberProfile.data() as Members, uid: memberProfile.id }} rounded={true} owned={true} />
            </div>
          )))}
          <AddProfile setOperate={setOperating} />
        </div>
      </div>
      {isOpen ? <Modal isOpen={isOpen} setIsOpen={setIsOpen} setOperate={setOperating} /> : <></>}
      {operating ? <div className='fixed z-[80] top-0 left-0 w-screen h-screen bg-gray-200/40 duration-400 animate-opacity cursor-wait'></div> : <></>}
    </div>
  );
};

export default Home;