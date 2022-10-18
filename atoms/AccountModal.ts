import { atom } from "recoil";

export const accountIndexModalState = atom({
    key: "isOpen",
    default: false
})

export const accountIndexModalSection = atom({
    key: "modalSection",
    default: ["avatar"],
})

export const accountIndexModalConfirm = atom({
    key: "modalConfirm",
    default: true,
})

export const adminSelectProfile = atom({
    key: "adminSelectProfile",
    default: undefined as any,
})

export const operatingPage = atom({
    key: "operating",
    default: false,
})