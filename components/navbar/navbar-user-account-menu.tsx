'use client';

import { Account, Member } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import i18n from "@/utils/i18n";
import { Menu, Transition } from "@headlessui/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { RiBookletFill, RiBookletLine, RiLogoutBoxRFill, RiLogoutBoxRLine, RiUser3Fill, RiUser3Line } from "react-icons/ri";
import i18nDefault from "../../translation/accounts/zh.json";
import { HoverICON } from "../global/hover-icon";

export const NavbarAccountMenu = ({ user, lang, size }: { user: Account | Member; lang: LangCode; size: { less: number; md: number } }) => {
  const t = new i18n<typeof i18nDefault>(lang, "accounts");
  return (
    <Menu as="div" className="relative z-50">
      <Menu.Button className={`relative text-main cursor-pointer group h-${size.less} w-${size.less} md:w-${size.md} md:h-${size.md}`}>
        <Image placeholder='blur' blurDataURL="/assests/defaultProfile.png" src={user.avatar} fill={true} className="rounded-full overflow-hidden object-cover bg-background2" alt="大頭貼" sizes="(max-width: 1024px) 272px, (max-width: 768px) 188vw, 268vw" />
        <div className="absolute w-max px-2 py-1 text-xs z-40 bg-background2 rounded-md hidden opacity-0 group-hover:block group-hover:opacity-90 transition-opacity -translate-x-[10%] -bottom-7">
          <span>{user.name}</span>
        </div>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-3 w-max max-w-48 text-main divide-y divide-gray-300 rounded-md bg-background2 shadow-lg ring-1 ring-main2 ring-opacity-5 focus:outline-none">
          <div className="pl-4 pr-8 py-1 space-y-2">
            <Menu.Item as={Link} href={`/editor/new`} className="flex flex-row items-center space-x-2 cursor-pointer group hover:text-main2">
              <HoverICON className="h-5 w-5" size={5} Icon={webInfo.webMap.postIt.nav.icon} IconHover={webInfo.webMap.postIt.nav.iconHover} />
              <span className="transition-all duration-500">{webInfo.webMap.postIt.title(lang)}</span>
            </Menu.Item>
            <Menu.Item as={Link} href={webInfo.webMap.accounts.child.posts.href} className="flex flex-row items-center space-x-2 cursor-pointer group hover:text-main2">
              <HoverICON className="h-5 w-5" size={5} Icon={RiBookletLine} IconHover={RiBookletFill} />
              <span className="transition-all duration-500">{webInfo.webMap.accounts.child.posts.title(lang)}</span>
            </Menu.Item>
          </div>
          <div className="pl-4 pr-8 py-1 space-y-2">
            <Menu.Item as={Link} href={webInfo.webMap.accounts.href} className="flex flex-row items-center space-x-2 cursor-pointer group hover:text-main2">
              <HoverICON className="h-5 w-5" size={5} Icon={RiUser3Line} IconHover={RiUser3Fill} />
              <span className="transition-all duration-500">{webInfo.webMap.accounts.title(lang)}</span>
            </Menu.Item>
          </div>
          <div className="pl-4 pr-8 py-1 space-y-2">
            <Menu.Item as="div" className="flex flex-row items-center space-x-2 cursor-pointer group hover:text-main2" onClick={() => signOut()}>
              <HoverICON className="h-5 w-5" size={5} Icon={RiLogoutBoxRLine} IconHover={RiLogoutBoxRFill} />
              <span className="transition-all duration-500">{t._("accounts-logout")}</span>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu >
  )
}