import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PageWrapper } from "@/components/global/page-wrapper"
import { LangCode } from "@/types/i18n"
import { webInfo } from "@/utils/config"
import { isAdmin } from "@/utils/get-firestore"
import { MetadataDefaultGenerator } from "@/utils/head"
import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"

export function generateMetadata({ params }: { params: { locale: LangCode } }): Metadata {
  return MetadataDefaultGenerator(webInfo.webMap.admin, params.locale);
}

export default async function AdminLayout({ children, params }: {
  children: React.ReactNode,
  params: { locale: LangCode }
}) {
  const session = await getServerSession(authOptions);
  if (!session?.firestore || !isAdmin(session?.firestore)) {
    notFound();
  }
  return (
    <PageWrapper withNavbar={true} withNotifications={false} lang={params.locale}>
      {children}
    </PageWrapper>
  )
}