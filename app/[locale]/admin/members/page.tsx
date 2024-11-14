"use client";

const _ = require('lodash');
import { AdminManageWrapper } from "@/components/admin/admin";
import { BreadcrumbWrapper } from "@/components/breadcumb/breadcumb";
import { Loading } from "@/components/global/loading";
import { teamParser } from "@/components/member/member-content";
import { Member, Members, Role } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { makeid } from "@/utils/ebook-voucher";
import { db, storage } from "@/utils/firebase";
import { getRoles } from "@/utils/get-firestore";
import { classParser } from "@/utils/role";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, Unsubscribe, updateDoc, writeBatch } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import Image from "next/image";
import Link from "next/link";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  use,
} from "react";
import { RiAddBoxFill, RiAddBoxLine, RiAddCircleFill, RiAddCircleLine, RiDeleteBin5Fill, RiDeleteBin5Line, RiEdit2Fill, RiEdit2Line, RiEyeOffFill, RiEyeOffLine, RiInformationFill, RiInformationLine, RiInstagramLine } from "react-icons/ri";

export default function Page(props: { params: Promise<{ locale: LangCode }> }) {
  const params = use(props.params);
  const locale = params.locale;
  const dataFetchedRef = useRef<boolean>(false);
  const unsubscribeSnapshot = useRef<Unsubscribe>();
  const [roles, setRoles] = useState<Role[]>([{ parent: false, childs: [], order: 0, id: "", name: { zh: "", ja: "", en: "", de: "", }, premissions: [], }]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<ModalInfo>(null);
  const [teamFilter, setTeamFilter] = useState<number>(0);
  const [teamSnapshot, setTeamSnapshot] = useState<TeamSnapshot>([]);
  const [serverSnapshot, setServerSnapshot] = useState<Members>();
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    const roles = getRoles();
    roles.then(res => {
      setRoles(res);
      onSnapshot(query(collection(db, 'members'), orderBy("team", "desc")), async snapshot => {
        setTeamSnapshot(snapshot.docs.map((doc) => { return { team: doc.data().team, tId: doc.id, present: doc.data().present } }));
        setTeamFilter(snapshot.docs[0].data().team);
      })
    });
  })
  useEffect(() => {
    if (teamSnapshot.length === 0) return;
    if (unsubscribeSnapshot.current) unsubscribeSnapshot.current();
    const teamId = teamSnapshot.filter(team => team.team === teamFilter)[0].tId;
    const teamPresent = teamSnapshot.filter(team => team.team === teamFilter)[0].present;
    unsubscribeSnapshot.current = onSnapshot(collection(db, "members", teamId, "profiles"), async snapshot => {
      setServerSnapshot({
        team: teamFilter,
        teamId: teamId,
        present: teamPresent,
        profiles: snapshot.docs.map(doc => {
          return {
            ...doc.data(),
            roleInfo: roles.find(role => doc.data().role.path.includes(role.id))
          };
        }) as Member[]
      });
    })
  }, [teamFilter])
  return (
    <>
      <BreadcrumbWrapper args={[{ title: webInfo.webMap.admin.title(locale) as string, href: webInfo.webMap.admin.href, icon: webInfo.webMap.admin.nav.icon }, { title: webInfo.webMap.admin.child.members.title(locale) as string, href: webInfo.webMap.admin.child.members.href, icon: webInfo.webMap.admin.child.members.nav.icon }]} />
      {serverSnapshot ?
        <AdminManageWrapper
          ready={!!serverSnapshot}
          toolbar={{
            actions: [{
              name: "add",
              text: "新增成員",
              level: [0],
              icon: RiAddCircleLine,
              iconHover: RiAddCircleFill,
            }, {
              name: "addTeam",
              text: `新增${teamParser('zh', teamFilter + 1)}`,
              level: [0],
              icon: RiAddBoxLine,
              iconHover: RiAddBoxFill,
            }, {
              name: "removeTeam",
              text: `移除${teamParser('zh', teamFilter)}`,
              level: [0],
              icon: RiDeleteBin5Line,
              iconHover: RiDeleteBin5Fill,
            }, {
              name: "hideTeam",
              text: `${teamSnapshot.filter(t => t.tId === serverSnapshot.teamId)[0].present ? "隱藏" : "顯示"}${teamParser('zh', teamFilter)}`,
              level: [0],
              icon: RiEyeOffLine,
              iconHover: RiEyeOffFill,
            }, {
              name: "edit",
              text: "編輯成員",
              level: [1],
              icon: RiEdit2Line,
              iconHover: RiEdit2Fill,
            }, {
              name: "remove",
              text: "刪除成員",
              level: [1],
              icon: RiDeleteBin5Line,
              iconHover: RiDeleteBin5Fill,
            }, {
              name: "preview",
              text: "預覽卡片",
              level: [1],
              icon: RiInformationLine,
              iconHover: RiInformationFill,
            }],
            left: (
              <select value={teamFilter} onChange={(e) => { setTeamFilter(parseInt(e.target.value)) }} className="text-sm text-main bg-transparent border-[1.5px] border-main px-2 py-1 rounded select-none outline-none">
                {teamSnapshot.map((team) => (
                  <option key={team.team} value={team.team}>{teamParser("zh", team.team)}</option>
                ))}
              </select>
            )
          }}
          modalInfos={{
            infos: [{
              name: "add",
              title: "新增成員",
              modal: <ModalEditOrAdd roles={roles} teamId={teamSnapshot.filter(team => team.team === teamFilter)[0].tId} modalInfo={false} setModal={setModalOpen} />,
            }, {
              name: "edit",
              title: "編輯成員",
              modal: <ModalEditOrAdd roles={roles} teamId={teamSnapshot.filter(team => team.team === teamFilter)[0].tId} modalInfo={modalInfo!} setModal={setModalOpen} />,
            }, {
              name: "remove",
              title: `確定要移除『${modalInfo?.name}』嗎？`,
              modal: <ModalDelete teamId={teamSnapshot.filter(team => team.team === teamFilter)[0].tId} modalInfo={modalInfo!} setModal={setModalOpen} />,
            }, {
              name: "preview",
              title: "成員卡片",
              modal: <ModalInfo modalInfo={modalInfo!} roles={roles} />,
            }, {
              name: "addTeam",
              title: "新增下一屆",
              modal: <ModalAddTeam team={teamFilter} setModal={setModalOpen} />,
            }, {
              name: "removeTeam",
              title: "確定要移除這屆嗎？",
              modal: <ModalDeleteTeam team={teamFilter} teamId={teamSnapshot.filter(team => team.team === teamFilter)[0].tId} setModal={setModalOpen} />,
            }, {
              name: "hideTeam",
              title: `${teamSnapshot.filter(t => t.tId === serverSnapshot.teamId)[0].present ? "隱藏" : "顯示"}${teamParser('zh', teamFilter)}`,
              modal: <ModalHideTeam team={teamFilter} teamId={teamSnapshot.filter(team => team.team === teamFilter)[0].tId} teamPresent={teamSnapshot.filter(team => team.team === teamFilter)[0].present} setModal={setModalOpen} />,
            }],
            modalInfo: modalInfo,
            setModalInfo: setModalInfo,
            modalOpen: modalOpen,
            setModalOpen: setModalOpen
          }}
        >
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center my-4 h-full'>
            {serverSnapshot.profiles.sort((a, b) => a.roleInfo!.order - b.roleInfo!.order).map((profile, key) => (
              <div key={key} className={`cursor-pointer relative flex flex-col items-center px-6 py-4 space-y-2 rounded-lg ${modalInfo?.uid === profile.uid ? "bg-background/60" : "hover:bg-background/60"} transition-all duration-500 group`} onClick={() => { setModalInfo(profile); }}>
                <div className={`relative text-main cursor-pointer group h-24 w-24`}>
                  <Image placeholder='blur' blurDataURL="/assests/defaultProfile.png" src={profile.avatar} fill={true} className="rounded-full overflow-hidden object-cover bg-background2" alt={`${profile.name}的大頭貼`} sizes="(max-width: 1024px) 272px, (max-width: 768px) 188vw, 268vw" />
                </div>
                <p>{profile.name}</p>
                <p className="text-sm text-main/80">{profile.roleInfo?.name.zh}</p>
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
const ModalInfo = ({ modalInfo, roles }: { modalInfo: Member, roles: Role[] }) => (
  <div className={`w-72 flex flex-col min-h-[32em] max-h-[38em] rounded-2xl bg-white-light shadow-xl overflow-hidden bg-background2/90`}>
    <div className="relative aspect-square h-72">
      <Image alt={`${modalInfo.name}的大頭貼`} src={modalInfo.avatar} fill={true} className="object-cover" />
    </div>
    <div className='flex flex-col px-5 py-6 space-y-4 font-["GenJyuuGothic"] w-full'>
      <div className='flex flex-row items-baseline font-serif'>
        <p className='basis-5/12 text-2xl font-bold text-main'>{modalInfo.name}</p>
        <p className='basis-7/12 text-main/80 text-sm'>{roles.find(role => role.id === modalInfo.roleInfo?.id)?.name["zh"]}</p>
      </div>
      <div className='flex flex-col mt-3 space-y-2'>
        {modalInfo.class && <div className='flex flex-col'>
          <p className='text-main2 text-sm'>班級</p>
          <p className='text-main whitespace-pre-line'>{classParser(modalInfo.class)}</p>
        </div>}
        <div className='flex flex-col'>
          <p className='text-main2 text-sm'>{modalInfo.customTitle ? modalInfo.customTitle : "自我介紹"}</p>
          <p className='text-main whitespace-pre-line'>{modalInfo.bio ? modalInfo.bio.replaceAll("\\n", " \n ") : "TA 沒有留下任何 ＢＩＯ"}</p>
        </div>
        <div className='mt-5'></div>
        {modalInfo.insta && <Link href={`https://www.instagram.com/${modalInfo.insta}`} className="select-none outline-none">
          <div className="group flex flex-row items-center justify-around border-2 border-main rounded-2xl py-1.5 text-main cursor-pointer">
            <RiInstagramLine className="w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 group-hover:animate-spinIG" />
            <span className="text-lg md:text-base xl:text-lg mr-12 md:mr-1 lg:mr-6 font-medium">追蹤 IG</span>
          </div>
        </Link>}
      </div>
    </div>
  </div>
)

// Modal - Delete
const ModalDelete = ({ teamId, modalInfo, setModal }: { teamId: string; modalInfo: Member; setModal: Dispatch<SetStateAction<boolean>> }) => {
  const [value, setValue] = useState("");
  const [lodaing, setLodaing] = useState<boolean>(false);
  const onDeleteSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLodaing(true);
    await deleteDoc(doc(db, "members", teamId, "profiles", modalInfo.uid));
    setLodaing(false);
    setModal(false);
  }
  if (lodaing) return (<div className="w-full h-full flex justify-center items-center"><Loading text="刪除中" /></div>)
  else return (
    <form className="flex flex-col space-y-2 max-w-xs" onSubmit={onDeleteSubmit}>
      <p className="w-full px-4 py-2 text-center text-background2 bg-main/60">若你未讀完以下資訊，你將會後悔莫及！</p>
      <h2>經過這個動作你將無法再透過網站找回最初的起點，所有人都不會再看到這個成員了！請問你確定嗎？</h2>
      <h3>如果你確定要刪除本成員的話，請在下方輸入框輸入他的名稱：『{modalInfo.name}』</h3>
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} pattern={modalInfo.name} placeholder={modalInfo.name} autoComplete="false" className="px-2 py-1 bg-transparent border-2 border-red-700 focus:border-red-900 rounded-lg focus:outline-none" />
      <button disabled={value !== modalInfo.name} className="disabled:bg-red-600/40 bg-red-600/90 py-1 text-background2 rounded-md">刪除</button>
    </form>
  )
}

// Modal - Team
const ModalAddTeam = ({ team, setModal }: { team: number; setModal: Dispatch<SetStateAction<boolean>> }) => {
  const [lodaing, setLodaing] = useState<boolean>(false);
  const onAddSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLodaing(true);
    await addDoc(collection(db, "members"), { team: team + 1, present: false });
    setLodaing(false);
    setModal(false);
  }
  if (lodaing) return (<div className="w-full h-full flex justify-center items-center"><Loading text="新增中" /></div>)
  else return (
    <form className="flex flex-col space-y-2 max-w-xs" onSubmit={onAddSubmit}>
      <p className="w-full px-4 py-2 text-center text-background2 bg-main/60">確定要新增{teamParser('zh', team + 1)}嗎?</p>
      <button className="bg-green-600/90 py-1 text-background2 rounded-md">新增</button>
    </form>
  )
}
const ModalDeleteTeam = ({ team, teamId, setModal }: { team: number; teamId: string; setModal: Dispatch<SetStateAction<boolean>> }) => {
  const [value, setValue] = useState("");
  const [lodaing, setLodaing] = useState<boolean>(false);
  const onDeleteSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLodaing(true);
    await deleteDoc(doc(db, "members", teamId));
    setLodaing(false);
    setModal(false);
  }
  if (lodaing) return (<div className="w-full h-full flex justify-center items-center"><Loading text="刪除中" /></div>)
  else return (
    <form className="flex flex-col space-y-2 max-w-xs" onSubmit={onDeleteSubmit}>
      <p className="w-full px-4 py-2 text-center text-background2 bg-main/60">若你未讀完以下資訊，你將會後悔莫及！</p>
      <h2>經過這個動作你將無法再透過網站找回最初的起點，所有人都不會再看到{teamParser('zh', team)}的所有成員了！請問你確定嗎？</h2>
      <h3>如果你確定要刪除本成員的話，請在下方輸入框輸入{teamParser('zh', team)}的 ID：『{teamId}』</h3>
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} pattern={teamId} placeholder={teamId} autoComplete="false" className="px-2 py-1 bg-transparent border-2 border-red-700 focus:border-red-900 rounded-lg focus:outline-none" />
      <button disabled={value !== teamId} className="disabled:bg-red-600/40 bg-red-600/90 py-1 text-background2 rounded-md">刪除</button>
    </form>
  )
}
const ModalHideTeam = ({ team, teamId, teamPresent, setModal }: { team: number; teamId: string; teamPresent: boolean; setModal: Dispatch<SetStateAction<boolean>> }) => {
  const [value, setValue] = useState("");
  const [lodaing, setLodaing] = useState<boolean>(false);
  const onDeleteSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLodaing(true);
    await updateDoc(doc(db, "members", teamId), { present: !teamPresent });
    setLodaing(false);
    setModal(false);
  }
  if (lodaing) return (<div className="w-full h-full flex justify-center items-center"><Loading text="更改狀態中" /></div>)
  else return (
    <form className="flex flex-col space-y-2 max-w-xs" onSubmit={onDeleteSubmit}>
      <p className="w-full px-4 py-2 text-center text-background2 bg-main/60">若你未讀完以下資訊，你將會後悔莫及！</p>
      <h2>經過這個動作所有人都{teamPresent ? "暫時不會" : "會"}看到{teamParser('zh', team)}的成員了！請問你確定嗎？</h2>
      <h3>如果你確定要{teamPresent ? "隱藏" : "顯示"}本屆的話，請在下方輸入框輸入{teamParser('zh', team)}的 ID：『{teamId}』</h3>
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} pattern={teamId} placeholder={teamId} autoComplete="false" className="px-2 py-1 bg-transparent border-2 border-green-700 focus:border-green-900 rounded-lg focus:outline-none" />
      <button disabled={value !== teamId} className="disabled:bg-green-600/40 bg-green-600/90 py-1 text-background2 rounded-md">更改為{teamPresent ? "非公開" : "公開"}</button>
    </form>
  )
}

// Modal - Edit Or Add
const ModalEditOrAdd = ({ roles, teamId, modalInfo, setModal }: { roles: Role[]; teamId: string, modalInfo: Member | false, setModal: Dispatch<SetStateAction<boolean>> }) => {
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
            const imageRef = ref(storage, `members/avatar/${data.uid.value}-${new Date().getTime()}.jpg`)
            await uploadString(imageRef, renderEvent.target.result as any, "data_url").then(async snapshot => {
              const downloadUrl = await getDownloadURL(imageRef);
              data.avatar.setValue(downloadUrl);
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
    uid: DataState(modalInfo ? modalInfo.uid : makeid(20)),
    avatar: DataState(modalInfo ? modalInfo.avatar : "/assests/defaultProfile.png"),
    bio: DataState(modalInfo ? modalInfo.bio : null),
    class: DataState(modalInfo ? modalInfo.class : null),
    customTitle: DataState(modalInfo ? modalInfo.customTitle : null),
    email: DataState(modalInfo ? modalInfo.email : null),
    insta: DataState(modalInfo ? modalInfo.insta : null),
    name: DataState(modalInfo ? modalInfo.name : null),
    role: DataState(modalInfo ? modalInfo.roleInfo!.id : 1),
  }
  const formOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLodaing(true);
    const batch = writeBatch(db);
    if (modalInfo) {
      const uploadData = removeEmpty({
        uid: data.uid.value,
        avatar: data.avatar.value,
        bio: data.bio.value,
        class: data.class.value,
        customTitle: data.customTitle.value,
        email: data.email.value,
        insta: data.insta.value,
        name: data.name.value,
        role: doc(db, `roles/${data.role.value}`),
      });
      const uploadDataForAccount = removeEmpty({
        avatar: data.avatar.value,
        bio: data.bio.value,
        class: data.class.value,
        customTitle: data.customTitle.value,
        email: data.email.value,
        insta: data.insta.value,
        name: data.name.value,
        username: roles.find(role => role.id === data.role.value)!.name.zh,
      });
      if (!_.isEmpty(uploadData)) {
        batch.update(doc(db, "members", teamId, "profiles", data.uid.value), uploadData as any);
        batch.update(doc(db, "accounts", data.uid.value), uploadDataForAccount as any);
      }
    } else {
      const uploadData = {
        uid: data.uid.value,
        avatar: data.avatar.value,
        bio: data.bio.value,
        class: data.class.value,
        customTitle: data.customTitle.value,
        email: data.email.value,
        insta: data.insta.value,
        name: data.name.value,
        role: doc(db, `roles/${data.role.value}`),
      };
      const docRef = doc(db, "members", teamId, "profiles", data.uid.value)
      batch.set(docRef, uploadData);
      batch.set(doc(db, "accounts", data.uid.value), {
        avatar: data.avatar.value,
        bio: data.bio.value,
        class: data.class.value,
        customTitle: data.customTitle.value,
        email: data.email.value,
        insta: data.insta.value,
        name: data.name.value,
        username: roles.find(role => role.id === data.role.value)!.name.zh,
        isSchool: true,
        memberRef: docRef,
        ownedBooks: []
      });
    }
    await batch.commit();
    setLodaing(false);
    setModal(false);
  }
  if (lodaing) {
    return (
      <div className="w-full h-full flex justify-center items-center"><Loading text="上傳中" /></div>
    )
  } else {
    return (
      <form className="flex flex-col md:flex-row gap-8 items-center" onSubmit={formOnSubmit}>
        <div className={`w-72 flex flex-col min-h-[32em] rounded-2xl bg-white-light shadow-xl overflow-hidden bg-background2/90`}>
          <div className="relative aspect-square h-72 cursor-pointer group" onClick={() => filePickerRef.current!.click()}>
            <Image src={data.avatar.value} fill={true} alt={`${data.name.value || "TA"}的大頭貼`} className="object-cover" />
            <div className='absolute opacity-0 group-hover:opacity-100 bottom-0 w-full h-6 bg-gray-600 bg-opacity-75 text-white text-xs text-center py-1 transition-opacity'>更換</div>
            <input name="thumbnail" type="file" accept="image/*" hidden={true} ref={filePickerRef} onChange={onChangeAvatar}></input>
          </div>
          <div className="px-6 py-4 mb-2">
            <InputField name="name" text="名稱" value={data.name.value} setValue={data.name.setValue} onError={data.name.error} />
            <InputField name="class" text="班級" value={data.class.value} setValue={data.class.setValue} onError={data.class.error} pattern="^(J(1|2|3)(1|2|3|4|5|6|7))|(S(1|2|3)(1|2|3|4|5))$" />
            <InputField name="customTitle" text="自我介紹標題(選填)" value={data.customTitle.value} setValue={data.customTitle.setValue} onError={data.customTitle.error} required={false} />
            <InputField name="bio" text="自我介紹" value={data.bio.value} setValue={data.bio.setValue} onError={data.bio.error} />
          </div>
        </div>
        <div className="flex flex-col w-72 gap-3">
          <div className="flex flex-col gap-1 justify-center text-main2">
            <h2 className='text-lg font-medium text-main'>組別</h2>
            <select value={data.role.value} onChange={(e) => { data.role.setValue(e.target.value) }} className="text-sm text-main bg-transparent border-[1.5px] border-main px-2 py-1 rounded select-none outline-none">
              {roles.map((role, index) => (
                <option key={index} value={role.id}>{role.name["zh"]}</option>
              ))}
            </select>
            {data.role.error && <span className="text-xs text-red-600">{data.role.error}</span>}
          </div>
          <InputField name="email" text="登入信箱" value={data.email.value} setValue={data.email.setValue} onError={data.email.error} pattern="^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$" />
          <InputField name="insta" text="Instagram 帳號" value={data.insta.value} setValue={data.insta.setValue} onError={data.insta.error} pattern="^[\w](?!.*?\.{2})[\w.]{1,28}[\w]$" required={false} />
          <button type="submit" className='px-3 py-2 bg-green-600 text-xs text-background2 rounded-lg md:rounded mt-2 md:mt-0 disabled:bg-green-600/70'>{modalInfo ? "更改" : "新增"}</button>
        </div>
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

type ModalInfo = Member | null;

type TeamSnapshot = { team: number; tId: string, present: boolean }[];

const removeEmpty = (obj: any) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}