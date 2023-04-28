import { LangCode } from '@/types/i18n';
import parse from 'html-react-parser';

export default class i18n<i18nDefault> {
  private i18n;
  private locale;

  constructor(locale: LangCode, path: string) {
    this.locale = locale;
    if (locale as any === "favicon.ico" || locale as any === "site.webmanifest.json") locale = "zh";
    this.i18n = require(`../translation/${path}/${locale}.json`) as i18nDefault;
  }

  _(key: keyof i18nDefault, args?: any, isElement?: boolean) {
    let text = (this.i18n[key] || this.getTranslationMissing()) as string
    if (args) {
      for (const keyArgs of Object.keys(args)) {
        text = text.replace(`{{${keyArgs}}}`, args[keyArgs]);
      }
      return isElement ? parse(text) : text;
    }
    return text;
  }

  private getTranslationMissing(): string {
    const file = require(`../translation/global/${this.locale}.json`);
    return file.translationMissing;
  }
}
