import { langCode, _t } from "../language/lang"
import { Class } from "./firestore"

export const MemberRole = {
    1: {
        "id": 0,
        "name": (lang: langCode) => _t(lang).role[1],
    },
    100: {
        "id": 100,
        "name": (lang: langCode) => _t(lang).role[100],
    },
    101: {
        "id": 100,
        "name": (lang: langCode) => _t(lang).role[101],
    },
    102: {
        "name": (lang: langCode) => _t(lang).role[102],
        "id": 101
    },
    200: {
        "name": (lang: langCode) => _t(lang).role[200],
        "id": 200
    },
    201: {
        "name": (lang: langCode) => _t(lang).role[201],
        "id": 201
    },
    203: {
        "name": (lang: langCode) => _t(lang).role[203],
        "id": 201
    },
    202: {
        "name": (lang: langCode) => _t(lang).role[202],
        "id": 202
    },
    300: {
        "name": (lang: langCode) => _t(lang).role[300],
        "id": 300
    },
    301: {
        "name": (lang: langCode) => _t(lang).role[301],
        "id": 301, 
    },
    302: {
        "name": (lang: langCode) => _t(lang).role[302],
        "id": 302,
    },
    400: {
        "name": (lang: langCode) => _t(lang).role[400],
        "id": 400,
    },
    401: {
        "name": (lang: langCode) => _t(lang).role[401],
        "id": 401,
    },
    500: {
        "name": (lang: langCode) => _t(lang).role[500],
        "id": 500
    },
    501: {
        "name": (lang: langCode) => _t(lang).role[501],
        "id": 501
    },
    600: {
        "name": (lang: langCode) => _t(lang).role[600],
        "id": 600,
    },
    601: {
        "name": (lang: langCode) => _t(lang).role[601],
        "id": 601,
    },
    700: {
        "name": (lang: langCode) => _t(lang).role[700],
        "id": 700,
    }
}

export type MemberRoleKey = keyof typeof MemberRole

export type MemberRole = {
    [key in MemberRoleKey]: {
        id: key
        name: string
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
