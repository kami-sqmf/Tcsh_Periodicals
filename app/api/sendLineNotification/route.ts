import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    console.log((await req.json()).events[0].source)
    return NextResponse.json({ success: true, message: "Send Succcessfully" })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ success: false, message: err })
  }
}