import { accountDecoding, auth } from "@/app/api/auth/[...nextauth]/auth";
import { AccessDenied } from "@/components/global/access-denied";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { getPremissions } from "@/utils/get-firestore";
import { MetadataDefaultGenerator } from "@/utils/head";
import { Metadata } from "next";

export async function generateMetadata(props: { params: Promise<{ locale: LangCode }> }): Promise<Metadata> {
  const params = await props.params;
  return MetadataDefaultGenerator(webInfo.webMap.admin.child.banner, await params.locale)
}

export default async function AdminNotificationsLayout(
  props: {
    children: React.ReactNode,
    params: Promise<{ locale: LangCode }>
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  const session = await auth();
  const account = accountDecoding(session?.account);
  const premissions = session?.account ? await getPremissions(account) : false;
  if (!premissions || (!premissions.includes("ALL_ALLOWED") && !premissions.includes("SLIDE_READABLE"))) return <AccessDenied locale={params.locale} />;

  return children;
}