import { MemberRoleKey } from "./role";

/** Collections */
interface DB {
    Global: GlobalDB;
    Members: Member[];
    Accounts: Account[];
    books: Books[];
}

/** Col: Global */
interface GlobalDB {
    About: About;
    Notification: Notifications;
    Posts: Posts;
    Slide: Slides;
};
/** Col: Global => Doc: About */
interface About {
    description: string;
    email: string;
    insta: string;
};
/** Col: Global => Doc: Notifications */
interface Notifications {
    Now: Notification[];
};
/** Col: Global => Doc: Notifications Inner */
interface Notification {
    button: {
        href: string;
        text: string;
    }
    title: string;
    type: "alert" | "error" | "success";
};
/** Col: Global => Doc: Posts */
interface Posts {
    posts: Post[];
};
/** Col: Global => Doc: Posts Inner */
interface Post {
    categories: string[],
    thumbnail: string;
    title: string;
    url: string;
};
/** Col: Global => Doc: Slides */
interface Slides {
    slide: Slide[];
};
/** Col: Global => Doc: Slides Inner*/
interface Slide {
    href: string;
    image: string;
    title: string;
};
/** Col: Accounts or Member */
type AccountsUni = Accounts<"Account"> | Accounts<"Member">;
interface Accounts<Type extends "Member" | "Account"> {
    type: Type;
    data: Type extends "Member" ? Member : Account;
};

type classLevel = "1" | "2" | "3";
type Class = `J${classLevel}${"1" | "2" | "3" | "4" | "5" | "6" | "7"}` | `S${classLevel}${"1" | "2" | "3" | "4" | "5"}`
/** Col: Members' Doc */
interface Member {
    uid: string;
    avatar: string;
    bio: string;
    class: Class;
    customTitle: string | null | undefined;
    email: string | null;
    insta: string;
    name: string;
    role: MemberRoleKey;
};
/** Col: Accounts' Doc */
interface Account {
    uid: string;
    avatar: string;
    bio: string | null;
    class: Class | "Teacher" | null;
    customTitle: string | null | undefined;
    email: string | null;
    insta: string | null;
    name: string;
    username: string;
    isSchool: boolean;
};

/** Col: Ebooks' Doc */
interface EBooks {
    name: string;
    thumbnail: string;
    title: string;
    published: boolean;
    timestamp: EpochTimeStamp;
    locked: boolean;
    owner: string[];
    price: number;
    files?: EbookFile;
};
/** Col: Ebooks' Doc files */
type EbookFile = {
    "pdf": EbookFileInfo;
    "pdf-compressed": EbookFileInfo;
    "epub": EbookFileInfo;
    "epub-compressed": EbookFileInfo;
    "bookId": string;
};
type EbookFileInfo = {
    link: string;
    size: number;
};

interface TempUser {
    "name": string,
    "bio": null,
    "isSchool": boolean,
    "customTitle": null,
    "class": null,
    "avatar": string,
    "email": string,
    "username": string,
    "insta": null
}