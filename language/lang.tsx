import Image from "next/image"
import zh from "./zh"

export const _t = (code: langCode) => {
    const lang: { default: typeof zh } = require(`./${code}`)
    return lang.default
}

export type langCode = "zh" | "en" | "de"

export const langIcons = {
    zh: <Image src="/language/zh.svg" height={18} width={18} />,
    en: <Image src="/language/en.svg" height={18} width={18} />,
    de: <Image src="/language/de.svg" height={18} width={18} />,
}

export const langNames = {
    zh: "中文",
    en: "English",
    de: "Deutsch",
}