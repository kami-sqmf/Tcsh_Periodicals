import { LangCode } from "@/types/i18n";
import { NavbarMenuWrapper } from "../navbar/navbar-menu-wrapper";
import { IdeaNavbar } from "./idea-navbar";

const IdeaNavbarWrapper = ({ name, version, lang }: { name: string; version: string; lang: LangCode }) => {
  return (
    <>
      <IdeaNavbar lang={lang} name={name} version={version} menu={<NavbarMenuWrapper lang={lang} />} />
    </>
  )
}

export { IdeaNavbarWrapper };
