import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { langCode } from "../../language/lang";
import LogoSVG from '../../public/logo-nav.svg';
import { AccountsUni } from "../../types/firestore";
import { useScroll } from "../../utils/use-scroll";
import { NavbarAccountMenu } from "../navbar";
import Link from "next/link";

const floatNav = 59;

const EditorNavbar = ({ lang, status, user, setModalPublish, isPageReady }: { lang: langCode; status: string; user: AccountsUni; setModalPublish: Dispatch<SetStateAction<boolean>>; isPageReady: boolean }) => {
  const { scrollY } = useScroll();
  return (
    <div className={`flex items-center h-16 w-full transition-all duration-300 ${scrollY > floatNav ? "fixed top-0 bg-background2/90" : "bg-background2/10"} z-30`}>
      <div className='flex flex-row justify-between items-center w-[20rem] md:w-[42rem] lg:w-[56rem] xl:w-[72rem] mx-auto'>
        <div className='flex flex-col md:flex-row md:items-center md:space-x-2'>
          <Link href={`/${lang}`}><Image src={LogoSVG} alt="慈中後生 Logo" className="h-10 w-36 -ml-2 md:ml-0" /></Link>
          <span className='font-medium text-xs text-main/80 mt-2'>{status}</span>
        </div>
        <div className='right flex flex-row items-center space-x-6'>
          <button onClick={() => setModalPublish(true && isPageReady)} className="flex flex-row justify-center items-center px-3 py-1 rounded-lg bg-green-700 hover:bg-green-800 transition-all duration-300">
            <p className="text text-background2 my-auto">發布</p>
          </button>
          <NavbarAccountMenu size={{ less: 8, md: 9 }} lang={lang} user={user.data} />
        </div>
      </div>
    </div>
  )
}

export { EditorNavbar };
