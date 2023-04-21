import { LangCode } from "@/types/i18n";
import { WebMapIndex } from "@/types/webmap";
import { Metadata } from "next";
import { Author } from "next/dist/lib/metadata/types/metadata-types";
import { webInfo } from "./config";

const url = `https://${webInfo.subdomian ? webInfo.subdomian + "." : ""}${webInfo.domain}/`;

export const MetadataDefaultGenerator = (pageInfo: WebMapIndex<"Parent"> | WebMapIndex<"Child">, lang: LangCode, extendMetadata?: {
  imageUrl?: string;
  robots?: { index: false; follow: boolean; };
  authors?: null | Author | Array<Author>;
  keywords?: string[];
}): Metadata => {
  return {
    metadataBase: new URL(url),
    title: `${pageInfo.title(lang) as string} • ${lang == "zh" ? "慈中後生 - 文學季刊" : "Tzuchi Senior Periodicals"}`,
    description: (pageInfo.description ? pageInfo.description(lang) : webInfo.webMap.index.description(lang)) as string,
    applicationName: `${lang == "zh" ? "慈中後生 - 文學季刊" : "Tzuchi Senior Periodicals"}`,
    keywords: extendMetadata?.keywords ? ["慈中後生", "季刊", "文學", "校刊", "慈濟中學", "慈大附中", "高中", "國中", ...extendMetadata.keywords] : ["慈中後生", "季刊", "文學", "校刊", "慈濟中學", "慈大附中", "高中", "國中"],
    viewport: { width: "device-width", initialScale: 1 },
    creator: "慈中後生團隊",
    robots: extendMetadata?.robots || { index: true, follow: true },
    alternates: { canonical: new URL(`${url}${lang}${pageInfo.href}`), languages: { "x-default": `${url}zh${pageInfo.href}`, "zh-TW": `${url}zh${pageInfo.href}`, "en-US": `${url}en${pageInfo.href}`, "de-DE": `${url}de${pageInfo.href}` } },
    manifest: "/site.webmanifest",
    openGraph: {
      type: "website",
      url: `${url}${lang}${pageInfo.href}`,
      title: `${pageInfo.title(lang) as string} • ${lang == "zh" ? "慈中後生" : "Tzuchi Senior Periodicals"}`,
      description: (pageInfo.description ? pageInfo.description(lang) : webInfo.webMap.index.description(lang)) as string,
      siteName: `${lang == "zh" ? "慈中後生 - 文學季刊" : "Tzuchi Senior Periodicals"}`,
      images: [{
        url: extendMetadata?.imageUrl ? extendMetadata?.imageUrl : `${url}/logo.jpg`,
      }],
    },
  };
}