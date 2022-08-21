export const Global = {
    domain: "kami.tw",
    subdomian: "periodicals",
    webMap: {
        api: {
            name: "api",
            href: "/api",
            child: []
        },
        index: {
            name: "index",
            href: "/",
            title: "首頁",
            child: []
        },
        member: {
            name: "member",
            href: "/member",
            title: "一覽編輯團隊",
            child: []
        },
        tellUs: {
            name: "tellUs",
            href: "https://tellonym.me/user.669983",
            title: "給予匿名回饋",
            child: []
        },
        posts: {
            name: "posts",
            href: "https://www.instagram.com/tcsh_periodicals/",
            title: "更多文章",
            child: []
        },
        postIt: {
            name: "postIt",
            href: "https://linktr.ee/tcsh_periodicals",
            title: "立即投稿",
            child: []
        },
        accounts: {
            name: "accounts",
            href: "/accounts",
            title: "帳號",
            child: {
                signIn: {
                    name: "signIn",
                    href: "/accounts/signin",
                    title: "登入",
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