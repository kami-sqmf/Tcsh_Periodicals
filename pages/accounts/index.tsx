import { GetStaticProps, InferGetStaticPropsType } from "next"
import { signOut, useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import { useState } from "react"
import { PageWrapper } from "../../components/page-wrapper"
import { Profile } from "../../components/profile"
import { Recomended } from "../../components/recomended"
import { _t } from "../../language/lang"
import { Global } from "../../types/global"
import { getPropsGlobalDB } from "../../utils/get-firestore"

const Modal = dynamic(() => import('../../components/edit-profile-modal').then((res) => res.Modal), {
    ssr: false,
})

const Accounts = ({ data, lang }: InferGetStaticPropsType<typeof getPropsGlobalDB>) => {
    const session = useSession();
    const [operating, setOperating] = useState(false);
    return (
        <div>
            <PageWrapper lang={lang} page={Global.webMap.member} withNavbar={true} operating={operating}>
                <div className="grid grid-cols-1 md:grid-cols-4 h-max items-end">
                    <div className='inline-grid md:col-span-3 mt-4 md:mt-0'><Recomended className="md:col-span-2 mr-2" posts={data.Posts.posts} lang={lang} /></div>
                    <div className='inline-grid mt-2 md:mt-0 md:ml-2 border-2 border-main justify-center overflow-hidden'>
                        {session.status == "authenticated" && <Profile profile={session.data.firestore} lang={lang} owned={true} rounded={false} />}
                        {session.status != "authenticated" && <span className="text-xl text-gray-700 min-h-[532px] text-center py-56 animate-mailFly">{_t(lang).loading}</span>}
                    </div>
                </div>
            </PageWrapper>
            {session.status == "authenticated" ? <Modal lang={lang} setOperate={setOperating} /> : <></>}
            {operating ? <div className='fixed z-[80] top-0 left-0 w-screen h-screen bg-gray-200/40 duration-400 animate-opacity cursor-wait'></div> : <></>}
        </div>
    )
}

export default Accounts

export const getStaticProps: GetStaticProps = getPropsGlobalDB