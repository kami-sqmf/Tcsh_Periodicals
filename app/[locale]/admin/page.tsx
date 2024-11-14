"use server";
import { WebAppWrapper } from "@/components/app/webapp-wrapper";
import { BreadcrumbServerWrapper } from "@/components/breadcumb/breadcumb-server";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";


export default async function Page(props: { params: Promise<{ locale: LangCode }> }) {
  const params = await props.params;
  const locale = params.locale;
  return (
    <>
      <BreadcrumbServerWrapper args={[{ title: webInfo.webMap.admin.title(locale) as string, href: webInfo.webMap.admin.href, icon: webInfo.webMap.admin.nav.icon }]} />
      <WebAppWrapper className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6 max-w-full gap-12" apps={Object.values(webInfo.webMap.admin.child)} lang={locale} />
    </>
  )
}