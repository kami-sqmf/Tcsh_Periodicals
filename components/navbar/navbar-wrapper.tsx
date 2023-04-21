import { LangCode } from "@/types/i18n";
import { Navbar } from "./navbar";
import { NavbarMenuWrapper } from "./navbar-menu-wrapper";
import { NavbarUserAccount } from "./navbar-user-account";

const NavbarWrapper = ({ lang }: { lang: LangCode }) => {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Navbar lang={lang} userAccount={<NavbarUserAccount lang={lang} />} menu={<NavbarMenuWrapper lang={lang} />} />
    </>
  )
}

export { NavbarWrapper };
