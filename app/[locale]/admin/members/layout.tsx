import { LangCode } from "@/types/i18n";
import { webInfo } from "@/utils/config";
import { MetadataDefaultGenerator } from "@/utils/head";
import { Metadata } from "next";

export async function generateMetadata(props: { params: Promise<{ locale: LangCode }> }): Promise<Metadata> {
  const params = await props.params;
  return MetadataDefaultGenerator(webInfo.webMap.admin.child.members, await params.locale)
}

export default function AdminMembersLayout({ children }: { children: React.ReactNode }) {
  return children;
}