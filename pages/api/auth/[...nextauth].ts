import { addDoc, collection } from 'firebase/firestore';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { encrypt } from '../../../utils/crypt';
import { db } from '../../../utils/firebase';
import { getAccount } from '../../../utils/get-firestore';

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
            const res = await getAccount(profile.email);
            if (res) return true;
            const secretR = await addDoc(collection(db, "Accounts"), {
                name: profile.name,
                username: profile.name,
                email: profile.email,
                avatar: profile.picture,
                isSchool: !!profile.hd,
                class: null,
                customTitle: null,
                bio: null,
                insta: null,
            });
            // const secret = encrypt(secretR.id);
            return true;
        },

        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },

        async jwt({ token }) {
            if (token.email) {
                const res = await getAccount(token.email);
                res ? token.firestore = res : 0;
            }
            return token;
        },

        async session({ session }) {
            if (session.user) {
                if (session.user.email) {
                    const res = await getAccount(session.user.email);
                    res ? session.firestore = res : 0;
                }
            }
            return session;
        },
    },
}

export default NextAuth(authOptions);