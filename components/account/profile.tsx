'use client';

import { accountDecoding } from '@/app/api/auth/[...nextauth]/auth';
import i18nDefault from '@/translation/profile/zh.json';
import { Account } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import i18n from "@/utils/i18n";
import { classParser } from "@/utils/role";
import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import { RiInstagramLine } from "react-icons/ri";
import { ProfileEditModal } from './profile-edit-modal';

export const Profile = ({ user, lang }: { user: string; lang: LangCode; }) => {
  const t = new i18n<typeof i18nDefault>(lang, "profile");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [option, setOption] = useState<(keyof Account)[]>([]);
  const [profileData, setProfileData] = useState<Account>(accountDecoding(user));
  const setChange = (sec: Array<keyof Account>) => {
    setOption(sec);
    setModalOpen(true);
  };
  return (
    <>
      <div className={`w-72 flex flex-col min-h-[32em] max-h-[38em] rounded-2xl bg-white-light shadow-xl overflow-hidden bg-background2/90`}>
        <div className={`relative aspect-square h-72 w-full md:w-72 group`}>
          <Image alt={t._("avatar-alt", { name: profileData.name }) as string} src={profileData.avatar} fill={true} className="object-cover" />
          <div className="absolute bottom-0 flex flex-row justify-center items-center w-full py-2 bg-background/0 text-main2/0 group-hover:text-main2 group-hover:bg-background/70 transition-all cursor-pointer" onClick={(e) => setChange(["avatar"])} >
            <span>按此更改</span>
          </div>
        </div>
        <div className='flex flex-col px-5 py-6 space-y-4 font-["GenJyuuGothic"] w-full'>
          <div className='flex flex-row items-baseline font-serif'>
            <p className='basis-5/12 text-2xl font-bold text-main'>{profileData.name}</p>
            <p className='basis-7/12 text-main/80 text-sm'>{profileData.username}</p>
          </div>
          <p className='text-gray-400/80 text-sm font-bold cursor-pointer' onClick={() => setChange(["name", "username"])} >{t._("prefixClickChange", { option: t._("name") })}</p>
          <div className='flex flex-col mt-3 space-y-2'>
            {profileData.class && <div className='flex flex-col'>
              <p className='text-main2 text-sm'>{t._("class")}</p>
              <p className='text-main whitespace-pre-line'>{lang !== "zh" ? profileData.class : classParser(profileData.class)}</p>
            </div>}
            <p className='text-gray-400/80 text-sm font-bold cursor-pointer' onClick={() => setChange(["class"])} >{t._("prefixClickChange", { option: t._("class") })}</p>
            <div className='flex flex-col'>
              <p className='text-main2 text-sm'>{profileData.customTitle ? profileData.customTitle : t._("bio")}</p>
              <p className='text-main whitespace-pre-line'>{profileData.bio ? profileData.bio.replaceAll("\\n", " \n ") : t._("noBio")}</p>
            </div>
            <p className='text-gray-400/80 text-sm font-bold cursor-pointer' onClick={() => setChange(["bio", "customTitle"])} >{t._("prefixClickChange", { option: t._("bio") })}</p>
            <div className='mt-5'></div>
            {profileData.insta && <Link href={`https://www.instagram.com/${profileData.insta}`} className="select-none outline-none">
              <div className="group flex flex-row items-center justify-around border-2 border-main rounded-2xl py-1.5 text-main cursor-pointer">
                <RiInstagramLine className="w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 group-hover:animate-spinIG" />
                <span className="text-lg md:text-base xl:text-lg mr-12 md:mr-1 lg:mr-6 font-medium">{lang === "zh" ? "追蹤 IG" : "Instagram"}</span>
              </div>
            </Link>}
            <p className='text-gray-400/80 text-sm font-bold cursor-pointer' onClick={() => setChange(["insta"])} >{t._("prefixClickChange", { option: "Instagram" })}</p>
          </div>
        </div>
      </div>
      <ProfileEditModal option={option} profile={profileData} setProfile={setProfileData} modalOpen={modalOpen} setModalOpen={setModalOpen} lang={lang} />
    </>
  )
}