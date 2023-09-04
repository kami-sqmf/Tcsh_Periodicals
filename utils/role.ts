import i18nDefault from '@/translation/role/zh.json';
import { Class } from '@/types/firestore';
import { LangCode } from '@/types/i18n';
import i18n from "@/utils/i18n";

export const MemberRole = {
  1: {
    "id": 1,
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("1"),
  },
  100: {
    "id": 100,
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("100"),
  },
  101: {
    "id": 101,
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("101"),
  },
  102: {
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("102"),
    "id": 102
  },
  103: {
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("103"),
    "id": 103
  },
  104: {
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("104"),
    "id": 104
  },
  200: {
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("200"),
    "id": 200
  },
  201: {
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("201"),
    "id": 201
  },
  203: {
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("203"),
    "id": 203
  },
  202: {
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("202"),
    "id": 202
  },
  300: {
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("300"),
    "id": 300
  },
  301: {
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("301"),
    "id": 301,
  },
  302: {
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("302"),
    "id": 302,
  },
  400: {
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("400"),
    "id": 400,
  },
  401: {
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("401"),
    "id": 401,
  },
  500: {
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("500"),
    "id": 500
  },
  501: {
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("501"),
    "id": 501
  },
  600: {
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("600"),
    "id": 600,
  },
  601: {
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("601"),
    "id": 601,
  },
  700: {
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("700"),
    "id": 700,
  },
  701: {
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("701"),
    "id": 701,
  },
  800: {
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("800"),
    "id": 800,
  },
  801: {
    "name": (lang: LangCode) => new i18n<typeof i18nDefault>(lang, "role")._("801"),
    "id": 801,
  }
}

export const classParser = function (clas2: Class) {
  let clas2Res = "";
  clas2Res += (clas2[0] == "J" ? "國" : "高");
  switch (clas2[1]) {
    case "1":
      clas2Res += "一"
      break;
    case "2":
      clas2Res += "二"
      break;
    case "3":
      clas2Res += "三"
      break;
  }
  switch (clas2[2]) {
    case "1":
      clas2Res += "知足"
      break;
    case "2":
      clas2Res += "感恩"
      break;
    case "3":
      clas2Res += "善解"
      break;
    case "4":
      clas2Res += "包容"
      break;
    case "5":
      clas2Res += "大愛"
      break;
    case "6":
      clas2Res += "合心"
      break;
    case "7":
      clas2Res += "協力"
      break;
  }
  return clas2Res
}
