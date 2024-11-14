import { accountDecoding, auth } from "@/app/api/auth/[...nextauth]/auth"
import { AccessDenied } from "@/components/global/access-denied"
import { PageWrapper } from "@/components/global/page-wrapper"
import { LangCode } from "@/types/i18n"
import { webInfo } from "@/utils/config"
import { getPremissions } from "@/utils/get-firestore"
import { MetadataDefaultGenerator } from "@/utils/head"
import { Metadata } from "next"
import { headers } from "next/headers"
import { notFound } from "next/navigation"

export async function generateMetadata(props: { params: Promise<{ locale: LangCode }> }): Promise<Metadata> {
  const params = await props.params;
  return MetadataDefaultGenerator(webInfo.webMap.admin, await params.locale);
}

export default async function AdminLayout(
  props: {
    children: React.ReactNode,
    params: Promise<{ locale: LangCode; }>
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  const headersList = await headers();
  const header_url = new URL(headersList.get('x-url') || "");
  const session = await auth();
  const account = accountDecoding(session?.account);
  const premissions = session?.account ? await getPremissions(account || null) : false;
  if (!premissions) {
    if (header_url.pathname === "/admin/idea-urstory") return (
      <PageWrapper withNavbar={true} withNotifications={false} lang={await params.locale}>
        <AccessDenied locale={params.locale} text="抱歉，請您先登入您的管理員帳號！" />
      </PageWrapper>
    );
    return notFound();
  }
  if (!premissions.includes("ALL_ALLOWED") && !premissions.includes("ADMIN_OVERVIEW")) return (
    <PageWrapper withNavbar={true} withNotifications={false} lang={await params.locale}>
      <AccessDenied locale={params.locale} />
    </PageWrapper>
  );
  return (
    <PageWrapper withNavbar={true} withNotifications={false} lang={await params.locale}>
      {children}
    </PageWrapper>
  )
}