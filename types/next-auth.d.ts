import NextAuth from "next-auth"
import { Account } from "./firestore";

declare module "next-auth" {
  interface Session {
    account: string;
  }
  interface Profile {
    hd: string;
    picture: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    account: string;
  }
}