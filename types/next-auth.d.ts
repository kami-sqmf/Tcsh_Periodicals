import NextAuth from "next-auth"
import { Accounts, AccountsUni } from "./firestore"

declare module "next-auth" {
  interface Session {
    firestore: AccountsUni
  }
  interface Profile {
    hd: string;
    picture: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    firestore: AccountsUni
  }
}