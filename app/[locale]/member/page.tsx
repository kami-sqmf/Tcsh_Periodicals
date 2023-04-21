import { MembersContentWrapper } from "@/components/member/member-content-wrapper";
import { LangCode } from "@/types/i18n";


export default function Member({ params }: { params: { locale: LangCode } }) {
  // const t = new i18n<typeof i18nDefault>(params.locale, "index");
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <MembersContentWrapper lang={params.locale} />
    </> 
  )
}