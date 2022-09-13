import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
    //   if (req.nextUrl.pathname === "/accounts") {
    //     return token?.userRole === "accounts"
    //   }
      return !!token
    },
  },
})

export const config = { matcher: ["/accounts"] }