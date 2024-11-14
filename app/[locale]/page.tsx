'use server'
import { AboutWrapper } from "@/components/about/about-wrapper";
import { BookshelfWrapper } from "@/components/bookshelf/bookshelf-wrapper";
import { PageWrapper } from "@/components/global/page-wrapper";
import { RecommendWrapper } from "@/components/recomend/recommend-wrapper";
import { SlideWrapper } from "@/components/slide/slide-wrapper";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { MetadataDefaultGenerator } from "@/utils/head";
import { Metadata } from "next";

export async function generateMetadata(props: { params: Promise<{ locale: LangCode }> }): Promise<Metadata> {
  const params = await props.params;
  return MetadataDefaultGenerator(webInfo.webMap.index, await params.locale)
}

export default async function Page(props: { params: Promise<{ locale: LangCode }> }) {
  const params = await props.params;
  const locale = params.locale;
  return (
    <PageWrapper withNavbar={true} withNotifications={true} lang={locale}>
      <SlideWrapper className="!mt-6 md:mt-16" />
      <BookshelfWrapper className="md:col-span-2" lang={locale} />
      <div className="grid grid-cols-1 md:grid-cols-3 mt-9 md:mt-16 justify-end items-end">
        <RecommendWrapper className="md:col-span-2" lang={locale} />
        <AboutWrapper className="md:ml-11" lang={locale} />
      </div>
    </PageWrapper>
  )
}