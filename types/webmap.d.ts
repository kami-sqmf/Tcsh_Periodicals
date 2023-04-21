import { StaticImageData } from "next/image";
import { LangCode, i18nArrowFunc } from "./i18n";

export interface WebInfo {
  domain: string,
  subdomian: string,
  logo: StaticImageData,
  webMap: {
    [x: string]: WebMapIndex<"Parent">
  }
}

export interface WebMapIndex<Type extends "Parent" | "Child"> {
  href: string;
  title: i18nArrowFunc;
  description?: i18nArrowFunc;
  nav?: {
    show: boolean;
    admin: boolean;
    icon: IconType;
    iconHover: IconType;
  };
  child?: Type extends "Parent" ? { [x: string]: WebMapIndex<"Child"> } : undefined;
}