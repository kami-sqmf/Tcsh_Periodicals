"use server";
import { EbookContentWrapper } from "@/components/ebook/ebook-content-wrapper";
import { LangCode } from "@/types/i18n";


export default async function Page({ params }: { params: { locale: LangCode } }) {
  // const t = new i18n<typeof i18nDefault>(params.locale, "index");
  return (
    <>
      {/* <BreadcrumbServerWrapper args={[{ title: webInfo.webMap.ebook.title(params.locale) as string, href: webInfo.webMap.ebook.href, icon: webInfo.webMap.ebook.nav.icon }]} /> */}
      <EbookContentWrapper lang={await params.locale} className="mt-6" />
    </>
  )
}