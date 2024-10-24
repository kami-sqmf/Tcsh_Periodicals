import Image from "next/image";
import { LoginInner } from "./login-inner";
import { PageWrapper } from "./page-wrapper";
import DefaultError from "@/public/assests/defaultProfile.png"
import { LangCode } from "@/types/i18n";

export const AccessDenied = ({ locale, text }: { locale: LangCode; text?: string }) => (
  <div className="h-[50vh] flex flex-col justify-center gap-4 items-center">
    <Image src={DefaultError} className="rounded-full overflow-hidden object-cover bg-background2 w-32 h-32" alt="大頭貼" />
    <div className="flex flex-col justify-center items-center text-main px-4 py-3 border-2 border-main2 rounded">
      <h1 className="text-lg">錯誤 403</h1>
      <h2 className="text-main/80">{text ? text : "您的管理員身份不足查看此頁面！"}</h2>
      {text && <LoginInner userAgent={"Kamibroswer/AKAH AdminSite/2.0.2"} callback="/admin/idea-urstory" lang={locale} />}
    </div>
  </div>
)