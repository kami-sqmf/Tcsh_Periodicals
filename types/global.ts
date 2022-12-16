import { IconType } from "react-icons";
import { RiAccountBoxFill, RiAccountBoxLine, RiAdminFill, RiAdminLine, RiChatForwardFill, RiChatForwardLine, RiEditFill, RiEditLine, RiGroup2Fill, RiGroup2Line, RiHome2Fill, RiHome2Line, RiInstagramFill, RiInstagramLine, RiNotification2Line, RiSlideshowFill, RiSlideshowLine, RiUserSettingsFill, RiUserSettingsLine, RiWindow2Fill, RiWindow2Line } from "react-icons/ri";
import { langCode, _t } from "../language/lang";
import logo from "../public/logo.jpg"

export const Global = {
    domain: "kami.tw",
    subdomian: "periodicals",
    logo: logo,
    webMap: {
        api: {
            href: "/api",
            title: "節點",
            nav: {
                show: false,
                admin: true,
                icon: null,
                iconHover: null,
            },
        },
        index: {
            href: "/",
            title: (lang: langCode) => _t(lang).webMap.index.title,
            description: (lang: langCode) => _t(lang).webMap.index.description,
            nav: {
                show: true,
                admin: false,
                icon: RiHome2Line,
                iconHover: RiHome2Fill,
            },
        },
        member: {
            href: "/member",
            title: (lang: langCode) => _t(lang).webMap.member.title,
            description: (lang: langCode) => _t(lang).webMap.member.description,
            nav: {
                show: true,
                admin: false,
                icon: RiGroup2Line,
                iconHover: RiGroup2Fill,
            },
        },
        tellUs: {
            href: "https://tellonym.me/user.669983",
            title: (lang: langCode) => _t(lang).webMap.tellUs.title,
            nav: {
                show: true,
                admin: false,
                icon: RiChatForwardLine,
                iconHover: RiChatForwardFill,
            },
        },
        posts: {
            href: "https://www.instagram.com/tcsh_periodicals/",
            title: (lang: langCode) => _t(lang).webMap.posts.title,
            nav: {
                show: true,
                admin: false,
                icon: RiInstagramLine,
                iconHover: RiInstagramFill,
            },
        },
        postIt: {
            href: "https://linktr.ee/tcsh_periodicals",
            title: (lang: langCode) => _t(lang).webMap.postIt.title,
            nav: {
                show: true,
                admin: false,
                icon: RiEditLine,
                iconHover: RiEditFill,
            },
        },
        accounts: {
            href: "/accounts",
            title: (lang: langCode) => _t(lang).webMap.accounts.title,
            description: (lang: langCode) => _t(lang).webMap.accounts.description,
            nav: {
                show: true,
                admin: false,
                icon: RiAccountBoxLine,
                iconHover: RiAccountBoxFill,
            },
            child: {
                signIn: {
                    href: "/accounts/signin",
                    title: (lang: langCode) => _t(lang).webMap.accounts.child.signIn.title,
                    description: (lang: langCode) => _t(lang).webMap.accounts.child.signIn.description,
                },
            }
        },
        admin: {
            href: "/admin",
            title: (lang: langCode) => _t(lang).webMap.admin.title,
            description: (lang: langCode) => "管理員",
            nav: {
                show: true,
                admin: true,
                icon: RiAdminLine,
                iconHover: RiAdminFill,
            },
            child: {
                members: {
                    href: "/admin/members",
                    title: (lang: langCode) => _t(lang).webMap.admin.child.members.title,
                    nav: {
                        show: true,
                        admin: true,
                        icon: RiUserSettingsLine,
                        iconHover: RiUserSettingsFill
                    },
                    description: (lang: langCode) => "管理員",
                },
                website: {
                    href: "/admin/website",
                    title: (lang: langCode) => _t(lang).webMap.admin.child.website.title,
                    nav: {
                        show: true,
                        admin: true,
                        icon: RiWindow2Line,
                        iconHover: RiWindow2Fill
                    },
                    description: (lang: langCode) => "管理員",
                },
                banner: {
                    href: "/admin/slides",
                    title: (lang: langCode) => _t(lang).webMap.admin.child.banner.title,
                    nav: {
                        show: true,
                        admin: true,
                        icon: RiSlideshowLine,
                        iconHover: RiSlideshowFill
                    },
                    description: (lang: langCode) => "管理員",
                },
                notification: {
                    href: "/admin/notification",
                    title: (lang: langCode) => _t(lang).webMap.admin.child.notification.title,
                    nav: {
                        show: true,
                        admin: true,
                        icon: RiNotification2Line,
                        iconHover: RiNotification2Line
                    },
                },
            }
        }
    },
}

export interface webInfo {
    href: string,
    title: (lang: langCode) => string,
    description?: (lang: langCode) => string,
    nav?: {
        show: boolean,
        admin: boolean,
        icon: IconType | null,
        iconHover: IconType | null,
    },
}