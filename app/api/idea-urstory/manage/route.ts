import { decrypt } from '@/utils/crypt';
import { db } from '@/utils/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const body = url.searchParams;
  if (!body.has("action")) return NextResponse.json({ success: false, message: "Argument Missing" });
  if (!body.has("id")) return NextResponse.json({ success: false, message: "Argument Missing" });
  if (!body.has("key")) return NextResponse.json({ success: false, message: "Argument Missing" });
  if (!body.has("secret")) return NextResponse.json({ success: false, message: "Argument Missing" });
  const ref = doc(db, `idea-urstory/${body.get("id")}`);
  const data = await getDoc(ref);
  if (!data.exists()) return NextResponse.json({ success: false, message: "Query isn't valid" });
  const content = decrypt(body.get("key")!, body.get("secret")!);
  if (data.data().content?.slice(0, 6) !== content && data.data().url?.slice(0, 6) !== content) return NextResponse.json({ success: false, message: "You don't have the primission to access this feature!" });
  try {
    if (body.get("action") === "approve") {
      await updateDoc(doc(db, "idea-urstory", data.id), {
        status: 1
      });
    }
    if (body.get("action") === "deny") {
      await updateDoc(ref, {
        status: 2
      });
    }
    return NextResponse.json({ success: true, message: `本投稿已成功${body.get("action") === "approve" ? "確認" : "退回"}!` });
  } catch (err) {
    return NextResponse.json({ success: false, message: "I don't know how you grt this, but it's normally impossible!" });
  }
}