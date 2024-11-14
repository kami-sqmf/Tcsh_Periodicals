"use server";
import { MembersContentWrapper } from "@/components/member/member-content-wrapper";
import { LangCode } from "@/types/i18n";


export default async function Page(props: { params: Promise<{ locale: LangCode }> }) {
  const params = await props.params;
  const locale = params.locale;
  return (
    <>
      <MembersContentWrapper lang={locale} />
    </> 
  )
}