import { collection, getDocs, query, where } from "firebase/firestore";
import { GetStaticPropsContext } from "next";
import { ValueOf } from "next/dist/shared/lib/constants";
import { langCode } from "../language/lang";
import { AccountsUni, DB, GlobalDB, Member } from "../types/firestore";
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
                data: {...result.docs[0].data() as any, uid: result.docs[0].id}
            }
            return res
        }
    }
    return null
}

export function isAdmin(firestore: AccountsUni): boolean {
    if (firestore.type != "Account") {
        return Math.trunc(firestore.data.role / 100) == 5 || firestore.data.role % 100 == 0;
    }
    return false
}