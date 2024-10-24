"use server";
import { IdeaUrStroryContentWrapper } from "@/components/idea/idea-content-wrapper";
import { IdeaNavbarWrapper } from "@/components/idea/idea-navbar-wrapper";
import { IdeaUrStoryConfig } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { getDocFromCacheOrServer } from "@/utils/get-firestore";
import { MetadataDefaultGenerator } from "@/utils/head";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { locale: LangCode } }): Promise<Metadata> {
  const locale = params.locale;
  const config = await getDocFromCacheOrServer<IdeaUrStoryConfig>("idea-urstory", "config");
  return MetadataDefaultGenerator({
    ...webInfo.webMap.ideaUrStory,
    title: () => config.name
  }, locale)
}

async function getIdeaUrStoryConfig() {
  const config = await getDocFromCacheOrServer<IdeaUrStoryConfig>("idea-urstory", "config");
  return config;
}

export default async function Page({ params }: { params: { locale: LangCode } }) {
  const locale = params.locale;
  const config = await getIdeaUrStoryConfig();
  return (
    <>
      <IdeaNavbarWrapper lang={locale} name={config.name} version={config.version} />
      <IdeaUrStroryContentWrapper config={config} lang={locale} className="mt-3" />
    </>
  )
}