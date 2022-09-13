import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import { Global } from "../../components/global";
import HeadUni from "../../components/HeadUni";
function SignIn({ providers }: { providers: any }) {
  return (
    <div className="relative flex justify-center items-center w-full bg-background min-h-screen py-24">
      <HeadUni title={Global.webMap.accounts.child.signIn.title} description="登入慈中後生！" pages={Global.webMap.accounts.child.signIn.href} />
      <div>
        <div className="flex flex-col w-full sm:w-[350px] items-center bg-white/80 sm:border border-gray-200 py-2">
          <div className="relative w-52 h-10 mt-8 mb-3 px-">
            <Image layout="fill" src={Global.logo} objectFit="cover" alt="後生 LOGO" />
          </div>
          {Object.values(providers).map(((provider: any) => (
            <div className="my-5">
              <div className="group flex flex-row space-x-2 items-center max-w-max mt-2 mb-3 cursor-pointer" onClick={() => signIn(provider.id, { callbackUrl: '/' })}>
                <Image src="/signin/GoL.svg" height={20} width={20} objectFit="contain" alt="使用 Google 帳號登入" />
                <span className="text-sm text-blue-800 group-hover:text-blue-900 font-semibold">使用 慈中 Gooogle 帳號登入</span>
              </div>
            </div>
          )))}
        </div>
      </div>
      {/* <Modal isOpen={modalOpen} setIsOpen={setModalOpen} modalContent={modalContent} /> */}
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

export default SignIn