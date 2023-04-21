'use client';
import GoogleLogo from '@/public/signin/GoogleLogo.svg';
import i18nDefault from '@/translation/accounts/zh.json';
import { LangCode } from '@/types/i18n';
import i18n from "@/utils/i18n";
import { signIn } from 'next-auth/react';
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const LoginInner = ({ userAgent, callback, lang }: { userAgent: string | null; callback: string, lang: LangCode }) => {
  const querys = useSearchParams();
  const queryCallbackUrl = querys!.get("callbackUrl");
  const signin = () => signIn("google", { callbackUrl: queryCallbackUrl ? queryCallbackUrl : callback });
  const t = new i18n<typeof i18nDefault>(lang, "accounts");
  return (
    <div className="my-5">
      {userAgent && userAgent.includes("Instagram") ?
        <div className="cursor-pointer disabled">
          <span className="text-sm text-blue-800 group-hover:text-blue-900 font-semibold">{t._("instagram-unsuported")}</span>
        </div>
        :
        <div className="flex flex-col justify-center">
          <div className="group flex flex-row space-x-2 items-center max-w-max mt-2 mb-2 cursor-pointer" onClick={() => signin()}>
            <Image src={GoogleLogo} height={20} width={20} className="object-contain" alt={t._("accounts-login-with-google") as string} />
            <span className="text-sm text-blue-800 group-hover:text-blue-900 font-semibold">{t._("accounts-login-with-google")}</span>
          </div>
        </div>
      }
    </div>
  )
}

export { LoginInner };
