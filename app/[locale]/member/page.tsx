"use server";
import { MembersContentWrapper } from "@/components/member/member-content-wrapper";
import { LangCode } from "@/types/i18n";


export default async function Page({ params }: { params: { locale: LangCode } }) {
  const locale = params.locale;
  return (
    <>
      <MembersContentWrapper lang={locale} />
    </> 
  )
}