import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { MetadataDefaultGenerator } from "@/utils/head";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { locale: LangCode } }): Promise<Metadata> {
  return MetadataDefaultGenerator(webInfo.webMap.admin.child.notification, await params.locale)
}

export default function AdminNotificationsLayout({ children }: {
  children: React.ReactNode,
  params: { locale: LangCode }
}) {
  return children;
}