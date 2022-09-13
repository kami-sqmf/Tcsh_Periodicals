import { atom } from "recoil";
import { canChangeProfile } from "../types/firestore";

export const accountIndexModalState = atom({
    key: "isOpen",
    default: false
})

export const accountIndexModalSection = atom({
    key: "modalSection",
    default: ["avatar"] as canChangeProfile[],
})

export const accountIndexModalConfirm = atom({
    key: "modalConfirm",
    default: true,
})