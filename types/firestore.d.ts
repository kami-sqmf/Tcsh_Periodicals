import { MemberRoleKey } from "./role";

interface Accounts<Type extends "Member" | "Account"> {
    type: Type;
    data: Type extends "Member" ? Member : Account;
};

type AccountsUni = Accounts<"Account"> | Accounts<"Member">

interface Member {
    avatar: string;
    bio: string;
    class: Class;
    customTitle: string | null | undefined;
    email: string | null;
    insta: string;
    name: string;
    role: MemberRoleKey;
};

interface Account {
    avatar: string;
    bio: string | null;
    class: Class | "Teacher" | null;
    customTitle: string | null | undefined;
    email: string | null;
    insta: string | null;
    name: string;
    username: string;
};

type classLevel = "1" | "2" | "3";
type Class = `J${classLevel}${"1" | "2" | "3" | "4" | "5" | "6" | "7"}` | `S${classLevel}${"1" | "2" | "3" | "4" | "5"}`

interface GlobalDB {
    About: About;
    Notification: Notifications;
    Posts: Posts;
    Slide: Slides;
};

interface About {
    description: string;
    email: string;
    insta: string;
};

interface Notifications {
    Now: Notification[];
};

interface Notification {
    button: {
        href: string;
        text: string;
    }
    title: string;
    type: "alert" | "error" | "success";
};

interface Posts {
    posts: Post[];
};

interface Post {
    categories: string[],
    thumbnail: string;
    title: string;
    url: string;
};

interface Slides {
    title: string;
    slide: Slide[];
};

interface Slide {
    href: string;
    image: string;
};

interface DB {
    Global: GlobalDB;
    Members: Member[];
    Accounts: Account[];
}