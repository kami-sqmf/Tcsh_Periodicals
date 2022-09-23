import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import { getProviders, signIn } from "next-auth/react";
import { UserAgent, useUserAgent } from 'next-useragent';
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, MouseEvent, MouseEventHandler, useRef, useState } from "react";
import { Global } from "../../components/global";
import HeadUni from "../../components/HeadUni";
import { decrypt } from "../../utils/crypt";
import { db } from "../../utils/firebase";

function removeItem<T>(arr: Array<T>, value: T): Array<T> {
    const index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

function SignUp({ providers, uaString, userData }: { providers: any; uaString: string, userData: any }) {
    const [profileAvatar, setProfileAvatar] = useState(userData.avatar);
    const filePickerRef = useRef<HTMLInputElement | null>(null);
    const [inputWarn, setInputWarn] = useState({
        name: "",
        username: "",
        bio: "",
        customTitle: "",
        insta: "",
        class: ""
    })
    const [submitDisable, setSumbitDisable] = useState(["class"])
    const [operating, setOperating] = useState(false)
    const router = useRouter()
    const changeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        if (e.target.files) {
            if (e.target.files[0]) {
                reader.readAsDataURL(e.target.files[0])
            }
            reader.onload = (renderEvent) => {
                if (renderEvent.target) {
                    if (typeof (renderEvent.target.result) == "string") {
                        setProfileAvatar(renderEvent.target.result)
                    }
                }
            }
        }
    }
    const changeListener = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target
        const name = target.name as "name" | "username" | "bio" | "customTitle" | "insta" | "class"
        const value = target.value
        let warnMessage = ""
        switch (name) {
            case "name":
                value.length > 4 ? warnMessage = "姓名限制為 4 字元以下！若你的名字超過 4 字元，請輸入暱稱！" : warnMessage = ""
                break;
            case "bio":
                value.length > 64 ? warnMessage = "自我介紹太多字了！！ （最高 64 字元）" : warnMessage = ""
                break;
            case "class":
                value.match(/^[J][1 | 2 | 3][1 | 2 | 3 | 4 | 5 | 6 | 7]$/) || value.match(/^[S][1 | 2 | 3][1 | 2 | 3 | 4 | 5 ]$/) || value == "Teacher" ? warnMessage = "" : warnMessage = "班級格式錯誤 eg: J11, S11"
                break;
            case "customTitle":
                value.length > 18 ? warnMessage = "自我介紹標題太多字了！！ （最高 18 字元）" : warnMessage = ""
                break;
            case "insta":
                !value.match(/^(?=.{1,42}$)(?![_.])(?!.*([.]{2}|[_]{2}))[a-zA-Z0-9._]+(?<![_.])$/) ? warnMessage = "請輸入正確的 Instagram 帳號！" : warnMessage = ""
                break;
            case "username":
                value.length > 16 ? warnMessage = "用戶名稱最多只能有 16 個字" : warnMessage = ""
                break;
            default:
                break;
        }
        if (value.length == 0) {
            if (name == "name" || "username" || "class") {
                warnMessage = "請輸入資料"
            }
        }
        if (!warnMessage) {
            userData[name] = value
            const disable = removeItem(submitDisable, name)
            setSumbitDisable(disable)
        } else {
            if ((name != "name" || "username" || "class") && submitDisable.indexOf(name) < 0) {
                const disable = submitDisable
                disable.push(name)
                setSumbitDisable(disable)
            }
        }
        const newWarn = { ...inputWarn };
        newWarn[name] = warnMessage
        setInputWarn(newWarn)
    }
    const submitListener = async (e: MouseEvent<HTMLButtonElement>) => {
        setOperating(true)
        const res = await addDoc(collection(db, "Accounts"), userData)
        setOperating(false)
        router.replace("/accounts/signin")
    }
    return (
        <div className="relative flex justify-center items-center w-full bg-background min-h-screen py-24">
            <HeadUni title={Global.webMap.accounts.child.signIn.title} description="登入慈中後生！" pages={Global.webMap.accounts.child.signIn.href} />
            <div className="flex flex-col w-full px-12 sm:w-[350px] items-center bg-background2/80 sm:border border-gray-200 py-8">
                <h1 className="font-bold text-2xl mb-8 text-main/70">註冊慈中後生帳號</h1>
                <div className="relative w-[88px] h-[88px] rounded-full overflow-hidden group cursor-pointer" onClick={() => filePickerRef.current!.click()}>
                    <Image width={88} height={88} src={profileAvatar} objectFit="contain" alt="你的大大大頭貼！" />
                    <div className='absolute opacity-0 group-hover:opacity-100 bottom-0 w-full h-6 bg-gray-600 bg-opacity-75 text-white text-xs text-center py-1 transition-opacity'>更換</div>
                </div>
                <input type={"file"} hidden ref={filePickerRef} onChange={changeAvatar}></input>
                <div className="my-5 space-y-1">
                    <div className="relative w-[268px]">
                        <input type="text" name="name" disabled defaultValue={userData.name} onChange={changeListener} className="cursor-not-allowed block rounded-sm w-full h-[38px] px-3 pt-5 border border-gray-200 text-xs text-gray-800 bg-gray-100 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " />
                        <label htmlFor="name" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">全名</label>
                        {inputWarn.name && <p className='text-xs text-red-500 px-3 my-0.5 -mb-1'>{inputWarn.name}</p>}
                    </div>
                    <div className="relative w-[268px]">
                        <input type="text" name="username" defaultValue={userData.name} onChange={changeListener} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-gray-200 text-xs text-gray-800 bg-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " />
                        <label htmlFor="username" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">用戶名稱</label>
                        {inputWarn.username && <p className='text-xs text-red-500 px-3 my-0.5 -mb-1'>{inputWarn.username}</p>}
                    </div>
                    <div className="relative w-[268px]">
                        <input type="text" name="class" defaultValue={userData.class} onChange={changeListener} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-gray-200 text-xs text-gray-800 bg-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " />
                        <label htmlFor="class" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">班級 (J11, S11)</label>
                        {inputWarn.class && <p className='text-xs text-red-500 px-3 my-0.5 -mb-1'>{inputWarn.class}</p>}
                    </div>
                    <div className="relative w-[268px]">
                        <input type="text" name="customTitle" defaultValue={"自我介紹："} onChange={changeListener} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-gray-200 text-xs text-gray-800 bg-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " />
                        <label htmlFor="customTitle" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">自我介紹標題 (非必填)</label>
                        {inputWarn.customTitle && <p className='text-xs text-red-500 px-3 my-0.5 -mb-1'>{inputWarn.customTitle}</p>}
                    </div>
                    <div className="relative w-[268px]">
                        <input type="text" name="bio" defaultValue={userData.bio} onChange={changeListener} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-gray-200 text-xs text-gray-800 bg-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " />
                        <label htmlFor="bio" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">自我介紹 (非必填)</label>
                        {inputWarn.bio && <p className='text-xs text-red-500 px-3 my-0.5 -mb-1'>{inputWarn.bio}</p>}
                    </div>
                    <div className="relative w-[268px]">
                        <input type="text" name="insta" defaultValue={userData.insta} onChange={changeListener} className="block rounded-sm w-full h-[38px] px-3 pt-5 border border-gray-200 text-xs text-gray-800 bg-gray-50 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer" placeholder=" " />
                        <label htmlFor="insta" className="absolute text-xs text-gray-400 duration-300 transform -translate-y-2.5 scale-75 top-3 z-10 origin-[0] left-3 peer-focus:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5">Instagram 帳戶名稱 (非必填)</label>
                        {inputWarn.insta && <p className='text-xs text-red-500 px-3 my-0.5 -mb-1'>{inputWarn.insta}</p>}
                    </div>
                    <button disabled={submitDisable.length > 0} onClick={submitListener} className="w-[268px] h-8 bg-blue-500 disabled:bg-blue-200 text-sm text-white rounded-[4px] !mt-4 mb-2">註冊</button>
                </div>
            </div>
            {operating ? <div className='fixed z-[80] top-0 left-0 w-screen h-screen bg-gray-200/40 duration-400 animate-opacity cursor-wait'><div className="top-1/2 left-1/2 translate-x-1/2 translate-y-1/2 font-bold flex flex-col"><p className="text-3xl">註冊中.....</p><p className="text-xl">註冊成功後請再次登入！</p></div></div> : <></>}
        </div>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const providers = await getProviders();
    if (context.query.i && context.query.c) {
        if (!Array.isArray(context.query.i) && !Array.isArray(context.query.c)) {
            const result = await getDoc(doc(db, `Temp/${decrypt(context.query.i, context.query.c)}`))
            if (result.exists()) {
                return {
                    props: {
                        providers,
                        uaString: context.req.headers['user-agent'],
                        userData: result.data()
                    },
                };
            } else {
                context.res.writeHead(307, { Location: "/?error=Oau)Dl,waJ" })
                context.res.end()
            }
        }
        else {
            context.res.writeHead(307, { Location: "/?error=Oau)Dl,waJ" })
            context.res.end()
        }
    } else {
        context.res.writeHead(307, { Location: "/?error=Oau)Dl,waJ" })
        context.res.end()
    }
}

export default SignUp