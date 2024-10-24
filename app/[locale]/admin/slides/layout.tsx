import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { AccessDenied } from "@/components/global/access-denied";
import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { getPremissions } from "@/utils/get-firestore";
import { MetadataDefaultGenerator } from "@/utils/head";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { locale: LangCode } }): Promise<Metadata> {
  return MetadataDefaultGenerator(webInfo.webMap.admin.child.banner, await params.locale)
}

export default async function AdminNotificationsLayout({ children, params }: {
  children: React.ReactNode,
  params: { locale: LangCode }
}) {
  const session = await auth();
  const premissions = session?.account ? await getPremissions(session.account) : false;
  if (!premissions || (!premissions.includes("ALL_ALLOWED") && !premissions.includes("SLIDE_READABLE"))) return <AccessDenied locale={params.locale} />;

  return children;
}