import { OutputData } from "@editorjs/editorjs";
import { MemberRoleKey } from "../../tcsh_periodicals/types/role";
import { DocumentData, FieldValue } from "firebase/firestore";
import { CategoriesDocument } from "@/../tcsh_periodicals/types/firestore";
import { LangCode } from "./i18n";
import { DocumentReference } from "firebase/firestore";

/** Collections */
interface DB {
    Global: GlobalDB;
    Accounts: Account[]; /** Will Deceperate in Next.js 13 Version **/
    books: Books[];
    categoreis: CategoriesDocument[];
    notifications: Notification[];
    posts: PostDocument[];
    slides: Slide[];
    members: Members[];
}

/** Col: Global */
interface GlobalDB {
    About: About;
    Posts: Posts;
};

/** Col: Global => Doc: About */
interface About {
    zh: {
        description: string;
    },
    ja: {
        description: string;
    },
    en: {
        description: string;
    },
    de: {
        description: string;
    },
    description: string;
    email: string;
    insta: string;
};

/** Col: Notification */
interface Notification {
    order: number;
    button: {
        href: string;
        text: string;
    }
    title: string;
    type: "alert" | "error" | "success";
};

/** Col: Slides */
interface Slide {
    href: string;
    image: string;
    title: string;
    order: number
};

/** Col: Global => Doc: Posts Inner */
interface Posts {
    posts: Post[]
};

interface Post {
    categories: string[],
    thumbnail: string;
    title: string;
    url: string;
};

/** Col: Accounts or Member */
type AccountsUni = Accounts<"Account"> | Accounts<"Member">;
interface Accounts<Type extends "Member" | "Account"> {
    type: Type;
    data: Account;
};

type classLevel = "1" | "2" | "3";
type Class = `J${classLevel}${"1" | "2" | "3" | "4" | "5" | "6" | "7"}` | `S${classLevel}${"1" | "2" | "3" | "4" | "5"}`
/** Col: Members' Doc */
interface Members {
    team: number;
    teamId: string;
    present: boolean;
    profiles: Member[];
}
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
    class: Class | null;
    customTitle: string | null | undefined;
    email: string | null;
    insta: string | null;
    name: string;
    username: string;
    isSchool: boolean;
    memberRef: DocumentReference<DocumentData>;
    ownedBooks: string[];
};

/** Col: Ebooks' Doc */
interface EBooks {
    thumbnail: string;
    title: string;
    name: string;
    description: string;
    files: EbookFile;
    price: number;
    locked: boolean;
    published: boolean;
    timestamp: EpochTimeStamp;
    owner?: string[];
    voucher?: string[];
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

type EbookLicenses = {
    voucher: true;
    code: string;
    used: true;
    usedTimestamp: FieldValue;
    customer: DocumentReference;
    createdTimestamp: FieldValue;
} | {
    voucher: true;
    code: string;
    used: false;
    createdTimestamp: FieldValue;
} | {
    voucher: false;
    used: boolean;
    usedTimestamp: FieldValue;
    customer: DocumentReference;
    payment: "unlocked";
    createdTimestamp: FieldValue;
}


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

interface PostsCollection {
    [x: string]: PostDocument;
}

interface PostDocument {
    type?: number;
    title: string;
    thumbnail?: string;
    tag: string[];
    data: OutputData;
    owner: string;
    createdTimestamp: FieldValue;
    lastEditTimestamp: FieldValue;
}

type IdeaUrStory = {
    type: "text";
    content: string;
    createdTimestamp: FieldValue,
    class?: string;
    name?: string;
} | {
    type: "picture";
    file: File;
    url?: string;
    content: string;
    createdTimestamp: FieldValue,
    class?: string;
    name?: string;
} | {
    type: "voice";
    file: File;
    url?: string;
    content: string;
    createdTimestamp: FieldValue,
    class?: string;
    name?: string;
}

interface IdeaUrStoryConfig {
    accept: number[];
    anonymous: boolean;
    title: string;
    name: string;
    description: string;
    version: string;
    resultPublic: boolean;
}