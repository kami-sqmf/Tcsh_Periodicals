import { Dialog, Transition } from '@headlessui/react';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { ChangeEvent, Fragment, MouseEvent, useEffect, useRef, useState } from 'react';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import { accountIndexModalConfirm, accountIndexModalSection, accountIndexModalState, operatingPage } from '../../atoms/AccountModal';
import AccountProfile from '../../components/AccountProfile';
import { Global } from '../../components/global';
import HeadUni from '../../components/HeadUni';
import Navbar from '../../components/Navbar';
import Recomended from '../../components/Recomended';
import { Accounts, canChangeProfile, instanceOfMembers, Members } from '../../types/firestore';
import { db, storage } from '../../utils/firebase';
import { useScroll } from '../../utils/useScroll';

const Page = ({ session, data }: { session: Session, data: any }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 h-max items-end">
      <div className='inline-grid md:col-span-3'>{<Recomended className='pt-8 pr-4' posts={data.Posts.posts} />}</div>
      <div className='inline-grid mt-2 md:mt-0 md:ml-2 border-2 border-main justify-center overflow-hidden'>
        <AccountProfile profile={session.firestore} rounded={false} owned={true} />
      </div>
    </div>
  )
}

function Modal({ session, setOperate }: { session: Session, setOperate: SetterOrUpdater<boolean> }) {
  const [isOpen, setIsOpen] = useRecoilState(accountIndexModalState)
  const [modalSection, setModalSection] = useRecoilState(accountIndexModalSection)
  const [modalConfirm, setModalConfirm] = useRecoilState(accountIndexModalConfirm)
  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const [profileAvatar, setProfileAvatar] = useState(session.firestore.avatar)
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
  const clickListener = async(e: MouseEvent<HTMLButtonElement>) => {
    for (const input of document.querySelectorAll("input") as any) {
      if(input.type == "file"){
        const imageRef = ref(storage, `${instanceOfMembers(session.firestore) ? "Members" : "Accounts"}/Avatar/${session.firestore.uid}.jpg`)
        setOperate(true)
        await uploadString(imageRef, profileAvatar as any, "data_url").then(async snapshot => {
            const downloadUrl = await getDownloadURL(imageRef)
            await updateDoc(doc(db, `${instanceOfMembers(session.firestore) ? "Members" : "Accounts"}/${session.firestore.uid}`,), {
                avatar: downloadUrl
            })
            setIsOpen(false)
            location.reload()
        })
        setOperate(false)
      }
      if (input.id == "bio" || input.id == "name" || input.id == "username" || input.id == "insta" || input.id == "customTitle" || input.id == "class") {
        const data: any = {}
        data[input.id] = input.value
        setOperate(true)
        await updateDoc(doc(db, `${instanceOfMembers(session.firestore) ? "Members" : "Accounts"}/${session.firestore.uid}`), data)
        setIsOpen(false)
        setOperate(false)
        location.reload()
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
                    return modalContent[sec](session.firestore)
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

const Accounts: NextPage = ({ data }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const session = useSession();
  
  const [operating, setOperating] = useRecoilState(operatingPage)
  const [page, setPage] = useState(<div className='flex flex-row items-center justify-center text-2xl animate-pulse'>頁面正在載入中</div>)
  const { scrollX, scrollY, scrollDirection } = useScroll();
  useEffect(() => {
    if (session.status == "authenticated") {
      setPage(<Page session={session.data} data={data} />)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status])
  return (
    <div className='min-h-screen bg-background/90 py-4'>
      <HeadUni title={Global.webMap.accounts.title} description='慈中後生帳號管理中心' pages={Global.webMap.accounts.href} />
      <div className='max-w-xs md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto'>
        <Navbar onTop={scrollY < 38} />
        {page}
      </div>
      {session.status == "authenticated" ? <Modal session={session.data} setOperate={setOperating} /> : <></>}
      {operating ? <div className='fixed z-[80] top-0 left-0 w-screen h-screen bg-gray-200/40 duration-400 animate-opacity cursor-wait'></div> : <></>}
    </div>
  );
};

export default Accounts;

export const getStaticProps: GetStaticProps = async (context) => {
  const querySnapshot = await getDocs(collection(db, "Global"));
  const data: any = {}
  querySnapshot.forEach((doc) => {
    data[doc.id] = doc.data()
  });
  return {
    props: {
      data: data
    },
    revalidate: 900,
  }
}
