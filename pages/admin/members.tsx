import { addDoc, collection, doc, DocumentData, onSnapshot, orderBy, query, QueryDocumentSnapshot, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { RiAdminLine, RiUserSettingsLine } from 'react-icons/ri';
import { SetterOrUpdater } from 'recoil';
import { Breadcrumb } from '../../components/breadcrumb';
import { PageWrapper } from '../../components/page-wrapper';
import { Profile } from '../../components/profile';
import { langCode } from '../../language/lang';
import { Account, Accounts } from '../../types/firestore';
import { Global } from '../../types/global';
import { MemberRole } from '../../types/role';
import { db, storage } from '../../utils/firebase';

const Modal = dynamic(() => import('../../components/edit-profile-modal').then((res) => res.Modal), {
  ssr: false,
})

const AddProfile = ({ setOperate, lang }: { lang: langCode, setOperate: SetterOrUpdater<boolean> }) => {
  const [modalConfirm, setModalConfirm] = useState(0 as number)
  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const [profileAvatar, setProfileAvatar] = useState("/defaultProfile.png")
  const changeListener = (sec: keyof Account) => {
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
        avatar: "/defaultProfile.png"
      }
      const docu = await addDoc(collection(db, `Members`), data);
      const imageRef = ref(storage, `${"Members"}/Avatar/${docu.id}.jpg`)
      await uploadString(imageRef, profileAvatar as any, "data_url").then(async snapshot => {
        const downloadUrl = await getDownloadURL(imageRef)
        await updateDoc(doc(db, `Members/${docu.id}`,), {
          avatar: downloadUrl
        })
        setOperate(false)
        cancelAdd();
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
            {Object.values(MemberRole).map((role) => (
              role.id == 0 ? <></> : <option key={role.id} value={role.id}>{role.name(lang)}</option>
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

function Members({ lang }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [membersList, setMembersList] = useState([] as QueryDocumentSnapshot<DocumentData>[]);
  const [operating, setOperating] = useState(false);
  useEffect(() => {
    onSnapshot(query(collection(db, 'Members'), orderBy("role", 'asc')), snapshot => {
      setMembersList(snapshot.docs)
    })
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db])
  return (
    <div>
      <PageWrapper lang={lang} page={Global.webMap.admin} withNavbar={true} operating={operating}>
        <Breadcrumb args={[{ title: "管理員", href: "/admin", icon: RiAdminLine }, { title: "管理團隊", href: "/admin/members", icon: RiUserSettingsLine }]} />
        <div id="stuList" className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6 max-w-full gap-y-12 justify-items-center'>
          {!membersList[0] ? <div className='flex flex-row items-center justify-center text-2xl animate-pulse'>頁面正在載入中</div> : <></>}
          {membersList.map((memberProfile => (
            <div className='w-72' key={memberProfile.id}>
              <Profile profile={{ type: "Member", data: {uid: memberProfile.id, ...memberProfile.data()} } as Accounts<"Member">} lang={lang} owned={true} rounded={true} />
            </div>
          )))}
          <AddProfile setOperate={setOperating} lang={lang} />
        </div>
      </PageWrapper>
      <Modal lang={lang} setOperate={setOperating} />
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      lang: (context.locale ? context.locale : "zh") as langCode,
    },
  };
}

export default Members