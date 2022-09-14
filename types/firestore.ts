import { type } from "os";

// Class eg: [J33, S21]
type classLevel = "1" | "2" | "3";
type classIndexJunior = "1" | "2" | "3" | "4" | "5" | "6" | "7";
type classIndexSenior = "1" | "2" | "3" | "4" | "5";
export type Class = `J${classLevel}${classIndexJunior}` | `S${classLevel}${classIndexSenior}` | "Teacher"
export const classParser = function (clas2: Class) {
    if(clas2 == "Teacher") return "老師"
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

// Accounts Firestore
export interface Accounts {
    uid?: string;
    customTitle: string | null;
    username: string | null;
    insta: string | null;
    name: string;
    avatar: string;
    bio: string | null;
    membership: "admin" | "colleague" | "golden" | "starter";
    email: string;
    class: Class | "Teacher";
}

// Role Firestroe
export type RoleNum = 1 | 100 | 101 | 200 | 201 | 202 | 300 | 301 | 302 | 400 | 401 | 500 | 501 | 600 | 601 | 700;

// Members Firestroe
export interface Members {
    name: string;
    uid?: string;
    avatar: string;
    bio: string;
    membership: "admin" | "colleague" | "golden" | "starter";
    email: string;
    role: 100 | 101 | 200 | 201 | 202 | 300 | 301 | 302 | 400 | 401 | 500 | 501 | 600 | 601 | 700;
    class: Class;
    insta: string;
    customTitle: string | null;
}

export type canChangeProfile = "avatar" | "bio" | "name" | "username" | "insta" | "customTitle" | "class"

export function instanceOfMembers(object: any): object is Members {
    return 'role' in object;
}