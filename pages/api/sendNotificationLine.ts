import type { NextApiRequest, NextApiResponse } from 'next';

const groupId = "C339f7a4103df7938cb87dcf47b16f0fb";
const key: string = process.env.LINE_KEY!;
export default async function sendNotificationLine(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "POST") {
    const body = JSON.parse(req.body) as {
      message: string,
      imageUrl?: string,
      voiceUrl?: string,
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
    try {
      const ress = await fetch("https://api.line.me/v2/bot/message/push", {
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
      // console.log(ress);
      return res.status(200).send("Success");
    } catch (err) {
      console.log(err)
      return res.status(500).send("Fucked UP");
    }
  }
  return res.status(404).send("404 Unreachable");
}