'use client';

import i18nDefault from '@/translation/profile/zh.json';
import { Member } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import i18n from "@/utils/i18n";
import { classParser } from "@/utils/role";
import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import { RiInstagramLine } from "react-icons/ri";

export const Profile = ({ profile, lang }: { profile: Member; lang: LangCode; }) => {
  const t = new i18n<typeof i18nDefault>(lang, "profile");
  const [isLoading, setLoading] = useState<boolean>(true);
  return (
    <div className={`w-72 flex flex-col min-h-[32em] max-h-[38em] rounded-2xl bg-white-light shadow-xl overflow-hidden bg-background2/90`}>
      <div className={`relative aspect-square h-72 ${isLoading ? "animate-pulse bg-main2/60" : ""}`}>
        <Image alt={t._("avatar-alt", { name: profile.name }) as string} src={profile.avatar} fill={true} className="object-cover" loading='lazy' onLoad={() => setLoading(false)} />
      </div>
      <div className='flex flex-col px-5 py-6 space-y-4 font-["GenJyuuGothic"] w-full'>
        <div className='flex flex-row items-baseline font-serif'>
          <p className='basis-5/12 text-2xl font-bold text-main'>{profile.name}</p>
          <p className='basis-7/12 text-main/80 text-sm'>{`${profile.roleInfo ? profile.roleInfo.name[lang] : ""}`}</p>
        </div>
        <div className='flex flex-col mt-3 space-y-2'>
          {profile.class && <div className='flex flex-col'>
            <p className='text-main2 text-sm'>{t._("class")}</p>
            <p className='text-main whitespace-pre-line'>{lang !== "zh" ? profile.class : classParser(profile.class)}</p>
          </div>}
          <div className='flex flex-col'>
            <p className='text-main2 text-sm'>{profile.customTitle ? profile.customTitle : t._("bio")}</p>
            <p className='text-main whitespace-pre-line'>{profile.bio ? profile.bio.replaceAll("\\n", " \n ") : t._("noBio")}</p>
          </div>
          <div className='mt-5'></div>
          {profile.insta && <Link href={`https://www.instagram.com/${profile.insta}`} className="select-none outline-none">
            <div className="group flex flex-row items-center justify-around border-2 border-main rounded-2xl py-1.5 text-main cursor-pointer">
              <RiInstagramLine className="w-8 h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 group-hover:animate-spinIG" />
              <span className="text-lg md:text-base xl:text-lg mr-12 md:mr-1 lg:mr-6 font-medium">{lang === "zh" ? "追蹤 IG" : "Instagram"}</span>
            </div>
          </Link>}
        </div>
      </div>
    </div>
  )
}