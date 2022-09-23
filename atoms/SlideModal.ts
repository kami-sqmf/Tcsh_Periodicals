import { Session } from "next-auth";
import { atom } from "recoil";
import { canChangeProfile } from "../types/firestore";

export const nowSlideState = atom({
    key: "nowSlide",
    default: 0
})