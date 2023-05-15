const _ = require('lodash');
import { TeamInfo } from "@/components/member/member-content-wrapper";
import { About, AccountsUni, Member, Notification, Posts, Slide } from "@/types/firestore";
import { collection, CollectionReference, doc, DocumentData, DocumentSnapshot, getDoc, getDocFromCache, getDocs, getDocsFromCache, orderBy, query, QuerySnapshot, where } from "firebase/firestore";
import { getPlaiceholder } from "plaiceholder";
import { cache } from "react";
import { db } from "./firebase";

const getThumbnailsBlurData = async (imageUrl: string, errorThumbnail?: string) => {
  try {
    const { base64 } = await getPlaiceholder(imageUrl);
    return base64;
  } catch (err) {
    return errorThumbnail || "N9J8Cf9$5F~W-=4.0F$1v{E2IU%L00x@x=IUjs-;";
  }
}


export async function getRefDocsFromCacheOrServer<T>(docRef: CollectionReference<DocumentData>): Promise<T> {
  let col: QuerySnapshot<DocumentData>;
  try {
    col = await getDocsFromCache(docRef);
    if (col.empty) throw false;
  } catch (e) {
    col = await getDocs(docRef);
  }
  return col.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  }) as T;
}

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
    return { id: doc.id, ...doc.data() };
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

export const getTeams = cache(async () => {
  const data = await getDocsFromCacheOrServer<{ id: string, team: number }[]>("members", "team", false);
  return data.map((doc) => {
    return {
      team: doc.team,
      teamId: doc.id
    }
  }) as TeamInfo[];
});

export const getProfiles = cache(async (teamId: string) => {
  const docRef = collection(db, "members", teamId, "profiles");
  return await getRefDocsFromCacheOrServer<Member[]>(docRef);
});

export const getSlides = cache(async () => {
  const slides = await getDocsFromCacheOrServer<Slide[]>("slides", "order", true);
  for (let i = 0; i < slides.length; i++) {
    const slide = slides.at(i);
    if (!slide) continue;
    slides[i] = {
      ...slide,
      image_blur: await getThumbnailsBlurData(slide.image, "N9J8Cf9$5F~W-=4.0F$1v{E2IU%L00x@x=IUjs-;")
    } as any
  }
  return slides;
});

export const getRecommend = cache(async () => {
  const posts = await getDocFromCacheOrServer<Posts>("Global", "Posts");
  return posts;
});

export const getNotifications = cache(async () => {
  const notifications = await getDocsFromCacheOrServer<Notification[]>("notifications", "order", true);
  return notifications;
});
export const getAbout = cache(async () => {
  const about = await getDocFromCacheOrServer<About>("Global", "About");
  return about;
});