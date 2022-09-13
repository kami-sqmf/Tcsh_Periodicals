import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone()
    if (url.pathname == "/accounts") {
        const session = await getToken({ req })
        console.log(session)
        if (!session) return NextResponse.redirect(new URL("/accounts/signin", req.url))
    }

    return NextResponse.next()
}