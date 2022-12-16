import NextAuth from "next-auth"
import { Accounts, AccountsUni } from "./firestore"

declare module "next-auth" {
  interface Session {
    firestore: AccountsUni
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    firestore: AccountsUni
  }
}