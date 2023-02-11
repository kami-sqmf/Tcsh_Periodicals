import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { GetServerSidePropsContext, GetStaticPropsContext } from "next";
import { getProviders, getSession } from "next-auth/react";
import { ValueOf } from "next/dist/shared/lib/constants";
import { langCode } from "../language/lang";
import { AccountsUni, DB, GlobalDB, Member, PostDocument } from "../types/firestore";
import { db } from "./firebase";

export async function getPropsGlobalDB(ctx: GetStaticPropsContext) {
    const lang = await ctx.locale
    return {
        props: {
            data: await getDBObject("Global") as GlobalDB,
            lang: lang ? lang as langCode : "zh"
        },
        revalidate: 900,
    }
}

export async function getProps_Global_Members_DB(ctx: GetStaticPropsContext) {
    const lang = await ctx.locale
    return {
        props: {
            data: await getDBObject("Global") as GlobalDB,
            members: Object.values(await getDBObject("Members") as Member[]).sort((a, b) => a.role - b.role),
            lang: lang ? lang as langCode : "zh"
        },
        revalidate: 900,
    }
}

export async function getProps_PostID_Session(ctx: GetServerSidePropsContext) {
    const lang = await ctx.locale;
    const session = await getSession(ctx.res);
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    return {
        props: {
            session,
            lang: lang ? lang as langCode : "zh",
            postId: ctx.query.pid as string
        },
    }
}

export async function getProps_Session(ctx: GetServerSidePropsContext) {
    const lang = await ctx.locale;
    const session = await getSession(ctx.res);
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    return {
        props: {
            session,
            lang: lang ? lang as langCode : "zh",
        },
    }
}


export async function getProps_Session_OwnPost(ctx: GetServerSidePropsContext) {
    const now = new Date();
    const lang = await ctx.locale;
    const session = await getSession(ctx.res);
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    const docs = await getDocs(query(collection(db, "posts"), where("owner", "==", session.firestore.data.uid)));
    const mappedDocs = docs.docs.flatMap(docu => {
        if (!(docu.data() as PostDocument).data.blocks && !(docu.data() as PostDocument).title) { deleteDoc(doc(db, "posts", docu.id)); return ([]) }
        return JSON.stringify({
            id: docu.id,
            data: docu.data() as PostDocument
        })
    })
    return {
        props: {
            session,
            requestTime: Math.floor(now.getTime() / 1000),
            lang: lang ? lang as langCode : "zh",
            ownPost: mappedDocs
        },
    }
}

export async function getProps_Global_Books_DB(ctx: GetServerSidePropsContext) {
    const lang = await ctx.locale;
    const providers = await getProviders();
    return {
        props: {
            providers,
            data: await getDBObject("Global") as GlobalDB,
            books: Object.values(await getDBObject("books")),
            lang: lang ? lang as langCode : "zh",
            userAgent: ctx.req.headers['user-agent']
        },
    }
}

export async function getDBObject(collectionName: keyof DB): Promise<ValueOf<DB>> {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data: any = {};
    querySnapshot.forEach((doc) => {
        data[doc.id] = doc.data();
    });
    return data
}

export async function getAccount(email: string): Promise<AccountsUni | null> {
    const documents = ["Accounts", "Members"];
    let res: AccountsUni;
    for (const doc of documents) {
        const result = await getDocs(query(collection(db, doc), where("email", "==", email)));
        if (!result.empty) {
            const typeName = (doc == "Accounts") ? "Account" : "Member";
            res = {
                type: typeName,
                data: { ...result.docs[0].data() as any, uid: result.docs[0].id }
            }
            return res
        }
    }
    return null
}

export function isAdmin(firestore: AccountsUni): boolean {
    if (firestore.type != "Member") return false
    return Math.trunc(firestore.data.role / 100) == 5 || firestore.data.role % 100 == 0
}