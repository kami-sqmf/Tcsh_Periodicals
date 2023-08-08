import { NextResponse } from 'next/server';

const key: string = process.env.LINE_KEY!;
const groupId = "C9c9a91ba6bfacfc26366b9072f184445";
export async function POST(req: Request) {
  const body = await req.json() as {
    message: string;
    key: { iv: string; content: string };
    id: string;
    imageUrl?: string;
    voiceUrl?: string;
  };
  const messages: any[] = [{
    "type": "text",
    "text": body.message
  }];
  if (body.imageUrl) messages.push({
    "type": "image",
    "originalContentUrl": body.imageUrl,
    "previewImageUrl": body.imageUrl
  });
  if (body.voiceUrl) messages.push({
    "type": "audio",
    "originalContentUrl": body.voiceUrl,
    "duration": 60000
  });
  messages.at(messages.length - 1).quickReply = {
    "items": [
      {
        "type": "action",
        "action": {
          "type": "uri",
          "label": "確認",
          "uri": `https://periodicals.kami.tw/api/idea-urstory/manage?action=approve&id=${body.id}&key=${body.key.iv}&secret=${body.key.content}`
        }
      },
      {
        "type": "action",
        "action": {
          "type": "uri",
          "label": "退回",
          "uri": `https://periodicals.kami.tw/api/idea-urstory/manage?action=deny&id=${body.id}&key=${body.key.iv}&secret=${body.key.content}`
        }
      },
      {
        "type": "action",
        "action": {
          "type": "uri",
          "label": "所有投稿",
          "uri": `https://periodicals.kami.tw/admin/idea-urstory?id=${body.id}&key=${body.key.iv}&secret=${body.key.content}`
        }
      }
    ]
  }
  try {
    const res = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "to": groupId,
        "messages": messages
      })
    })
    return NextResponse.json({ success: true, message: "Send Succcessfully" })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ success: false, message: err })
  }
}