"use server";
const _ = require('lodash');
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { Profile } from "@/components/account/profile";
import { BreadcrumbServerWrapper } from "@/components/breadcumb/breadcumb-server";
import { Loading } from "@/components/global/loading";
import { PageWrapper } from "@/components/global/page-wrapper";
import { RecommendWrapper } from "@/components/recomend/recommend-wrapper";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { MetadataDefaultGenerator } from "@/utils/head";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata(props: { params: Promise<{ locale: LangCode }> }): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  return MetadataDefaultGenerator(webInfo.webMap.accounts, locale)
}

export default async function Page(props: { params: Promise<{ locale: LangCode }> }) {
  const params = await props.params;
  const lang = params.locale;
  const session = await auth();
  if (!session?.account) {
    redirect('/accounts/signin');
  }
  return (
    <PageWrapper withNavbar={true} withNotifications={false} lang={lang}>
      <BreadcrumbServerWrapper args={[{ title: webInfo.webMap.accounts.title(lang) as string, href: webInfo.webMap.accounts.href, icon: webInfo.webMap.accounts.nav.icon }]} />
      <div className="grid grid-cols-1 md:grid-cols-4 h-max items-end">
        <Suspense fallback={<div className="min-h-[50vh] w-full flex justify-center items-center"><Loading className="" text="推薦資訊載入中" /></div>}>
          <div className='inline-grid md:col-span-3 mt-4 md:mt-0'>
            <RecommendWrapper className="md:col-span-2 mr-2" lang={lang} />
          </div>
        </Suspense>
        <Suspense fallback={<div className="min-h-[50vh] w-full flex justify-center items-center"><Loading className="" text="帳戶資訊載入中" /></div>}>
          <div className='inline-grid mt-2 md:mt-0 md:ml-2 border-2 border-main justify-center overflow-hidden'>
            <Profile user={session.account} lang={lang} />
          </div>
        </Suspense>
      </div>
    </PageWrapper>
  );
}
