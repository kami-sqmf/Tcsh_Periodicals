import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, use, useState } from "react";
import { PageWrapper } from "../../components/page-wrapper";
import { langCode } from "../../language/lang";
import { Global } from "../../types/global";
import { decrypt } from "../../utils/crypt";
import { addDoc, collection, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { TempUser } from "../../types/firestore";
import { useRouter } from "next/router";

function SignIn({ lang, user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    const [submitReady, setSubmitReady] = useState(false);
    const inputWarn = {
        username: useState(""),
        class: useState(""),
        customTitle: useState(""),
        bio: useState(""),
        insta: useState("")
    }
    const submit = async (e: FormEvent<HTMLFormElement> | any) => {
        e.preventDefault();
        const requiredValueName: ("username" | "class" | "customTitle" | "bio" | "insta")[] = ["username", "class", "customTitle", "bio", "insta"];
        for (const name of requiredValueName) {
            if (!user.data.isSchool && name == "class") continue;
            check(e.target[name], name, "submit");
        }
        for(const warn of Object.values(inputWarn)){
            if(warn[0] != "") return setSubmitReady(false);
        }
        const data = {
            name: e.target.username.value,
            username: user.data.name,
            email: user.data.email,
            avatar: user.data.avatar,
            isSchool: user.data.isSchool,
            class: user.data.isSchool ? e.target.class.value : null,
            customTitle: e.target.customTitle.value || null,
            bio: e.target.bio.value || null,
            insta: e.target.insta.value || null,
        }
        const addAccount = await addDoc(collection(db, "Accounts"), data);
        const deleteTemp = await deleteDoc(doc(db, "Temp", user.id));
        return router.push("/");
    }
    const check = (e: ChangeEvent<HTMLInputElement>, label: "username" | "class" | "customTitle" | "bio" | "insta", isSubmit?: "submit") => {
        let value;
        if (isSubmit) value = (e as any).value;
        else value = e.currentTarget.value;
        switch (label) {
            case "username":
                if (value.match(/[\u3400-\u9FBF]/) && value.length > 5) inputWarn.username[1]("中文名稱不能超過5個字");
                else if (value.length > 30) inputWarn.username[1]("帳號大於30個字");
                else if (value.length === 0) inputWarn.username[1]("請輸入用戶名稱");
                else inputWarn.username[1]("");
                break;
            case "class":
                if (value.match(/^[J][1 | 2 | 3][1 | 2 | 3 | 4 | 5 | 6 | 7]$/) || value.match(/^[S][1 | 2 | 3][1 | 2 | 3 | 4 | 5 ]$/)) inputWarn.class[1]("");
                else inputWarn.class[1]("班級格式錯誤");
                break
            case "customTitle":
                if (value.length >= 18) inputWarn.customTitle[1]("自我介紹不可超過18個字");
                else inputWarn.customTitle[1]("");
                break;
            case "bio":
                if (value.length >= 64) inputWarn.bio[1]("自我介紹不可超過64個字");
                else inputWarn.bio[1]("");
                break;
            case "insta":
                const reg = new RegExp('^(?=.{1,42}$)(?![_.])(?!.*([.]{2}|[_]{2}))[a-zA-Z0-9._]+(?<![_.])$');
                if (value.match(reg)) inputWarn.insta[1]("");
                else inputWarn.insta[1]("Instagram 帳號格式錯誤，請再次檢查");
                break;
        }
        setSubmitReady(true);
    }
    return (
        <PageWrapper lang={lang} page={Global.webMap.accounts.child.signIn} withNavbar={false} operating={false} className="h-[95vh] flex flex-col justify-center">
            <div className="flex flex-col w-full px-12 sm:w-[350px] items-center rounded bg-white/80 py-2 mx-auto">
                <div className="relative w-52 h-10 mt-8 mb-3">
                    <Image className="object-cover" src={Global.logo} fill={true} alt="慈中後生 Logo" />
                </div>
                <div className="my-5">
                    <form className="space-y-2 w-[256px]" onSubmit={submit} autoComplete="off">
                        <div className="relative w-[256px] ">
                            <input type="text" id="username" name="username" onChange={(e) => check(e, "username")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-gray-200 text-xs text-gray-800 bg-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " defaultValue={user.data.username} />
                            <label htmlFor="username" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">用戶名稱</label>
                            {inputWarn.username[0] && <p className='text-xs text-red-500 px-3 -mb-1'>{inputWarn.username[0]}</p>}
                        </div>
                        {user.data.isSchool && <div className="relative w-[256px]">
                            <input type="text" id="class" name="class" onChange={(e) => check(e, "class")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-gray-200 text-xs text-gray-800 bg-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " />
                            <label htmlFor="class" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">班級 （格式：J11, S11）</label>
                            {inputWarn.class[0] && <p className='text-xs text-red-500 px-3 -mb-1'>{inputWarn.class[0]}</p>}
                        </div>}
                        <div className="relative w-[256px]">
                            <input type="text" id="customTitle" name="customTitle" onChange={(e) => check(e, "customTitle")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-gray-200 text-xs text-gray-800 bg-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " />
                            <label htmlFor="customTitle" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">自我介紹標題 （預設：「自我介紹」）</label>
                            {inputWarn.customTitle[0] && <p className='text-xs text-red-500 px-3 -mb-1'>{inputWarn.customTitle[0]}</p>}
                        </div>
                        <div className="relative w-[256px]">
                            <input type="text" id="bio" name="bio" onChange={(e) => check(e, "bio")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-gray-200 text-xs text-gray-800 bg-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " />
                            <label htmlFor="bio" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">自我介紹內容</label>
                            {inputWarn.bio[0] && <p className='text-xs text-red-500 px-3 -mb-1'>{inputWarn.bio[0]}</p>}
                        </div>
                        <div className="relative w-[256px]">
                            <input type="text" id="insta" name="insta" onChange={(e) => check(e, "insta")} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-gray-200 text-xs text-gray-800 bg-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " />
                            <label htmlFor="insta" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">Instagram 帳號</label>
                            {inputWarn.insta[0] && <p className='text-xs text-red-500 px-3 -mb-1'>{inputWarn.insta[0]}</p>}
                        </div>
                        <p className="!mt-4 text-xs text-center text-gray-400"><span>使用我們服務的用戶可能上傳了您的聯絡資料到慈中後生。</span><Link href={'https://www.facebook.com/help/instagram/261704639352628'} className="text-gray-500 opacity-80 font-semibold">瞭解詳情</Link></p>
                        <p className="!mt-4 text-xs text-center text-gray-400"><span>註冊即表示你同意我們的 </span><Link href={'https://help.instagram.com/581066165581870'} className="text-gray-500 opacity-80 font-semibold">服務條款</Link><span> 、 </span><Link href={'https://help.instagram.com/581066165581870'} className="text-gray-500 opacity-80 font-semibold">《隱私政策》</Link><span> 和 </span><Link href={'https://help.instagram.com/581066165581870'} className="text-gray-500 opacity-80 font-semibold">《Cookie 政策》</Link></p>
                        <button disabled={!submitReady} className="w-[268px] h-8 bg-blue-500 disabled:bg-blue-200 text-sm text-white rounded-[4px] !mt-4 mb-2">註冊</button>
                    </form>
                </div>
            </div>
        </PageWrapper>

    );
}

export async function getServerSideProps(context: GetServerSidePropsContext<{ i: string; c: string; }>) {
    if (!context.query) return error("5");
    if (!context.query.i || !context.query.c) return error("6");
    if (typeof (context.query.i) != "string" || typeof (context.query.c) != "string") return error("6");
    const tempId = decrypt(context.query.i, context.query.c);
    const tempData = await getDoc(doc(db, "Temp", tempId));
    if (!tempData.exists()) return error("7");
    return {
        props: {
            lang: (context.locale ? context.locale : "zh") as langCode,
            user: { id: tempData.id, data: tempData.data() as TempUser },
        },
    };
}

const error = (code: string) => {
    return {
        redirect: {
            destination: `/?error=${code}`,
            permanent: false,
        },
    }
}

export default SignIn