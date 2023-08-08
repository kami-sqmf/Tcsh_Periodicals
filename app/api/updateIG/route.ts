import { db } from '@/utils/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET() {
  const options: RequestInit = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '830a65ab1emsh2fd10e83a97df9fp115bf7jsnf9277d3031ee',
      'X-RapidAPI-Host': 'instagram-scraper-2022.p.rapidapi.com'
    },
    cache: "no-store",
  };

  try {
    const response = await fetch('https://instagram-scraper-2022.p.rapidapi.com/ig/posts/?id_user=54431922963', options)
    const data = await response.json();
    console.log(data)
    const postsArr = data.data.user.edge_owner_to_timeline_media.edges
    const sendDB = []
    for (const post of postsArr) {
      const send = {
        url: "",
        thumbnail: "",
        categories: [""],
        title: ""
      }
      send.url = `https://www.instagram.com/p/${post.node.shortcode}`
      send.thumbnail = post.node.display_url
      const text: string = post.node.edge_media_to_caption.edges[0].node.text
      send.title = text.slice(0, text.indexOf("\n"))
      send.categories = text.slice(text.indexOf("#") + 1).split("#")
      sendDB.push(send)
    }
    await setDoc(doc(db, "Global/Posts"), {
      posts: sendDB
    })
    return NextResponse.json({ success: true, message: sendDB })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ success: false, message: e })
  }
}