import { withAuth } from "next-auth/middleware"
import { Accounts, instanceOfMembers, Members } from "./types/firestore"

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      if (req.nextUrl.pathname === "/accounts/signin" || req.nextUrl.pathname === "/accounts/signout" || req.nextUrl.pathname === "/accounts/signup") {
        return true
      }
      if (req.nextUrl.pathname.startsWith("/admin")) {
        if(!token) return false
        return isAdmin(token.firestore)
      }
      return !!token
    },

  },
})

export const config = { matcher: ["/admin/:path*", "/accounts"] }

export function isAdmin(firestore: Members | Accounts){
  if(!instanceOfMembers(firestore)) return false
  return Math.trunc(firestore.role / 100) == 5 || firestore.role % 100 == 0
}