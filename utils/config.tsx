import { I18nConfig, LangCode, LangConfig } from "@/types/i18n";
import Image from "next/image";
import { RiAccountBoxFill, RiAccountBoxLine, RiAdminFill, RiAdminLine, RiBookFill, RiBookLine, RiChatForwardFill, RiChatForwardLine, RiEditFill, RiEditLine, RiFilePaper2Fill, RiFilePaper2Line, RiGroup2Fill, RiGroup2Line, RiHome2Fill, RiHome2Line, RiInstagramFill, RiInstagramLine, RiLock2Fill, RiLockLine, RiNotification2Line, RiProfileFill, RiProfileLine, RiQuestionnaireFill, RiQuestionnaireLine, RiSlideshowFill, RiSlideshowLine, RiUserSettingsFill, RiUserSettingsLine, RiWindow2Fill, RiWindow2Line, RiYoutubeFill, RiYoutubeLine } from "react-icons/ri";
import GermanIcon from "../public/language/de.svg";
import EnglishIcon from "../public/language/en.svg";
import JapaneseIcon from "../public/language/ja.svg";
import ChineseIcon from "../public/language/zh.svg";
import logo from "../public/logo/logo.jpg";
import logoSVG from '../public/logo/logo-nav.svg';
import i18nDefault from '../translation/config/zh.json';
import i18n from "./i18n";

export const webInfo = {
  domain: "kami.tw",
  subdomian: "periodicals",
  logo: logo,
  logoSVG: logoSVG,
  webMap: {
    index: {
      href: "/",
      title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-index-title"),
      description: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-index-description"),
      nav: {
        show: true,
        admin: false,
        icon: RiHome2Line,
        iconHover: RiHome2Fill,
      },
    },
    ebook: {
      href: "/ebook",
      title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-ebook-title"),
      description: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-ebook-description"),
      nav: {
        show: true,
        admin: false,
        icon: RiBookLine,
        iconHover: RiBookFill,
      }
    },
    posts: {
      href: "https://www.instagram.com/tcsh_periodicals/",
      title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-posts-title"),
      nav: {
        show: true,
        admin: false,
        icon: RiInstagramLine,
        iconHover: RiInstagramFill,
      },
    },
    postIt: {
      href: "/post-it",
      title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-postit-title"),
      description: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-ideaUrStory-description"),
      nav: {
        show: true,
        admin: false,
        icon: RiEditLine,
        iconHover: RiEditFill,
      },
      child: {
        normal: {
          href: "https://linktr.ee/tcsh_periodicals",
          title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-postit-title"),
          nav: {
            show: true,
            admin: false,
            icon: RiEditLine,
            iconHover: RiEditFill,
          },
        },
        anoymous: {
          href: "/idea/ur-story",
          title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-ideaUrStory-title"),
          nav: {
            show: true,
            admin: true,
            icon: RiQuestionnaireLine,
            iconHover: RiQuestionnaireFill
          },
        }
      }
    },
    ideaUrStory: {
      href: "/idea/ur-story",
      title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-ideaUrStory-title"),
      description: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-ideaUrStory-description"),
      nav: {
        show: true,
        admin: false,
        icon: RiQuestionnaireLine,
        iconHover: RiQuestionnaireFill,
      },
    },
    tellUs: {
      href: "https://tellonym.me/user.669983",
      title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-tellUs-title"),
      nav: {
        show: false,
        admin: false,
        icon: RiChatForwardLine,
        iconHover: RiChatForwardFill,
      },
    },
    editor: {
      href: "/editor",
      title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-editor-title"),
      description: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-editor-description"),
      nav: {
        show: false,
        admin: false,
        icon: RiBookLine,
        iconHover: RiBookFill,
      }
    },
    member: {
      href: "/member",
      title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-member-title"),
      description: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-member-description"),
      nav: {
        show: true,
        admin: false,
        icon: RiGroup2Line,
        iconHover: RiGroup2Fill,
      },
    },
    youtube: {
      href: "https://www.youtube.com/@tcsh_periodicals",
      title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-youtube-title"),
      nav: {
        show: true,
        admin: false,
        icon: RiYoutubeLine,
        iconHover: RiYoutubeFill,
      },
    },
    accounts: {
      href: "/accounts",
      title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-accounts-title"),
      description: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-accounts-description"),
      nav: {
        show: false,
        admin: false,
        icon: RiAccountBoxLine,
        iconHover: RiAccountBoxFill,
      },
      child: {
        signIn: {
          href: "/accounts/signin",
          title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-accounts-signin-title"),
          description: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-accounts-signin-description"),
        },
        posts: {
          href: "/accounts/posts",
          title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-accounts-posts-title"),
          description: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-accounts-posts-description"),
        }
      }
    },
    admin: {
      href: "/admin",
      title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-admin-title"),
      description: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-admin-title"),
      nav: {
        show: true,
        admin: true,
        icon: RiAdminLine,
        iconHover: RiAdminFill,
      },
      child: {
        members: {
          href: "/admin/members",
          title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-admin-members-title"),
          nav: {
            show: true,
            admin: true,
            icon: RiUserSettingsLine,
            iconHover: RiUserSettingsFill
          },
        },
        website: {
          href: "/admin/website",
          title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-admin-website-title"),
          nav: {
            show: true,
            admin: true,
            icon: RiWindow2Line,
            iconHover: RiWindow2Fill
          },
        },
        banner: {
          href: "/admin/slides",
          title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._("webmap-admin-banner-title"),
          nav: {
            show: true,
            admin: true,
            icon: RiSlideshowLine,
            iconHover: RiSlideshowFill
          },
        },
        notification: {
          href: "/admin/notifications",
          title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._('webmap-admin-notification-title'),
          nav: {
            show: true,
            admin: true,
            icon: RiNotification2Line,
            iconHover: RiNotification2Line
          },
        },
        ebooks: {
          href: "/admin/ebooks",
          title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._('webmap-admin-ebooks-title'),
          nav: {
            show: true,
            admin: true,
            icon: RiBookLine,
            iconHover: RiBookFill,
          },
        },
        ideaUrStory: {
          href: "/admin/idea-urstory",
          title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._('webmap-admin-ideaUrStory-title'),
          nav: {
            show: true,
            admin: true,
            icon: RiQuestionnaireLine,
            iconHover: RiQuestionnaireFill,
          },
        }
      }
    },
    policy: {
      href: "/policy",
      title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._('webmap-policy-title'),
      description: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._('webmap-policy-title'),
      nav: {
        show: true,
        admin: false,
        icon: RiLockLine,
        iconHover: RiLock2Fill,
      },
      child: {
        privacy: {
          href: "/policy/privacy",
          title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._('webmap-policy-privacy-title'),
          nav: {
            show: false,
            admin: false,
            icon: RiProfileLine,
            iconHover: RiProfileFill
          },
        },
        cookie: {
          href: "/policy/cookie",
          title: (locale: LangCode) => new i18n<typeof i18nDefault>(locale, "config")._('webmap-policy-cookie-title'),
          nav: {
            show: false,
            admin: false,
            icon: RiFilePaper2Line,
            iconHover: RiFilePaper2Fill
          },
        }
      }
    }
  },
}

export const languages = {
  "en": {
    name: "English",
    code: "en",
    icon: <Image src={EnglishIcon} height={18} width={18} alt="English" />,
  },
  "zh": {
    name: "繁體中文",
    code: "zh",
    icon: <Image src={ChineseIcon} height={18} width={18} alt="繁體中文" />,
  },
  "ja": {
    name: "日本語",
    code: "ja",
    icon: <Image src={JapaneseIcon} height={18} width={18} alt="日本語" />,
  },
  "de": {
    name: "Deutsch",
    code: "de",
    icon: <Image src={GermanIcon} height={18} width={18} alt="Deutsch" />,
  }
};

export const i18nConfig: I18nConfig = {
  defaultLocale: "zh",
  locales: Object.keys(languages),
  languages: languages
};