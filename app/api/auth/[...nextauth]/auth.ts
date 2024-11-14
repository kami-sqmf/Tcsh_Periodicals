import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth"
import GoogleProvider from 'next-auth/providers/google';
import { auth as authFirebase, db } from '@/utils/firebase';
import { getAccount, getRefDocFromCacheOrServer } from "@/utils/get-firestore";
import { doc, setDoc } from "firebase/firestore";
import { Account, Member } from "@/types/firestore";
import lz from "lz-string";

function accountEncoding(str) {
  return lz.compressToEncodedURIComponent(JSON.stringify(str));
}
export function accountDecoding(str: string | null): Account | null {
  if (!str) return null;
  return JSON.parse(lz.decompressFromEncodedURIComponent(str));
}

export const config = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: '/accounts/signin',
  },

  callbacks: {
    async signIn({ account, profile }) {
      if (!account || !profile) return "/?error=2";
      if (account.provider != "google" || account.type != "oauth") return "/?error=3";
      if (!profile.email) return "/?error=4";
      try {
        const credential = GoogleAuthProvider.credential(account.id_token, account.access_token);
        const fac = await signInWithCredential(authFirebase, credential);
        const res = await getAccount(profile.email);
        if (res) return true;
        const signUp = await setDoc(doc(db, "accounts", fac.user.uid), {
          uid: fac.user.uid,
          name: profile.name,
          username: profile.name,
          email: profile.email,
          avatar: profile.picture,
          isSchool: !!profile.hd,
          class: null,
          customTitle: null,
          bio: null,
          insta: null,
          memberRef: null,
          ownedBook: null,
        });
      } catch (error: any) {
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log("錯誤： ", error, errorMessage, "電子郵件： ", email, "憑證： ", credential);
      }
      return true;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },

    async jwt({ token }) {
      if (token.email) {
        const raw = await getAccount(token.email);
        if (!raw) return token;
        const res = { ...raw } as unknown as Account;
        if (raw.memberRef && raw.memberRef.path) {
          res.memberRef = raw.memberRef.path;
          const profile = await getRefDocFromCacheOrServer<Member>(raw.memberRef);
          const role = profile.role.path;
          res.rolePath = role;
        }
        res ? token.account = accountEncoding(res) : 0;
      }
      return token;
    },

    async session({ session, token }) {
      session.account = token.account;
      return session;
    },
  }
} satisfies NextAuthOptions

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config)
}