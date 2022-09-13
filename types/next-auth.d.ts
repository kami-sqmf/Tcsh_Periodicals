import NextAuth from "next-auth"
import { Accounts, Members } from "./firestore"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    firestore: Accounts | Members
  }
}