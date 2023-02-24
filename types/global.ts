import { IconType } from "react-icons";
import { RiAccountBoxFill, RiAccountBoxLine, RiAdminFill, RiAdminLine, RiArchiveDrawerFill, RiArchiveDrawerLine, RiBookFill, RiBookLine, RiChatForwardFill, RiChatForwardLine, RiEditFill, RiEditLine, RiFilePaper2Fill, RiFilePaper2Line, RiFileUnknowFill, RiFileUnknowLine, RiGroup2Fill, RiGroup2Line, RiHome2Fill, RiHome2Line, RiLock2Fill, RiLockLine, RiNewspaperFill, RiNewspaperLine, RiNotification2Line, RiProfileFill, RiProfileLine, RiSlideshowFill, RiSlideshowLine, RiUserSettingsFill, RiUserSettingsLine, RiWindow2Fill, RiWindow2Line, RiYoutubeFill, RiYoutubeLine } from "react-icons/ri";
import { _t, langCode } from "../language/lang";
import logo from "../public/logo.jpg";

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
        ebook: {
            href: "/ebook",
            title: (lang: langCode) => _t(lang).webMap.ebook.title,
            description: (lang: langCode) => _t(lang).webMap.ebook.description,
            nav: {
                show: true,
                admin: false,
                icon: RiBookLine,
                iconHover: RiBookFill,
            }
        },
        posts: {
            href: "/posts",
            title: (lang: langCode) => _t(lang).webMap.posts.title,
            nav: {
                show: true,
                admin: false,
                icon: RiNewspaperLine,
                iconHover: RiNewspaperFill,
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
        "idea-urstory": {
            href: "/idea/ur-story",
            title: (lang: langCode) => _t(lang).webMap["idea-urstory"].title,
            nav: {
                show: true,
                admin: false,
                icon: RiFileUnknowLine,
                iconHover: RiFileUnknowFill,
            },
        },
        tellUs: {
            href: "https://tellonym.me/user.669983",
            title: (lang: langCode) => _t(lang).webMap.tellUs.title,
            nav: {
                show: false,
                admin: false,
                icon: RiChatForwardLine,
                iconHover: RiChatForwardFill,
            },
        },
        editor: {
            href: "/editor",
            title: (lang: langCode) => _t(lang).webMap.editor.title,
            description: (lang: langCode) => _t(lang).webMap.editor.description,
            nav: {
                show: false,
                admin: false,
                icon: RiBookLine,
                iconHover: RiBookFill,
            }
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
        youtube: {
            href: "https://www.youtube.com/@tcsh_periodicals",
            title: (lang: langCode) => _t(lang).webMap.youtube.title,
            nav: {
                show: true,
                admin: false,
                icon: RiYoutubeLine,
                iconHover: RiYoutubeFill,
            },
        },
        accounts: {
            href: "/accounts",
            title: (lang: langCode) => _t(lang).webMap.accounts.title,
            description: (lang: langCode) => _t(lang).webMap.accounts.description,
            nav: {
                show: false,
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
                posts: {
                    href: "/accounts/posts",
                    title: (lang: langCode) => "我的投稿",
                    description: (lang: langCode) => _t(lang).webMap.accounts.child.signIn.description,
                }
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
                posts: {
                    href: "/admin/posts",
                    title: (lang: langCode) => _t(lang).webMap.posts.title,
                    nav: {
                        show: true,
                        admin: true,
                        icon: RiNewspaperLine,
                        iconHover: RiNewspaperFill
                    },
                },
                categories: {
                    href: "/admin/categories",
                    title: (lang: langCode) => "文章類別",
                    nav: {
                        show: true,
                        admin: true,
                        icon: RiArchiveDrawerLine,
                        iconHover: RiArchiveDrawerFill
                    },
                },
            }
        },
        policy: {
            href: "/policy",
            title: (lang: langCode) => _t(lang).policy.policy,
            description: (lang: langCode) => _t(lang).policy.policy,
            nav: {
                show: true,
                admin: false,
                icon: RiLockLine,
                iconHover: RiLock2Fill,
            },
            child: {
                privacy: {
                    href: "/policy/privacy",
                    title: (lang: langCode) => _t(lang).policy.privacy,
                    nav: {
                        show: false,
                        admin: false,
                        icon: RiProfileLine,
                        iconHover: RiProfileFill
                    },
                    description: (lang: langCode) => _t(lang).policy.privacy,
                },
                cookie: {
                    href: "/policy/cookie",
                    title: (lang: langCode) => _t(lang).policy.cookie,
                    nav: {
                        show: false,
                        admin: false,
                        icon: RiFilePaper2Line,
                        iconHover: RiFilePaper2Fill
                    },
                    description: (lang: langCode) => _t(lang).policy.cookie,
                }
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