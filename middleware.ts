import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      if (req.nextUrl.pathname === "/accounts/signin" || req.nextUrl.pathname === "/accounts/signout") {
        return true
      }
      return !!token
    },

  },
})

export const config = { matcher: ["/accounts"] }