import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Global } from "../../types/global";
import { PageWrapper } from "../../components/page-wrapper";
import { langCode } from "../../language/lang";
import GoogleLogo from '../../public/signin/GoogleLogo.svg'

function SignIn({ providers, lang, userAgent }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    return (
        <PageWrapper lang={lang} page={Global.webMap.accounts.child.signIn} withNavbar={false} operating={false} className="h-[95vh] flex flex-col justify-center">
            <div className="flex flex-col w-full px-12 sm:w-[350px] items-center rounded bg-white/80 py-2 mx-auto">
                <div className="relative w-52 h-10 mt-8 mb-3">
                    <Image className="object-cover" src={Global.logo} fill={true} alt="慈中後生 Logo" />
                </div>
                {providers && Object.values(providers).map(((provider: any) => (
                    <div key={provider.id} className="my-5">
                        {userAgent && userAgent.includes("Instagram") ?
                            <div className="cursor-pointer disabled">
                                <span className="text-sm text-blue-800 group-hover:text-blue-900 font-semibold">抱歉，向不支援 Instagram！<br></br>請使用其他瀏覽器！</span>
                            </div>
                            :
                            <div className="flex flex-col justify-center">
                                <div className="group flex flex-row space-x-2 items-center max-w-max mt-2 mb-2 cursor-pointer" onClick={() => signIn(provider.id, { callbackUrl: router.query.callbackUrl ? router.query.callbackUrl as string : '/' })}>
                                    <Image src={GoogleLogo} height={20} width={20} className="object-contain" alt="使用 Google 帳號登入" />
                                    <span className="text-sm text-blue-800 group-hover:text-blue-900 font-semibold">使用 慈中 Gooogle 帳號登入</span>
                                </div>
                                <span onClick={() => signIn(provider.id, { callbackUrl: router.query.callbackUrl ? router.query.callbackUrl as string : '/' })} className="text-xs text-gray-400 text-center cursor-pointer hover:text-gray-500">或是其他教育帳號</span>
                            </div>
                        }
                    </div>
                )))}
            </div>
        </PageWrapper>

    );
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