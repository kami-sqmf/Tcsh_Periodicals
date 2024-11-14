"use server";
import { PageWrapper } from "@/components/global/page-wrapper"
import { LangCode } from "@/types/i18n"
import { webInfo } from "@/utils/config"
import { MetadataDefaultGenerator } from "@/utils/head"
import { Metadata } from "next"

export async function generateMetadata(props: { params: Promise<{ locale: LangCode }> }): Promise<Metadata> {
  const params = await props.params;
  return MetadataDefaultGenerator(webInfo.webMap.member, await params.locale)
}

export default async function MemberLayout(
  props: {
    children: React.ReactNode,
    params: Promise<{ locale: LangCode }>
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  return (
    <PageWrapper withNavbar={true} withNotifications={true} lang={await params.locale}>
      {children}
    </PageWrapper>
  )
}