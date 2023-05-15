import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { LoginInner } from "@/components/global/login-inner"
import { PageWrapper } from "@/components/global/page-wrapper"
import DefaultError from "@/public/assests/defaultProfile.png"
import { LangCode } from "@/types/i18n"
import { webInfo } from "@/utils/config"
import { isAdmin } from "@/utils/get-firestore"
import { MetadataDefaultGenerator } from "@/utils/head"
import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { headers } from "next/headers"
import Image from "next/image"
import { notFound } from "next/navigation"

export function generateMetadata({ params }: { params: { locale: LangCode } }): Metadata {
  return MetadataDefaultGenerator(webInfo.webMap.admin, params.locale);
}

export default async function AdminLayout({ children, params }: {
  children: React.ReactNode,
  params: { locale: LangCode }
}) {
  const headersList = headers();
  const header_url = new URL(headersList.get('x-url') || "");
  const session = await getServerSession(authOptions);
  if (!session?.firestore || !isAdmin(session?.firestore)) {
    if (header_url.pathname === "/admin/idea-urstory") {
      return (
        <PageWrapper withNavbar={true} withNotifications={false} lang={params.locale}>
          <div className="h-[50vh] flex flex-col justify-center gap-4 items-center">
            <Image src={DefaultError} className="rounded-full overflow-hidden object-cover bg-background2 w-32 h-32" alt="大頭貼" />
            <div className="flex flex-col justify-center items-center text-main px-4 py-3 border-2 border-main2 rounded">
              <h1 className="text-lg">錯誤 403</h1>
              <h2 className="text-main/80">抱歉，請您先登入您的管理員帳號！</h2>
              <LoginInner userAgent={"Kamibroswer/AKAH AdminSite/2.0.2"} callback="/admin/idea-urstory" lang={params.locale} />
            </div>
          </div>
        </PageWrapper>
      )
    }
    notFound();
  }
  return (
    <PageWrapper withNavbar={true} withNotifications={false} lang={params.locale}>
      {children}
    </PageWrapper>
  )
}