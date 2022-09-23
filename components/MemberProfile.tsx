import Image from 'next/image';
import Link from 'next/link';
import { RiInstagramLine } from 'react-icons/ri';
import { classParser, Members } from '../types/firestore';
import role from '../types/role';

const MemberProfile = ({ profile }: { profile: Members }) => {
    try {
        return (
            <div className='flex flex-col w-72 min-h-[32em] max-h-[38em] bg-white-light shadow-xl rounded-2xl overflow-hidden bg-background2/90'>
                <div className='relative aspect-square w-72 h-72'>
                    <Image alt={`這是${profile.name}的憨憨照`} src={profile.avatar} layout="fill" objectFit='cover'/>
                </div>
                <div className='flex flex-col px-5 py-6 space-y-4'>
                    <div className='flex flex-row items-baseline font-["GenJyuuGothic"]'>
                        <p className='basis-5/12 text-2xl font-bold text-main'>{profile.name}</p>
                        <p className='basis-7/12 text-main/80 text-sm'>{`${role[profile.role].name}`}</p>
                    </div>
                    <div className='flex flex-col mt-3 space-y-2'>
                        <div className='flex flex-col'>
                            <p className='text-main2 text-sm'>班級：</p>
                            <p className='text-main whitespace-pre-line'>{classParser(profile.class)}</p>
                        </div>
                        <div className='flex flex-col'>
                            <p className='text-main2 text-sm'>{profile.customTitle ? profile.customTitle : "自我介紹："}</p>
                            <p className='text-main whitespace-pre-line'>{profile.bio.replaceAll("\\n", " \n ")}</p>
                        </div>
                        <div className='mt-5'></div>
                        <Link href={`https://www.instagram.com/${profile.insta}`}>
                            <div className="group flex flex-row items-center justify-around border-2 border-main rounded-2xl py-1.5 text-main cursor-pointer">
                                <RiInstagramLine className="w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 group-hover:animate-spinIG" />
                                <span className="text-lg md:text-base xl:text-lg mr-12 md:mr-1 lg:mr-6 font-medium">追蹤 IG</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        )
    } catch (error) {
        return <></>
    }
}

export default MemberProfile