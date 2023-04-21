import { PageWrapper } from "@/components/global/page-wrapper"
import { LangCode } from "@/types/i18n"
import { webInfo } from "@/utils/config"
import { MetadataDefaultGenerator } from "@/utils/head"
import { Metadata } from "next"

export function generateMetadata({ params }: { params: { locale: LangCode } }): Metadata {
  return MetadataDefaultGenerator(webInfo.webMap.policy, params.locale)
}

export default function PolicyLayout({ children, params }: {
  children: React.ReactNode,
  params: { locale: LangCode }
}) {
  return (
    <PageWrapper withNavbar={true} withNotifications={false} lang={params.locale}>
      {children}
    </PageWrapper>
  )
}