import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Global } from "../types/global";
import { db } from "./firebase";

export const newPost = async (userId: string) => {
  const post = await addDoc(collection(db, "posts"), {
    data: {},
    type: 0,
    title: "",
    description: "",
    thumbnail: "",
    tag: [],
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