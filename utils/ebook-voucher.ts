import { EbookLicenses } from "@/types/firestore";
import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "./firebase";

export const createEbookVoucher = async (bookId: string, amount: number) => {
  const batch = writeBatch(db);
  const vouchers = Array.from({ length: amount }, () => makeid(12));
  vouchers.forEach((voucher) => batch.set(doc(db, "books", bookId, "license", voucher), {
    voucher: true,
    used: false,
    code: voucher,
    createdTimestamp: serverTimestamp()
  } as EbookLicenses))
  await batch.commit();
  return vouchers;
}

export const makeid = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}