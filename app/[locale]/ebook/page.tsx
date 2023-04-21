import { EbookContentWrapper } from "@/components/ebook/ebook-content-wrapper";
import { LangCode } from "@/types/i18n";


export default function Ebook({ params }: { params: { locale: LangCode } }) {
  // const t = new i18n<typeof i18nDefault>(params.locale, "index");
  return (
    <>
      {/* <BreadcrumbServerWrapper args={[{ title: webInfo.webMap.ebook.title(params.locale) as string, href: webInfo.webMap.ebook.href, icon: webInfo.webMap.ebook.nav.icon }]} /> */}
      {/* @ts-expect-error Server Component */}
      <EbookContentWrapper lang={params.locale} className="mt-6" />
    </>
  )
}