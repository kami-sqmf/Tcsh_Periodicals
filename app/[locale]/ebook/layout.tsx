"use server";
import { PageWrapper } from "@/components/global/page-wrapper"
import { LangCode } from "@/types/i18n"
import { webInfo } from "@/utils/config"
import { MetadataDefaultGenerator } from "@/utils/head"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: { locale: LangCode } }): Promise<Metadata> {
  return MetadataDefaultGenerator(webInfo.webMap.ebook, await params.locale)
}

export default async function EbookLayout({ children, params }: {
  children: React.ReactNode,
  params: { locale: LangCode }
}) {
  return (
    <PageWrapper withNavbar={true} withNotifications={true} lang={await params.locale}>
      {children}
    </PageWrapper>
  )
}