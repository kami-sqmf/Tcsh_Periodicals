import { PageWrapper } from "@/components/global/page-wrapper";
import { LangCode } from "@/types/i18n";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import DefaultError from "@/public/assests/defaultProfile.png";

export const metadata: Metadata = {
  title: '錯誤 404',
  description: '抱歉，目前小精靈找不到您想要查看的資源！',
};

export default function NotFound() {
  const cookieStore = cookies();
  const lang = cookieStore.get('prefered_language');
  return (
    <PageWrapper className="overflow-hidden" withNavbar={true} withNotifications={true} lang={lang?.value as LangCode || "zh"}>
      <div className="h-[50vh] flex flex-col justify-center gap-4 items-center">
        <Image src={DefaultError} className="rounded-full overflow-hidden object-cover bg-background2 w-32 h-32" alt="大頭貼" />
        <div className="flex flex-col justify-center items-center text-main px-4 py-3 border-2 border-main2 rounded">
          <h1 className="text-lg">錯誤 404</h1>
          <h2 className="text-main/80">抱歉，目前小精靈找不到您想要查看的資源！</h2>
        </div>
      </div>
    </PageWrapper>
  );
}