import { LangCode } from "@/types/i18n";
import { NavbarWrapper } from "../navbar/navbar-wrapper";
import { NotificationWrapper } from "../notification/notification-wrapper";

export const PageWrapper = ({ children, className = "", operating = false, withNavbar = false, withNotifications = false, lang }: React.PropsWithChildren<{ className?: string; operating?: boolean; withNavbar?: boolean; withNotifications?: boolean; lang: LangCode; }>) => (
  <div className='min-h-screen bg-background/90 py-4'>
    <div className={`${className} max-w-xs md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto`}>
      {withNavbar ? <NavbarWrapper lang={lang} /> : <></>}
      {withNotifications && <NotificationWrapper className="mt-2" lang={lang} />}
      {children && children}
    </div>
    {operating ? <div className='fixed z-[80] top-0 left-0 w-screen h-screen bg-gray-200/40 duration-400 animate-opacity cursor-wait'></div> : <></>}
  </div>
)