// import { LogoSVG2 } from '../../components/logo';
// import Navbar from '../../components/navbar';
// import i18nDefault from '../../translation/index/en.json';
import { AboutWrapper } from "@/components/about/about-wrapper";
import { PageWrapper } from "@/components/global/page-wrapper";
import { RecommendWrapper } from "@/components/recomend/recommend-wrapper";
import { SlideWrapper } from "@/components/slide/slide-wrapper";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { MetadataDefaultGenerator } from "@/utils/head";
import { Metadata } from "next";

export function generateMetadata({ params }: { params: { locale: LangCode } }): Metadata {
  return MetadataDefaultGenerator(webInfo.webMap.index, params.locale)
}

export default function Home({ params }: { params: { locale: LangCode } }) {
  // const t = new i18n<typeof i18nDefault>(params.locale, "index");
  return (
    <PageWrapper withNavbar={true} withNotifications={true} lang={params.locale}>
      {/* @ts-expect-error Server Component */}
      <SlideWrapper className="!mt-6 md:mt-16" />
      <div className="grid grid-cols-1 md:grid-cols-3 mt-9 md:mt-16 justify-end items-end">
        {/* @ts-expect-error Server Component */}
        <RecommendWrapper className="md:col-span-2" lang={params.locale} />
        {/* @ts-expect-error Server Component */}
        <AboutWrapper className="md:ml-11" lang={params.locale} />
      </div>
    </PageWrapper>
  )
}