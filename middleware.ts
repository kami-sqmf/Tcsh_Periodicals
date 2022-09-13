import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone()
    if (url.pathname == "/accounts") {
        const session = await getToken({ req, secret });
        if (!session) return NextResponse.redirect(new URL("/accounts/signin", req.url))
    }

    return NextResponse.next()
}