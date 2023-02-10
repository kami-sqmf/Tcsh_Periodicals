import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { PostDocument } from "../types/firestore";
import { Global } from "../types/global";
import { db } from "./firebase";
import { Dispatch, SetStateAction, use } from "react";

export const newPost = async (userId: string) => {
  const post = await addDoc(collection(db, "posts"), {
    data: {},
    type: 0,
    title: "",
    description: "",
    thumbnail: "",
    tag: [""],
    owner: userId,
    isPublic: false,
    createdTimestamp: serverTimestamp(),
    lastEditTimestamp: serverTimestamp()
  });
  return post.id;
}

export const newPostEditorLink = async (userId: string) => {
  const postId = await newPost(userId);
  return `${Global.webMap.editor.href}/${postId}`;
}

export const uploadToCloud = async (postId: string, data: PostDocument, username?: string, setStatus?: Dispatch<SetStateAction<string>>) => {
  try {
    if (username && setStatus) setStatus(`正在上傳 - ${username} （雲端）`);
    const res = await setDoc(doc(db, "posts", postId), data);
    if (username && setStatus) setStatus(`已儲存在 - ${username} （雲端）`)
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}