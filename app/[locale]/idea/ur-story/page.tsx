import { IdeaUrStroryContentWrapper } from "@/components/idea/idea-content-wrapper";
import { IdeaNavbarWrapper } from "@/components/idea/idea-navbar-wrapper";
import { IdeaUrStoryConfig } from "@/types/firestore";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { getDocFromCacheOrServer } from "@/utils/get-firestore";
import { MetadataDefaultGenerator } from "@/utils/head";
import { Metadata } from "next";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { locale: LangCode } }): Promise<Metadata> {
  const config = await getDocFromCacheOrServer<IdeaUrStoryConfig>("idea-urstory", "config");
  return MetadataDefaultGenerator({
    ...webInfo.webMap.ideaUrStory,
    title: () => config.name
  }, params.locale)
}

async function getIdeaUrStoryConfig() {
  const config = await getDocFromCacheOrServer<IdeaUrStoryConfig>("idea-urstory", "config");
  return config;
}

export default async function IdeaUrStory({ params }: { params: { locale: LangCode } }) {
  const config = await getIdeaUrStoryConfig();
  return (
    <>
      <IdeaNavbarWrapper lang={params.locale} name={config.name} version={config.version} />
      <IdeaUrStroryContentWrapper config={config} lang={params.locale} className="mt-3" />
    </>
  )
}