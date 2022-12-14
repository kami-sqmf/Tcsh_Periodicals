import { atom } from "recoil";
import { Account, AccountsUni } from "../types/firestore";

export const profileModal = atom({
    key: "modalOpen",
    default: false
})

export const profileModalConfirm = atom({
    key: "modalConfirm",
    default: true
})

export const profileModalSelection = atom({
    key: "option",
    default: ["bio"] as (keyof Account)[]
})

export const profileModalUser = atom({
    key: "profile",
    default: {
        type: "Account",
        data: {
            avatar: "",
            bio: "",
            class: null,
            customTitle: "",
            email: "",
            insta: "",
            name: "",
            username: "",
        }
    } as AccountsUni
})