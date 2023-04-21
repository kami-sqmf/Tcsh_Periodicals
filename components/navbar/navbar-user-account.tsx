const _ = require('lodash');
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { RiUser3Fill, RiUser3Line } from "react-icons/ri";
import { NavbarAccountMenu } from "./navbar-user-account-menu";

const NavbarUserAccount = async ({ lang }: { lang: LangCode }) => {
  const session = await getServerSession(authOptions);
  if (_.isObject(session?.firestore.data.memberRef)) if (session?.firestore.data.memberRef.path) session!.firestore.data.memberRef = session?.firestore.data.memberRef.path as any;
  return (
    <>
      {session ? <NavbarAccountMenu user={session.firestore.data} size={{ less: 7, md: 10 }} lang={lang} /> : <NavbarAccountUnlogged size={{ less: 7, md: 10 }} lang={lang} />}
    </>
  )
}

export const NavbarAccountUnlogged = ({ size, lang }: { size: { less: number; md: number }; lang: LangCode }) => (
  <Link href={webInfo.webMap.accounts.child.signIn.href} className={`relative block text-main cursor-pointer group h-${size.less} w-${size.less} md:w-${size.md} md:h-${size.md}`}>
    <RiUser3Line className={`absolute opacity-100 group-only-of-type: group-hover:opacity-0 h-${size.less} w-${size.less} md:w-${size.md} md:h-${size.md} transition-all duration-300`} />
    <RiUser3Fill className={`absolute opacity-0 group-hover:opacity-100 h-${size.less} w-${size.less} md:w-${size.md} md:h-${size.md} transition-all duration-300`} />
    <div className="absolute w-max px-2 py-1 text-xs bg-background2 rounded-md opacity-0 group-hover:block group-hover:opacity-90 transition-opacity duration-300 -bottom-7">
      <span>{webInfo.webMap.accounts.child.signIn.title(lang)}</span>
    </div>
  </Link>
)

export { NavbarUserAccount };
