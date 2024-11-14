import { accountDecoding, auth } from "@/app/api/auth/[...nextauth]/auth";
import { LangCode } from "@/types/i18n";
import { WebMapIndex } from "@/types/webmap";
import { languages, webInfo } from "@/utils/config";
import { getPremissions } from "@/utils/get-firestore";
import { headers } from 'next/headers';
import Link from "next/link";
import { HoverICON } from "../global/hover-icon";

export const NavbarMenuWrapper = async ({ lang }: { lang: LangCode }) => {
  const headersList = await headers();
  const header_url = new URL(headersList.get('x-url') || `https://${webInfo.subdomian ? webInfo.subdomian + "." : ""}${webInfo.domain}/`);
  const header_pathname = Object.keys(languages).map(lang => `/${lang}/`).some((lang) => {
    return `${header_url.pathname}/`.startsWith(lang);
  }) ? `${header_url.pathname}/`.slice(3) : `${header_url.pathname}/`;
  const session = await auth();
  const account = accountDecoding(session.account);
  const admin = session ? await getPremissions(account) : false;
  const NavbarMenuLink = ({ nav }: { nav: WebMapIndex<"Parent"> }) => {
    if (!nav.nav) return (<></>);
    return (
      <Link href={nav.href} className={`${(nav.href.split("/")[1] == header_pathname.split("/")[1]) && !nav.href.startsWith("http") ? "text-main2" : "text-main"} hover:text-main2 cursor-pointer py-1.5 font-medium flex flex-row items-center group`}>
        <div className="relative h-5 w-5 mr-2">
          {(nav.href.split("/")[1] == header_pathname.split("/")[1]) && !nav.href.startsWith("http") ? <nav.nav.iconHover className="mr-2 h-5 w-5 -top-0.5" /> :
            <HoverICON className="h-5 w-5" size={5} Icon={nav.nav.icon} IconHover={nav.nav.iconHover} classNameICON="top-[0.2px]" />
          }
        </div>
        <span className="transition-all duration-500">{nav.title(lang)}</span>
      </Link>
    )
  }
  return (
    <div className={`w-full h-max rounded py-2 px-8 mt-3 mb-6 bg-background2 flex flex-col items-center justify-center`}>
      {Object.values(webInfo.webMap).map((index, i) => {
        if (index.nav.show) {
          if (index.nav.admin) {
            if (admin) {
              return (<NavbarMenuLink key={i} nav={index} />)
            }
          } else {
            return (<NavbarMenuLink key={i} nav={index} />)
          }
        }
        return (<div key={i}></div>)
      })}
    </div>
  )
}