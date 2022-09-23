import { doc, setDoc } from 'firebase/firestore';
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../utils/firebase';

export default async function updateIG(req: NextApiRequest, res: NextApiResponse){
    const axios = require("axios");

    const options = {
        method: 'GET',
        url: 'https://instagram-scraper-2022.p.rapidapi.com/ig/posts/',
        params: {id_user: '54431922963'},
        headers: {
          'X-RapidAPI-Key': '830a65ab1emsh2fd10e83a97df9fp115bf7jsnf9277d3031ee',
          'X-RapidAPI-Host': 'instagram-scraper-2022.p.rapidapi.com'
        }
      };
      
    try{
        const data = await axios.request(options)
        const postsArr = data.data.data.user.edge_owner_to_timeline_media.edges
        const sendDB = []
        for(const post of postsArr){
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
            send.categories = text.slice(text.indexOf("#")+1).split("#")
            sendDB.push(send)
        }
        await setDoc(doc(db, "Global/Posts"), {
            posts: sendDB
        })
        res.send({success: true, message: sendDB})
    }catch(e){
        console.log(e)
        res.send({success: false, message: e})
    }   
}