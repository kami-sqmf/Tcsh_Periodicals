import { langCode } from "../language/lang";
import { webInfo } from "../types/global";
import HeadUni from "./HeadUni";
import { Navbar } from "./Navbar";

export const PageWrapper = ({ page, withNavbar= true, operating = false, children, lang = "zh", className }: React.PropsWithChildren<{ page: webInfo, withNavbar: boolean, operating: boolean, lang: langCode, className?: string }>) => (
    <div className='min-h-screen bg-background/90 py-4'>
        <HeadUni title={page.title ? page.title(lang) : "北極星"} description={page.description ? page.description(lang) : "慈中後生歡迎您！"} lang={lang} pages='' />
        <div className={'max-w-xs md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto ' + className}>
            { withNavbar ? <Navbar/> : <></>}
            { children }
        </div>
        {operating ? <div className='fixed z-[80] top-0 left-0 w-screen h-screen bg-gray-200/40 duration-400 animate-opacity cursor-wait'></div> : <></>}
    </div>
)