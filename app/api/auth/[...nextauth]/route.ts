import { Account, Member } from '@/types/firestore';
import { auth, db } from '@/utils/firebase';
import { getAccount, getRefDocFromCacheOrServer } from '@/utils/get-firestore';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
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
        const fac = await signInWithCredential(auth, credential);
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
        const res = { ...raw } as Account;
        if (raw.memberRef && raw.memberRef.path) {
          res.memberRef = raw.memberRef.path;
          const profile = await getRefDocFromCacheOrServer<Member>(raw.memberRef);
          const role = profile.role.path;
          res.rolePath = role;
        }
        res ? token.account = res : 0;
      }
      return token;
    },

    async session({ session, token }) {
      session.account = token.account;
      return session;
    },
  }
}

// const generatePassportId = (type: "MEMBERS" | "SCHOOL_ACCOUNT" | "GOOGLE_ACCOUNT", role?: number, admin?: boolean) => {
//   // CONFIG
//   const prefix1stE = "ASDFGHJKLZXCVBNMQWERTYUIOP";
//   const prefix1stD: { [x: string]: number } = { A: 10, S: 11, D: 12, F: 13, G: 14, H: 15, J: 16, K: 17, L: 18, Z: 19, X: 20, C: 21, V: 22, B: 23, N: 24, M: 25, Q: 26, W: 27, E: 28, R: 29, T: 30, Y: 31, U: 32, I: 33, O: 34, P: 35 };
//   const prefix2nd = {
//     "MEMBERS": [1, 4, 6],
//     "SCHOOL_ACCOUNT": [2, 7, 9],
//     "GOOGLE_ACCOUNT": [3, 5, 8],
//   }
//   // GENERATE
//   const idPrefixPart = `${prefix1stE[Math.floor(Math.random() * prefix1stE.length)]}${prefix2nd[type][Math.floor(Math.random() * prefix2nd[type].length)]}`;
//   const idSecondPart = role ? role.toString().padStart(5, '0') : [1, 3, 5, 7, 9].sort(() => 0.5 - Math.random()).join('');
//   const idLastPart = (prefix1stD[idPrefixPart[0]] + parseInt(idPrefixPart[1]) + idSecondPart.split('').reduce((acc, num) => { return acc + parseInt(num); }, 0) + (admin ? 0 : 1)).toString().padStart(3, "0").slice(0, 3);
//   return `${idPrefixPart}${idSecondPart}${idLastPart}`;
// }

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
