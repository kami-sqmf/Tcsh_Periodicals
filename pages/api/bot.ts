import { NextApiRequest, NextApiResponse } from 'next'
import LineBot from '../../../utils/lineBot';
import MessageObject from '../../../utils/lineObject';
import { LineRequest } from '../../../utils/lineType';

const dotenv = require('dotenv');
const crypto = require("crypto");
const bot = new LineBot(process.env.LinebotKey)
dotenv.config();

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Not Post Method
    if (_req.method != 'POST') throw '目前不支援此通道！';

    // Check Reqeust From Line
    const body = _req.body as LineRequest
    const signature = crypto
      .createHmac("SHA256", process.env.LineSignature)
      .update(JSON.stringify(body))
      .digest("base64");
    if(_req.headers['x-line-signature'] != signature) throw "不認識的詐騙人士！";

    // Handler
    const event = body.events;
    console.log(event);
    await bot.event(event)
    res.status(200).send({ operation: '操作成功' })

  } catch (err: any) {
    console.log(err)
    res.status(500).json({ statusCode: 500, message: err })
  }
}