'use server';
const _ = require('lodash');
import { TeamInfo } from "@/components/member/member-content-wrapper";
import { About, Account, AccountFB, Member, Notification, Posts, Role, Slide } from "@/types/firestore";
import { collection, CollectionReference, doc, DocumentData, DocumentReference, DocumentSnapshot, getDoc, getDocFromCache, getDocs, getDocsFromCache, orderBy, query, QuerySnapshot, updateDoc, where, writeBatch } from "firebase/firestore";
import { getPlaiceholder } from "plaiceholder";
import { cache } from "react";
import { db } from "./firebase";

const getThumbnailsBlurData = async (imageUrl: string, errorThumbnail?: string) => {
  try {
    if (imageUrl.startsWith("/assests/ebook")) return "N9J8Cf9$5F~W-=4.0F$1v{E2IU%L00x@x=IUjs-;";
    const buffer = await fetch(imageUrl).then(async (res) =>
      Buffer.from(await res.arrayBuffer())
    );
    const { base64 } = await getPlaiceholder(buffer);
    return base64;
  } catch (err) {
    return errorThumbnail || "N9J8Cf9$5F~W-=4.0F$1v{E2IU%L00x@x=IUjs-;";
  }
}

export async function getRefDocFromCacheOrServer<T>(docRef: DocumentReference<DocumentData>): Promise<T> {
  let doc: DocumentSnapshot<DocumentData>;
  try {
    doc = await getDocFromCache(docRef);
    if (!doc.exists()) throw false;
  } catch (e) {
    doc = await getDoc(docRef);
  }
  return { id: doc.id, ...doc.data() } as T;
}


export async function getRefDocsFromCacheOrServer<T>(colRef: CollectionReference<DocumentData>): Promise<T> {
  let col: QuerySnapshot<DocumentData>;
  try {
    col = await getDocsFromCache(colRef);
    if (col.empty) throw false;
  } catch (e) {
    col = await getDocs(colRef);
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

export async function getAccount(email: string): Promise<AccountFB | null> {
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
    const res: AccountFB = { ...profile.data() as any, uid: profile.id };
    return res;
  }
  return null;
}

export async function getPremissions(firestore: Account): Promise<string[] | false> {
  if (!firestore.rolePath) return false;
  const roleInfo = await getRefDocFromCacheOrServer<Role>(doc(db, firestore.rolePath));
  if (!roleInfo.premissions) return false;
  if (roleInfo.premissions.length === 0) return false;
  if (roleInfo.premissions as any === true) return ["ALL_ALLOWED"]
  const premissions = roleInfo.premissions;
  return premissions;
}

export const getRoles = cache(async () => {
  const data = await getDocsFromCacheOrServer<Role[]>("roles", "order", true);
  return data.map(role => {
    if (!role.childs) return role;
    role.childs = role.childs.map(ro => ro.path) as any;
    return role;
  });
});

export const getTeams = cache(async () => {
  const data = await getDocsFromCacheOrServer<{ id: string, team: number; present: boolean }[]>("members", "team", false);
  return data.map((doc) => {
    return {
      team: doc.team,
      teamId: doc.id,
      present: doc.present
    }
  }) as TeamInfo[];
});

export const getRolesProfiles = cache(async (teamId: string) => {
  const roles = await getRoles();
  const docRef = collection(db, "members", teamId, "profiles");
  const profilesRaw = await getRefDocsFromCacheOrServer<Member[]>(docRef);
  const profiles = profilesRaw.map(member => {
    member.roleInfo = roles.find(role => member.role.path.includes(role.id));
    member.role = member.role.path as any;
    return member;
  });
  return { roles, profiles };
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