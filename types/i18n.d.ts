import { languages } from "@/utils/config";

export interface LangConfig {
  [x: string]: {
    name: string;
    code: string;
    icon: JSX.Element;
  };
}

export interface I18nConfig {
  defaultLocale: string;
  locales: string[];
  languages: LangConfig;
}

export type LangCode = keyof (typeof languages);

export type i18nArrowFunc = (locale: LangCode) => string | JSX.Element | JSX.Element[];