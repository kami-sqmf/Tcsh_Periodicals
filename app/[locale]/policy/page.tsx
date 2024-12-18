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
      <BreadcrumbServerWrapper args={[{ title: webInfo.webMap.policy.title(locale) as string, href: webInfo.webMap.policy.href, icon: webInfo.webMap.policy.nav.icon }]} />
      <WebAppWrapper className="!flex flex-col space-y-8 md:flex-row md:space-x-8 md:space-y-0 mt-4 h-[75vh] justify-center md:items-center prose-a:md:w-72 prose-a:lg:w-[28rem]" apps={Object.values(webInfo.webMap.policy.child)} lang={locale} />
    </>
  )
}