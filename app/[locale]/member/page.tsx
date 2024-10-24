"use server";
import { MembersContentWrapper } from "@/components/member/member-content-wrapper";
import { LangCode } from "@/types/i18n";


export default async function Page({ params }: { params: { locale: LangCode } }) {
  // const t = new i18n<typeof i18nDefault>(params.locale, "index");
  return (
    <>
      <MembersContentWrapper lang={await params.locale} />
    </> 
  )
}