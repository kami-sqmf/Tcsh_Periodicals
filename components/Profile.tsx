import Image from "next/image";
import Link from "next/link";
import { RiInstagramLine } from "react-icons/ri";
import { useRecoilState, useSetRecoilState } from "recoil";
import { profileModal, profileModalSelection, profileModalUser } from "../atoms/account-modal";
import { langCode, _t } from "../language/lang";
import { Account, Accounts } from "../types/firestore";
import { classParser, MemberRole } from "../types/role";

export const Profile = ({ profile, rounded = true, owned = false, lang }: { profile: Accounts<"Member"> | Accounts<"Account">; lang: langCode; rounded?: boolean; owned?: boolean }) => {
    const setModalOpen = useSetRecoilState(profileModal);
    const setOption = useSetRecoilState(profileModalSelection); 
    const [profileUser, setProfileUser] = useRecoilState(profileModalUser);
    const setChange = (sec: Array<keyof Account>) => {
        if(profileUser != profile) setProfileUser(profile);
        setOption(sec);
        setModalOpen(true);
    };
    return (
        <div className={`${rounded ? "rounded-2xl" : ""} ${owned ? "w-full" : "w-72"} flex flex-col min-h-[32em] max-h-[38em] bg-white-light shadow-xl overflow-hidden bg-background2/90`}>
            <div className={`relative aspect-square h-72 ${owned ? "w-full md:w-72" : "w-72"} group`}>
                <Image alt={_t(lang).imageAlt} src={profile.data.avatar} fill={true} className="object-cover" />
                {owned ? <div className="absolute bottom-0 flex flex-row justify-center items-center w-full py-2 bg-background/0 text-main2/0 group-hover:text-main2 group-hover:bg-background/70 transition-all cursor-pointer" onClick={(e) => setChange(["avatar"])} >
                    <span>按此更改</span>
                </div> : <></>}
            </div>
            <div className='flex flex-col px-5 py-6 space-y-4 font-["GenJyuuGothic"] w-full'>
                <div className='flex flex-row items-baseline font-serif'>
                    <p className='basis-5/12 text-2xl font-bold text-main'>{profile.data.name}</p>
                    <p className='basis-7/12 text-main/80 text-sm'>{profile.type == "Member" ? MemberRole[profile.data.role]?.name(lang) : profile.data.username}</p>
                </div>
                {owned ? <p className='text-gray-400/80 text-sm font-bold cursor-pointer' onClick={(e) => setChange(["name", "username"])} >{_t(lang).profile.prefixClickChange + _t(lang).edit + " " + _t(lang).profile.name}</p> : <></>}
                <div className='flex flex-col mt-3 space-y-2'>
                    {profile.data.class && <div className='flex flex-col'>
                        <p className='text-main2 text-sm'>{_t(lang).profile.class}</p>
                        <p className='text-main whitespace-pre-line'>{profile.data.class == "Teacher" ? _t(lang).profile.teacher : (lang == "zh" ? classParser(profile.data.class) : profile.data.class)}</p>
                    </div>}
                    {owned ? <p className='text-gray-400/80 text-sm font-bold cursor-pointer' onClick={(e) => setChange(["class"])} >{_t(lang).profile.prefixClickChange + _t(lang).edit +  " " +_t(lang).profile.class.slice(0,-1)}</p> : <></>}
                    <div className='flex flex-col'>
                        <p className='text-main2 text-sm'>{profile.data.customTitle ? profile.data.customTitle : _t(lang).profile.bio}</p>
                        <p className='text-main whitespace-pre-line'>{profile.data.bio ? profile.data.bio.replaceAll("\\n", " \n ") : _t(lang).profile.noBio}</p>
                    </div>
                    {owned ? <p className='text-gray-400/80 text-sm font-bold cursor-pointer' onClick={(e) => setChange(["bio", "customTitle"])} >{_t(lang).profile.prefixClickChange + (profile.data.bio ? _t(lang).edit : _t(lang).add) +  " " +_t(lang).profile.bio.slice(0,-1)}</p> : <></>}
                    <div className='mt-5'></div>
                    {profile.data.insta && <Link href={`https://www.instagram.com/${profile.data.insta}`}>
                        <div className="group flex flex-row items-center justify-around border-2 border-main rounded-2xl py-1.5 text-main cursor-pointer">
                            <RiInstagramLine className="w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 group-hover:animate-spinIG" />
                            <span className="text-lg md:text-base xl:text-lg mr-12 md:mr-1 lg:mr-6 font-medium">{_t(lang).followInsta}</span>
                        </div>
                    </Link>}
                    {owned ? <p className='text-gray-400/80 text-sm font-bold cursor-pointer' onClick={(e) => setChange(["insta"])} >{_t(lang).profile.prefixClickChange + (profile.data.insta ? _t(lang).edit : _t(lang).add)} Instagram</p> : <></>}
                </div>
            </div>
        </div>
    )
}