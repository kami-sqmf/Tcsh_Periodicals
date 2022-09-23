
import Image from 'next/image';
import Link from 'next/link';
import { RiInstagramLine } from 'react-icons/ri';
import { useRecoilState } from 'recoil';
import { accountIndexModalSection, accountIndexModalState, adminSelectProfile } from '../atoms/AccountModal';
import { Accounts, canChangeProfile, classParser, instanceOfMembers, Members } from '../types/firestore';
import role from '../types/role';

const AccountProfile = ({ profile, rounded = true, owned = false }: { profile: Accounts | Members, rounded?: boolean, owned: boolean }) => {
    const [modalOpen, setModalOpen] = useRecoilState(accountIndexModalState)
    const [modalSection, setModalSection] = useRecoilState(accountIndexModalSection)
    const [adminSelect, setAdminSelect] = useRecoilState(adminSelectProfile)
    const setChange = (sec: canChangeProfile[]) => {
        setModalOpen(true)
        setModalSection(sec)
        setAdminSelect(profile as any)
    }
    return (
        <div className={`${rounded ? "rounded-2xl" : ""} flex flex-col w-full min-w-72 min-h-[32em] max-h-[38em] bg-white-light shadow-xl overflow-hidden bg-background2/90`}>
            <div className='group relative w-full aspect-square min-w-72'>
                <Image alt={`這是${profile.name}的照片`} src={profile.avatar} layout="fill" objectFit='cover' />
                {owned ? <div className="absolute bottom-0 flex flex-row justify-center items-center w-full py-2 bg-background/0 text-main2/0 group-hover:text-main2 group-hover:bg-background/70 transition-all cursor-pointer" onClick={(e)=>setChange(["avatar"])} >
                    <span>按此更改</span>
                </div> : <></>}
            </div>
            <div className='flex flex-col px-5 py-6 space-y-4'>
                <div className='flex flex-row items-baseline font-["GenJyuuGothic"]'>
                    <p className='basis-5/12 text-2xl font-bold text-main'>{profile.name}</p>
                    {instanceOfMembers(profile) ? <p className='basis-7/12 text-main/80 text-sm'>{`${role[profile.role].name}`}</p> : <p className='basis-7/12 text-main/80 text-sm'>{`${profile.username}`}</p>}
                </div>
                {owned ? <p className='text-gray-400/80 text-sm font-bold cursor-pointer' onClick={(e)=>setChange(["name", "username"])} >點此更改-名稱</p> : <></> }
                <div className='flex flex-col mt-3 space-y-2'>
                    <div className='flex flex-row justify-between items-end'>
                        <div className='flex flex-col'>
                            <p className='text-main2 text-sm'>班級：</p>
                            <p className='text-main whitespace-pre-line'>{classParser(profile.class)}</p>
                        </div>
                        {owned ? <p className='text-gray-400/80 text-sm font-bold cursor-pointer' onClick={(e)=>setChange(["class"])} >點此更改-班級</p> : <></> }
                    </div>
                    {profile.bio ?
                        <div className='flex flex-col'>
                            <p className='text-main2 text-sm'>{profile.customTitle ? profile.customTitle : "自我介紹："}</p>
                            <p className='text-main whitespace-pre-line'>{profile.bio.replaceAll("\\n", " \n ")}</p>
                        </div> : <></>
                    }
                    {owned ? <p className='text-gray-400/80 text-sm font-bold cursor-pointer' onClick={(e)=>setChange(["bio", "customTitle"])} >點此{profile.bio ? "更改" : "新增" }-自我介紹</p> : <></> }
                    <div className='mt-3'></div>
                    {profile.insta ?
                        <Link href={`https://www.instagram.com/${profile.insta}`}>
                            <div className="group flex flex-row items-center justify-around border-2 border-main rounded-2xl mt-2 py-1.5 text-main cursor-pointer">
                                <RiInstagramLine className="w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 group-hover:animate-spinIG" />
                                <span className="text-lg md:text-base xl:text-lg mr-12 md:mr-1 lg:mr-6 font-medium">追蹤 IG</span>
                            </div>
                        </Link> : <></>
                    }
                    {owned ? <p className='text-gray-400/80 text-sm font-bold cursor-pointer' onClick={(e)=>setChange(["insta"])} >點此{profile.insta ? "更改" : "新增" }-Instagram</p> : <></> }
                </div>
            </div>
        </div>
    )
}

export default AccountProfile