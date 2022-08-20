import { Action, AudioMessage, Background, Emojis, FlexBox, FlexBubble, FlexBubbleStyle, FlexButton, FlexComponent, FlexContainer, FlexImage, FlexMessage, FlexText, FlexVideo, ImageMessage, LocationMessage, MessageAction, MessageCommon, PostbackAction, StickerMessage, TextMessage, URIAction, VideoMessage } from "./lineType";

export default class MessageObject {
    public text(text: string, options: MessageCommon & { emojis?: Emojis } = {}): TextMessage {
        const base: TextMessage = {
            type: "text" as const,
            text: text,
            quickReply: options.quickReply,
            sender: options.sender,
            emojis: options.emojis
        }
        return cleanObj(base)
    }
    public sticker(packageId: string, stickerId: string): StickerMessage {
        const base: StickerMessage = {
            type: "sticker" as const,
            packageId: packageId,
            stickerId: stickerId
        }
        return base
    }
    public image(url: string, thumbnail: string): ImageMessage {
        const base: ImageMessage = {
            type: "image" as const,
            previewImageUrl: thumbnail,
            originalContentUrl: url
        }
        return base
    }
    public video(url: string, thumbnail: string, trackingId?: string): VideoMessage {
        const base: VideoMessage = {
            type: "video" as const,
            previewImageUrl: thumbnail,
            originalContentUrl: url,
            trackingId: trackingId
        }
        return cleanObj(base)
    }
    public audio(url: string, duration: number): AudioMessage {
        const base: AudioMessage = {
            type: "audio" as const,
            originalContentUrl: url,
            duration: duration
        }
        return cleanObj(base)
    }
    public location(title: string, displayAddress: string, latitude: number, longitude: number): LocationMessage {
        const base: LocationMessage = {
            type: "location" as const,
            title: title,
            address: displayAddress,
            latitude: latitude,
            longitude: longitude
        }
        return base
    }
    public flexTop(notifyAlt: string, contents: FlexContainer): FlexMessage {
        const base: FlexMessage = {
            type: "flex",
            altText: notifyAlt,
            contents: cleanObj(contents)
        }
        return cleanObj(base)
    }
    public flexBubble(obj: {
        header?: FlexBox;
        hero?: FlexBox | FlexImage | FlexVideo;
        body?: FlexBox;
        footer?: FlexBox;
        styles?: FlexBubbleStyle;
        action?: Action;
    }): FlexBubble {
        const base: FlexBubble = {
            type: "bubble" as const,
            header: obj.header,
            hero: obj.hero,
            body: obj.body,
            footer: obj.footer,
            styles: obj.styles,
            action: obj.action
        }
        return cleanObj(base)
    }
    public flexBox(layout: "horizontal" | "vertical" | "baseline", content: FlexComponent[], options: {
        backgroundColor?: string;
        borderColor?: string;
        borderWidth?:
        | string
        | "none"
        | "light"
        | "normal"
        | "medium"
        | "semi-bold"
        | "bold";
        cornerRadius?: string | "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
        width?: string;
        maxWidth?: string;
        height?: string;
        maxHeight?: string;
        flex?: number;
        spacing?: string | "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
        margin?: string | "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
        paddingAll?: string;
        paddingTop?: string;
        paddingBottom?: string;
        paddingStart?: string;
        paddingEnd?: string;
        action?: Action;
        justifyContent?:
        | "flex-start"
        | "center"
        | "flex-end"
        | "space-between"
        | "space-around"
        | "space-evenly";

        alignItems?: "flex-start" | "center" | "flex-end";
        background?: Background;
    } = {}): FlexBox {
        const base: FlexBox = {
            type: "box",
            layout: layout,
            contents: content,
            backgroundColor: options.backgroundColor,
            borderColor: options.borderColor,
            borderWidth: options.borderWidth,
            cornerRadius: options.cornerRadius,
            width: options.width,
            maxWidth: options.maxWidth,
            height: options.height,
            maxHeight: options.maxHeight,
            flex: options.flex,
            spacing: options.spacing,
            margin: options.margin,
            paddingAll: options.paddingAll,
            paddingTop: options.paddingTop,
            paddingBottom: options.paddingBottom,
            paddingStart: options.paddingStart,
            paddingEnd: options.paddingEnd,
            action: options.action,
            justifyContent: options.justifyContent,
            alignItems: options.alignItems,
            background: options.background,
        }
        return cleanObj(base)
    }
    public flexButton(action: Action, options: {
        flex?: number;
        margin?: string | "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
        height?: "sm" | "md";
        style?: "link" | "primary" | "secondary";
        color?: string;
        gravity?: "top" | "bottom" | "center";
        adjustMode?: "shrink-to-fit";
    } = {}): FlexButton {
        const base: FlexButton = {
            type: "button",
            action: action,
            flex: options.flex,
            margin: options.margin,
            height: options.height,
            style: options.style,
            color: options.color,
            gravity: options.gravity,
            adjustMode: options.adjustMode,
        }
        return cleanObj(base)
    }
    public flexImage(url: string, options: {
        flex?: number;
        margin?: string | "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
        align?: "start" | "end" | "center";
        gravity?: "top" | "bottom" | "center";
        size?:
        | string
        | "xxs"
        | "xs"
        | "sm"
        | "md"
        | "lg"
        | "xl"
        | "xxl"
        | "3xl"
        | "4xl"
        | "5xl"
        | "full";
        aspectRatio?: string;
        aspectMode?: "cover" | "fit";
        backgroundColor?: string;
        action?: Action;
        animated?: Boolean;
    } = {}): FlexImage {
        return cleanObj({
            type: "image",
            url: url,
            flex: options.flex,
            margin: options.margin,
            align: options.align,
            gravity: options.gravity,
            size: options.size,
            aspectRatio: options.aspectRatio,
            aspectMode: options.aspectMode,
            backgroundColor: options.backgroundColor,
            action: options.action,
            animated: options.animated,
        })
    }
    public flexText(text: string, options: {
        adjustMode?: "shrink-to-fit";
        flex?: number;
        margin?: string | "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
        size?:
        | string
        | "xxs"
        | "xs"
        | "sm"
        | "md"
        | "lg"
        | "xl"
        | "xxl"
        | "3xl"
        | "4xl"
        | "5xl";
        align?: "start" | "end" | "center";
        gravity?: "top" | "bottom" | "center";
        wrap?: boolean;
        lineSpacing?: string;
        maxLines?: number;
        weight?: "regular" | "bold";
        color?: string;
        action?: Action;
        style?: string;
        decoration?: string;
    } = {}): FlexText {
        return cleanObj({
            type: "text",
            text: text,
            adjustMode: options.adjustMode,
            flex: options.flex,
            margin: options.margin,
            size: options.size,
            align: options.align,
            gravity: options.gravity,
            wrap: options.wrap,
            lineSpacing: options.lineSpacing,
            maxLines: options.maxLines,
            weight: options.weight,
            color: options.color,
            action: options.action,
            style: options.style,
            decoration: options.decoration,
        })
    }
    public ActionText(label: string = "", text: string): MessageAction & {label: string} {
        return cleanObj({
            type: "message",
            label: label,
            text: text
        })
    }
    public ActionUrl(url: string, label: string = "", desktopUrl?: string): URIAction & {label: string} {
        return cleanObj({
            type: "uri",
            label: label,
            uri: url,
            altUri: {
                desktop: desktopUrl ? desktopUrl : url
            }
        })
    }
    /**
     * URI is like the params of url. For Exmaple: "type=members&process=2&foo=bar"=
     */
    public ActionPostback(label: string, uri: string, options: {
        fillinText?: string;
        displayText?: string;
    } = {}): PostbackAction {
        return cleanObj({
            type: "postback",
            data: uri,
            label: label,
            fillinText: options.fillinText,
            displayText: options.displayText,
        })
    }
}

export function cleanObj(obj) {
    for (const key in obj) {
        if (obj[key] === undefined || obj[key] === "") {
            delete obj[key];
        }
    }
    return obj
}