import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { getAbout } from "@/utils/get-firestore";
import Link from "next/link";
import { AboutElement } from "./about";


const AboutWrapper = async ({ lang, className = "" }: { lang: LangCode; className?: string; }) => {
  const about = await getAbout();
  return (
    <div className={`${className} flex flex-col justify-around max-w-full h-max border-2 border-main px-6 mt-8 mb-7 md:h-max md:px-8 md:my-0`}>
      <AboutElement className="flex flex-col -mb-2" lang={lang} info={about} />
      <p className="text-xs text-main/70 mb-3">© 慈中後生 2023・<Link href={webInfo.webMap.policy.href} className="text-main2/70">{webInfo.webMap.policy.title(lang)}</Link></p>
    </div>
  )
}

export const revalidate = 300;
export { AboutWrapper };
