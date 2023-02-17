import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import { ClientSafeProvider, LiteralUnion, getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { PageWrapper } from "../../components/page-wrapper";
import { _t, langCode } from "../../language/lang";
import GoogleLogo from '../../public/signin/GoogleLogo.svg';
import { Global } from "../../types/global";

function SignIn({ providers, lang, userAgent }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <PageWrapper lang={lang} page={Global.webMap.accounts.child.signIn} withNavbar={false} operating={false} className="h-[95vh] flex flex-col justify-center">
            <div className="flex flex-col w-full px-12 sm:w-[420px] items-center rounded bg-background2 py-2 mx-auto">
                <div className="relative w-52 h-10 mt-8 mb-3">
                    <Image className="object-cover" src={Global.logo} fill={true} alt="慈中後生 Logo" />
                </div>
                <LoginInner providers={providers} userAgent={userAgent} callback="/" lang={lang} />
            </div>
        </PageWrapper>

    );
}

export const LoginInner = ({ providers, userAgent, callback, lang }: { providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null; userAgent: string | undefined; callback: string, lang: langCode }) => {
    const router = useRouter();
    const signin = (provider: any) => signIn(provider.id, { callbackUrl: router.query.callbackUrl ? router.query.callbackUrl as string : callback })
    return (
        <div>
            {providers && Object.values(providers).map(((provider: any, key) => (
                <div key={key} className="my-5">
                    {userAgent && userAgent.includes("Instagram") ?
                        <div className="cursor-pointer disabled">
                            <span className="text-sm text-blue-800 group-hover:text-blue-900 font-semibold">抱歉，向不支援 Instagram！<br></br>請使用其他瀏覽器！</span>
                        </div>
                        :
                        <div className="flex flex-col justify-center">
                            <div className="group flex flex-row space-x-2 items-center max-w-max mt-2 mb-2 cursor-pointer" onClick={() => signin(provider)}>
                                <Image src={GoogleLogo} height={20} width={20} className="object-contain" alt="使用 Google 帳號登入" />
                                <span className="text-sm text-blue-800 group-hover:text-blue-900 font-semibold">{_t(lang).login.otherAccountEDU}</span>
                            </div>
                            <span onClick={() => signin(provider)} className="text-xs text-gray-400 text-center cursor-pointer hover:text-gray-500">{_t(lang).login.googleAccountTCSH}</span>
                        </div>
                    }
                </div>
            )))}
        </div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const providers = await getProviders();
    return {
        props: {
            providers,
            lang: (context.locale ? context.locale : "zh") as langCode,
            userAgent: context.req.headers['user-agent']
        },
    };
}

export default SignIn
