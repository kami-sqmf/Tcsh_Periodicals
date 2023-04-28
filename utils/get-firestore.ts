const _ = require('lodash');
import { AccountsUni, DB } from "@/types/firestore";
import { collection, doc, DocumentData, DocumentReference, DocumentSnapshot, getDoc, getDocFromCache, getDocs, getDocsFromCache, orderBy, query, QuerySnapshot, where } from "firebase/firestore";
import { ValueOf } from "next/dist/shared/lib/constants";
import { db } from "./firebase";

export async function getDocsFromCacheOrServer<T>(collectionName: string, orderby = "createdTimestamp", orderFromLow = false): Promise<T> {
  const docRef = query(collection(db, collectionName), orderBy(orderby, orderFromLow ? 'asc' : "desc"));
  let col: QuerySnapshot<DocumentData>;
  try {
    col = await getDocsFromCache(docRef);
    if (col.empty) throw false;
  } catch (e) {
    col = await getDocs(docRef);
  }
  return col.docs.map((doc) => {
    return doc.data();
  }) as T;
}

export async function getDocFromCacheOrServer<T>(docColection: string, docId: string, ...docArgs: string[]): Promise<T> {
  const docRef = doc(db, docColection, docId, ...docArgs)
  let docSnap: DocumentSnapshot<DocumentData>;
  try {
    docSnap = await getDocFromCache(docRef)
    if (docSnap.exists()) throw false;
  } catch (e) {
    docSnap = await getDoc(docRef);
  }
  return docSnap.data() as T;
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
  const docRef = query(collection(db, "accounts"), where("email", "==", email));
  let result: QuerySnapshot<DocumentData>;
  try {
    result = await getDocsFromCache(docRef);
    if (result.empty) throw false;
  } catch (e) {
    result = await getDocs(docRef);
  }
  const profile = result.docs[0];
  if (!result.empty) {
    const typeName = (_.isObject(profile.data().memberRef) && profile.data().memberRef.id) ? "Member" : "Account";
    const res: AccountsUni = {
      type: typeName,
      data: { ...profile.data() as any, uid: profile.id }
    };
    return res;
  }
  return null;
}

export function isAdmin(firestore: AccountsUni): boolean {
  if (firestore.type != "Member") return false;
  if (_.isObject(firestore.data.memberRef) && firestore.data.memberRef.id) return true;
  return false;
}