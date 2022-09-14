import { RiAccountBoxFill, RiAccountBoxLine, RiAdminFill, RiAdminLine, RiChatForwardFill, RiChatForwardLine, RiEditFill, RiEditLine, RiGroup2Fill, RiGroup2Line, RiHome2Fill, RiHome2Line, RiHome8Fill, RiHome8Line, RiHomeFill, RiHomeLine, RiInstagramFill, RiInstagramLine } from "react-icons/ri";

export const Global = {
    domain: "kami.tw",
    subdomian: "periodicals",
    webMap: {
        api: {
            name: "api",
            href: "/api",
            title: "節點",
            nav: {
                show: false,
                admin: true,
                icon: null,
                iconOpen: null,
            },
            child: []
        },
        index: {
            name: "index",
            href: "/",
            title: "首頁",
            nav: {
                show: true,
                admin: false,
                icon: RiHome2Line,
                iconOpen: RiHome2Fill,
            },
            child: []
        },
        member: {
            name: "member",
            href: "/member",
            title: "一覽編輯團隊",
            nav: {
                show: true,
                admin: false,
                icon: RiGroup2Line,
                iconOpen: RiGroup2Fill,
            },
            child: []
        },
        tellUs: {
            name: "tellUs",
            href: "https://tellonym.me/user.669983",
            title: "給予匿名回饋",
            nav: {
                show: true,
                admin: false,
                icon: RiChatForwardLine,
                iconOpen: RiChatForwardFill,
            },
            child: []
        },
        posts: {
            name: "posts",
            href: "https://www.instagram.com/tcsh_periodicals/",
            title: "更多文章",
            nav: {
                show: true,
                admin: false,
                icon: RiInstagramLine,
                iconOpen: RiInstagramFill,
            },
            child: []
        },
        postIt: {
            name: "postIt",
            href: "https://linktr.ee/tcsh_periodicals",
            title: "立即投稿",
            nav: {
                show: true,
                admin: false,
                icon: RiEditLine,
                iconOpen: RiEditFill,
            },
            child: []
        },
        accounts: {
            name: "accounts",
            href: "/accounts",
            title: "帳號",
            nav: {
                show: true,
                admin: false,
                icon: RiAccountBoxLine,
                iconOpen: RiAccountBoxFill,
            },
            child: {
                signIn: {
                    name: "signIn",
                    href: "/accounts/signin",
                    title: "登入",
                    child: []
                },
            }
        },
        admin: {
            name: "admin",
            href: "/admin",
            title: "管理員",
            nav: {
                show: true,
                admin: true,
                icon: RiAdminLine,
                iconOpen: RiAdminFill,
            },
            child: {
                members: {
                    name: "members",
                    href: "/admin/members",
                    title: "管理團隊",
                    child: []
                },
            }
        }
    },
    insta: "tcsh_periodicals",
    email: "s11@tcsh.hlc.edu.tw",
    logo: "/logo.jpg",
}

// webMap: [{
//     name: "api",
//     href: "/api",
//     child: []
// }, {
//     name: "index",
//     href: "/",
//     child: []
// },{
//     name: "member",
//     href: "/member",
//     child: []
// },{
//     name: "tellUs",
//     href: "/tellus",
//     child: []
// },{
//     name: "posts",
//     href: "/posts",
//     child: []
// },{
//     name: "postIt",
//     href: "/postit",
//     child: []
// }],