import { ReadStream } from "fs";
import { FlexComponent, FlexMessage, FollowEvent, LineRequestEvents, Message, MessageEvent, PostbackEvent, TextMessage } from "./lineType";
import MessageObject from "./lineObject";
import { db } from "./firebase";

const axios = require('axios').default;
const msgListener = new Map()
const utils = new MessageObject
const dotenv = require('dotenv');
dotenv.config();

type SendReq = {
    method: "GET" | "POST" | "INSERT" | "PUT" | "UPDATE" | "DELETE",
    headers?: { Authorization: string; "Content-Type"?: string },
    url: string,
    baseURL: `https://api.line.me/v2/bot`,
    data?: any
    params?: any
}

export default class LineBot {
    public token: string;
    constructor(token: string) {
        this.token = token;
    }
    public async event(eventArray: LineRequestEvents) {
        for (const event of eventArray) {
            if (event.source.type == "group" || event.source.type == "room") return false;
            switch (event.type) {
                case 'message':
                    return await this.messages(event);
                case 'postback':
                    return await this.postback(event);
                case 'follow':
                    return await this.follow(event);
                default:
                    console.log(`收到的資料格式為 ${event.type}`);
            }
        }
        return false;
    }

    public async messages(e: MessageEvent) {
        if (msgListener.get(e.source.userId)) {
            const data = { data: msgListener.get(e.source.userId), ...e }
            return this.reply(e.replyToken, await listenerHandler(data))
        }
        if (e.message.type == "text") {
            if (e.message.text.includes("資料異動")) {
                return this.reply(e.replyToken, await changeProfile(e, "Edit"))
            }
            if (e.message.text.includes("資料查看")) {
                return this.reply(e.replyToken, await changeProfile(e, "View"))
            }
            if (e.message.text.includes("IG異動")) {
                return this.reply(e.replyToken, await changeProfile(e, "instagram"))
            }
            if (e.message.text.includes("生日異動")) {
                return this.reply(e.replyToken, await changeProfile(e, "birth"))
            }
            if (e.message.text.includes("自我介紹異動")) {
                return this.reply(e.replyToken, await changeProfile(e, "bio"))
            }
            if (e.message.text.includes("姓名異動")) {
                return this.reply(e.replyToken, await changeProfile(e, "nameCh"))
            }
            if (e.message.text.includes("座號異動")) {
                return this.reply(e.replyToken, await changeProfile(e, "index"))
            }
            if (e.message.text.includes("暱稱異動")) {
                return this.reply(e.replyToken, await changeProfile(e, "nameEn"))
            }
            if (e.message.text.includes("照片異動")) {
                return this.reply(e.replyToken, await changeProfile(e, "avatar"))
            }
            if (e.message.text.includes("歌單")) {
                return this.reply(e.replyToken, await songList())
            }
        }
        if (e.message.type == "sticker") {
            return this.reply(e.replyToken, [utils.text(e.message.keywords ? `幹嘛傳${e.message.keywords[Math.floor(Math.random() * e.message.keywords.length)]}給我？` : `這個貼圖怎麼好像你啊？`)])
        }
        if (e.message.type == "image") {
            return this.reply(e.replyToken, [utils.text(`好澀喔！竟然傳你的照片給我？`)])
        }
    }

    public postback(e: PostbackEvent) {

    }

    public async follow(e: FollowEvent) {
        const message = [utils.sticker("6362", "11087925"), utils.text("😳 歡迎加入22屆知足班 Line班帳！ 😳\n這裡什麼也不能幹嘛！但你可以去 22th.kami.tw 去看看有什麼需要用到我的東西。")]
        const data = await this.postData("GET", `/profile/${e.source.userId}`)
        const stuRef = db.collection('students');
        const snapshot = await stuRef.where('line', '==', data.data.displayName).get();
        let setData = {
            ...data.data,
            followed: true,
        }
        if (!snapshot.empty) {
            snapshot.forEach(doc => {
                setData["profile"] = db.collection('students').doc(doc.id)
                message.push(utils.text(`根據我這個小雞雞的計算 🧮，${binarySexualWord(doc.id)}應該是『 ${doc.data().nameCh} 』對吧？`));
                message.push(utils.text(`如果${binarySexualWord(doc.id)}想要更改自己在班網的資訊請輸入『 資料異動 』或點選下方的按鈕！`, {
                    quickReply:
                    {
                        "items": [
                            {
                                "type": "action",
                                "action": {
                                    "type": "message",
                                    "label": "點我更改班網資料",
                                    "text": "資料異動"
                                }
                            },
                        ]
                    }
                }));
            })
        } else {
            message.push(utils.text(`根據我這個小雞雞的計算，您應該不是貴班的學生！如果您是的話請幫我告訴湯哥！`))
        }
        db.collection('line').doc(data.data.userId).set(setData, { merge: true });
        return this.reply(e.replyToken, message)
    }

    public async reply(replyToken, message: Message[]) {
        return this.postData("POST", '/message/reply', {
            replyToken: replyToken,
            messages: await message
        });
    }

    public push(target, message: Message[]) {
        return this.postData("POST", '/message/push', {
            to: target,
            messages: message
        });
    }

    private async postData(method: "GET" | "POST" | "INSERT" | "PUT" | "UPDATE" | "DELETE", url, body?): Promise<{ operation: "success" | "error"; data: any }> {
        let sendReq: SendReq = {
            method: method,
            url: url,
            baseURL: `https://api.line.me/v2/bot`,
            headers: {
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json"
            }
        }
        if (method == "GET") {
            sendReq = {
                ...sendReq,
                params: {
                    ...body,
                }
            }
        } else {
            sendReq = {
                ...sendReq,
                data: JSON.stringify(body)
            }
        }
        try { const res = await axios(sendReq); return { operation: "success", data: res.data } }
        catch (err) {
            const error = err.response ? err.response.data : err
            return { operation: "error", data: error }
        }
    }
}

function listenerHandler(data): Promise<Message[]> {
    if (data.data.type == "changeProfile") return changeProfile(data, data.data.action);
}

async function getProfile(lineId) {
    const lineRef = db.collection("line").doc(lineId)
    const res = await lineRef.get()
    if (res.exists) {
        const data = res.data().profile
        const profile = await data.get()
        return { exists: true, ...profile.data(), set: data }
    } else {
        return { exists: false }
    }
}

async function changeProfile(data, type): Promise<Message[]> {
    const profile = await getProfile(data.source.userId);
    if (!profile.exists) return [utils.text("您不是本班成員吧？")];
    if (type == "Edit" || type == "View") {
        const req = utils.flexTop(`我是${binarySexualWord(profile.id)}命中註定的通知`, utils.flexBubble({
            hero: utils.flexImage(profile.avatar, { size: "full", aspectMode: "cover", action: utils.ActionUrl(profile.avatar) }),
            body: utils.flexBox("vertical", [
                utils.flexBox("baseline", [utils.flexText(profile.nameCh, { weight: "bold", size: "xl", flex: 2 }), utils.flexText(`${profile.index}號 ${profile.nameEn}`, { color: "#aaaaaa", size: "sm", flex: 1 })]),
                utils.flexBox("vertical", [
                    utils.flexBox("baseline", [utils.flexText("生日", { color: "#aaaaaa", size: "sm", flex: 2 }), utils.flexText(`${parseInt((parseInt(profile["birth"]) % 10000 / 100).toString())} 月 ${(parseInt(profile["birth"]) % 100).toString()} 號`, { color: "#666666", size: "sm", wrap: true, flex: 5 })], { spacing: "sm" }),
                    utils.flexBox("baseline", [utils.flexText("Instagram", { color: "#aaaaaa", size: "sm", flex: 2 }), utils.flexText(profile.instagram, { color: "#666666", size: "sm", wrap: true, flex: 5, action: utils.ActionUrl(`https://instagram.com/${profile.instagram}`, "action") })], { spacing: "sm" }),
                    utils.flexBox("baseline", [utils.flexText("自我介紹", { color: "#aaaaaa", size: "sm", flex: 2 }), utils.flexText(profile.bio ? profile.bio : "（尚未輸入）", { color: "#666666", size: "sm", wrap: true, flex: 5 })], { spacing: "sm" })
                ], { margin: "lg", spacing: "sm" })
            ]),
            footer: type == "Edit" ? utils.flexBox("vertical", [
                utils.flexButton(utils.ActionText("更正IG", "IG異動")),
                utils.flexButton(utils.ActionText("更正生日", "生日異動")),
                utils.flexButton(utils.ActionText("更正自我介紹", "自我介紹異動")),
                utils.flexButton(utils.ActionText("更正暱稱", "暱稱異動")),
                utils.flexButton(utils.ActionText("更正照片", "照片異動")),
                utils.flexButton(utils.ActionText("更正姓名", "姓名異動")),
            ], { spacing: "sm" }) : utils.flexBox("vertical", [utils.flexButton(utils.ActionUrl(`https://22th.kami.tw/members/classmates#stu${profile.index}`, "查看在班網上的資料"))])
        }))
        return [req]
    }
    else if (type == "avatar" && data.message.type == "image") {
        try {
            const response = await axios({
                method: "GET",
                url: `https://api-data.line.me/v2/bot/message/${data.message.id}/content`,
                responseType: "stream",
                headers: {
                    Authorization: `Bearer ${process.env.LinebotKey}`,
                }
            });
            let extension: string;
            if (response.headers['content-type'] == "image/jpeg") extension = "jpg"; if (response.headers['content-type'] == "image/gif") extension = "gif"; if (response.headers['content-type'] == "image/bmp") extension = "bmp"
            const file = bucket.file(`students/0${data.message.id}.${extension}`);
            const download = response.data as ReadStream
            const result: Promise<TextMessage[]> = new Promise((resolve, reject) => {
                download.pipe(file.createWriteStream().on("finish", async () => {
                    file.makePublic();
                    const link = await file.publicUrl()
                    const lineRef = db.collection("line").doc(data.source.userId)
                    const res = await lineRef.get()
                    const profile = await res.data().profile
                    profile.set({ avatar: link }, { merge: true })
                    msgListener.delete(data.source.userId)
                    resolve([utils.text(`已經更改${binarySexualWord(profile.id)}的照片`, {
                        "quickReply": {
                            "items": [
                                {
                                    "type": "action",
                                    "action": {
                                        "type": "message",
                                        "label": "點我查看更改後的資料",
                                        "text": "資料查看"
                                    }
                                },
                            ]
                        }
                    })])
                }))
                setTimeout(() => { reject() }, 7500);
            });
            return result
        } catch (err) {
            console.log(err)
            return [utils.text(`革命尚未成功，同志仍需努力`)]
        }
    }
    else if (data.data && !(data.message.text as string).includes("異動")) {
        if (data.message.type != "text") return [utils.text(`格式錯誤，請再輸入一次`)]
        if (type == "birth" && !((parseInt(data.message.text) / 10000 < 2500) && (parseInt(data.message.text) / 10000 > 1900)))
            return [utils.text(`格式錯誤，請再輸入一次`)]
        const change = {}
        change[type] = data.message.text
        profile.set.set(change, { merge: true })
        msgListener.delete(data.source.userId)
        return [utils.text(`變更成功！`, {
            quickReply: {
                "items": [
                    {
                        "type": "action",
                        "action": {
                            "type": "message",
                            "label": "點我查看更改後的資料",
                            "text": "資料查看"
                        }
                    },
                ]
            }
        })]
    }
    else {
        msgListener.set(data.source.userId, {
            type: "changeProfile",
            action: type
        })
        const message: Message[] = [utils.text(`目前${data.message.text.slice(0, -2)}為『${profile[type]}』`), utils.text(`請輸入欲更改的${data.message.text.slice(0, -2)}`)]
        switch (type) {
            case "avatar":
                message.pop()
                message.pop()
                message.push(utils.image(profile.avatar, profile.avatar))
                message.push(utils.text(`請傳送欲更改的照片 (支援 GIF)`))
                break;
            case "instagram":
                message.push(utils.text(`IG帳號名！ eg. aprilyang4605`))
                break;
            case "birth":
                message.push(utils.text(`生日格式為『 西元年 月份 日 \n』eg. 20060229`))
                break;
        }
        console.log(message)
        return message
    }
}

async function songList(): Promise<FlexMessage[]> {
    const songs = await getSong(getNextFriday())
    return [songs]
}

async function getSong(date): Promise<FlexMessage> {
    const songRef = db.collection('songs').doc(date);
    const doc = await songRef.get();
    const body: FlexComponent[] = [];
    const queryVideos: { idNumber: string; vid: string }[] = []
    if (!doc.exists) body.push(utils.flexText("本週還沒有人點歌ㄛ！", { weight: "bold" }))
    else {
        for (const [key, value] of Object.entries(doc.data())) {
            queryVideos.push({ vid: value.slice(0, 2) == "O@" ? value.slice(2) : value, idNumber: key })
        }
        const vidInfo = (await yt.videoByIds(queryVideos.map(({ vid }) => vid))).items.map((obj: { kind: string; etag: string; id: string; snippet: any }) => {
            return { ...obj, ...queryVideos.find((item) => item.vid === obj.id && item) };
        });
        for (const video of vidInfo) {
            const part = utils.flexBox("vertical", [
                utils.flexText(video.snippet.title, { weight: "bold" }),
                utils.flexBox("horizontal", [utils.flexImage(video.snippet.thumbnails.medium.url, {
                    align: "start",
                    flex: 1,
                    size: "lg",
                    aspectRatio: "16:9"
                }), utils.flexBox("vertical", [
                    utils.flexBox("vertical", [utils.flexText("頻道：", { weight: "bold" }), utils.flexText(video.snippet.channelTitle, { size: "sm" })]),
                    utils.flexBox("vertical", [utils.flexText("點歌者：", { weight: "bold" }), utils.flexText(video.idNumber, { size: "sm" })])
                ], { flex: 1, justifyContent: "space-around" })], { margin: "sm" })
            ], { margin: "sm", action: utils.ActionUrl(`https://youtu.be/${video.id}`, "Link to Youtube") })
            body.push(part)
        }
    }
    return utils.flexTop("本週歌單在這裡喔！", utils.flexBubble({
        header: utils.flexBox("baseline", [utils.flexText("本週歌單", { size: "xl", weight: "bold" }), utils.flexText(date, { align: "end" })]),
        body: utils.flexBox("vertical", body),
        footer: utils.flexBox("vertical", [utils.flexButton(utils.ActionUrl("https://22th.kami.tw/songs", "新增歌曲"))])
    }))
}

export function indexToId(index) {
    if (index < 19) {
        if (index < 10) {
            return "01000" + index.toString()
        } else {
            return "0100" + index.toString()
        }
    } else if (index == 19) {
        return "010039"
    } else if (index > 19) {
        return "010" + (109 + index - 20).toString()
    }
}

export function binarySexualWord(id) {
    return parseInt(id) <= 10039 ? "你" : "妳"
}