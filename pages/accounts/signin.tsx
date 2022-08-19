import { getProviders, signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import HeadUni from '../../components/HeadUni';

function Signin({ providers }: { providers: any }) {
  return (
        <div className="bg-white sm:bg-gray-50 flex justify-center min-h-screen items-center py-24">
            <HeadUni type="other" title="登入・Instagram" />
            <div className="w-full sm:w-[350px] flex flex-col items-center">
                <div className="flex flex-col bg-white rounded-sm sm:border border-gray-200 py-2 my-2 items-center -mt-8">
                    <div className="w-44 h-auto mt-8 mb-3">
                        <Image width={176} height={63} src="/InsL.svg" objectFit="contain" alt="山寨 IG" />
                    </div>
                    <form className="flex flex-col items-center mt-6">
                        <input className="w-[268px] h-10 pt-[9px] pb-[8px] px-2 text-[13px] mb-2 border border-gray-200 bg-gray-50 rounded-sm" maxLength={75} type="text" placeholder="手機號碼、用戶名稱或電子郵件地址" />
                        <input className="w-[268px] h-10 pt-[9px] pb-[8px] px-2 text-[13px] mb-2 border border-gray-200 bg-gray-50 rounded-sm" type="text" placeholder="密碼" />
                        <button className="w-[268px] h-8 bg-blue-200 text-sm text-white rounded-[4px] mt-2 mb-2">登入</button>
                        <div className="flex flex-row items-center mt-2 mb-4 mx-10">
                            <div className="h-[1.5px] w-28 bg-gray-200"></div>
                            <span className="mx-4 font-semibold text-sm text-gray-400">或</span>
                            <div className="h-[1.5px] w-28 bg-gray-200"></div>
                        </div>
                        <div className="flex flex-row space-x-2 items-center max-w-max mt-2 mb-3 cursor-pointer" onClick={() => signIn(providers.google.id, { callbackUrl: '/' })}>
                            <Image src="/signin/GoL.svg" height={20} width={20} objectFit="contain" alt="使用 Google 帳號登入" />
                            <span className="text-sm text-blue-900 font-semibold">使用 Google 帳號登入</span>
                        </div>
                        <div className="flex flex-row space-x-2 items-center max-w-max mt-2 mb-3 cursor-pointer" onClick={() => signIn(providers.facebook.id, { callbackUrl: '/' })}>
                            <Image src="/signin/FbL.svg" height={18} width={18} objectFit="contain" alt="使用 Facebook 帳號登入" />
                            <span className="text-sm text-blue-900 font-semibold">使用 Facebook 帳號登入</span>
                        </div>
                        <span className="text-xs text-blue-900 mt-2 mb-4 cursor-pointer">忘記密碼？</span>
                    </form>
                </div>
                <div className="bg-white rounded-sm sm:border border-gray-200 mt-2 w-full h-16 flex flex-row items-center justify-center">
                    <span className="font-light">沒有帳號嗎？</span>
                    <span onClick={() => { }} className="text-blue-400 font-bold cursor-pointer">註冊</span>
                </div>
                <p className="my-6 font-light">下載應用程式。</p>
                <div className="flex flex-row space-x-2">
                    <div><Link href="https://apps.apple.com/app/instagram/id389801252"><Image src="/signin/ApD.png" className="cursor-pointer" width={135} height={40} objectFit="contain" alt="iOS下載" /></Link></div>
                    <div><Link href="https://play.google.com/store/apps/details?id=com.instagram.android"><Image src="/signin/AnD.png" className="cursor-pointer" width={135} height={40} objectFit="contain" alt="Andriod下載" /></Link></div>
                </div>
            </div>
        </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}

export default Signin;
