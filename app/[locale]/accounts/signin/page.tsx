import { LoginInner } from "@/components/global/login-inner";
import { PageWrapper } from "@/components/global/page-wrapper";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { MetadataDefaultGenerator } from "@/utils/head";
import { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";

export async function generateMetadata(props: { params: Promise<{ locale: LangCode }> }): Promise<Metadata> {
  const params = await props.params;
  return MetadataDefaultGenerator(webInfo.webMap.accounts.child.signIn, await params.locale)
}


export default async function Page(props: { params: Promise<{ locale: LangCode }> }) {
  const params = await props.params;
  const locale = params.locale;
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  return (
    <PageWrapper lang={locale} withNavbar={false} operating={false} className="h-[95vh] flex flex-col justify-center">
      <div className="flex flex-col w-full px-12 sm:w-[420px] items-center rounded bg-background2 py-2 mx-auto">
        <div className="relative w-52 h-10 mt-8 mb-3">
          <Image className="object-cover" src={webInfo.logo} fill={true} alt="慈中後生 Logo" />
        </div>
        <LoginInner userAgent={userAgent || null} callback="/" lang={locale} />
      </div>
    </PageWrapper>

  );
}
