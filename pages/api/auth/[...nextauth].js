import { addDoc, collection } from 'firebase/firestore';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { encrypt } from '../../../utils/crypt';
import { db } from '../../../utils/firebase';
import { getAccount } from '../../../utils/get-firestore';

export default NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],

    pages: {
        signIn: '/accounts/signin',
        signOut: '/accounts/signout'
    },

    callbacks: {
        async signIn({ account, profile }) {
            if (account.provider == "google" && account.type == "oauth") {
                if (profile.hd && profile.email) {
                    if (profile.hd == "tcsh.hlc.edu.tw") {
                        const res = await getAccount(profile.email)
                        if (!res) {
                            const secretR = await addDoc(collection(db, "Temp"), {
                                avatar: profile.picture,
                                bio: null,
                                class: null,
                                customTitle: null,
                                email: profile.email,
                                insta: null,
                                username: profile.name,
                                name: profile.name,
                            })
                            const secret = encrypt(secretR.id)
                            return `/accounts/signup?i=${secret.iv}&c=${secret.content}`
                        } else {
                            return true
                        }
                    }
                }
            }
            return "/?error=1";
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

        async session({ session, token }) {
            session.accessToken = token.accessToken;
            if (session.user) {
                if (session.user.email) {
                    const res = await getAccount(session.user.email);
                    res ? session.firestore = res : 0;
                }
            }
            return session;
        },
    },
});  