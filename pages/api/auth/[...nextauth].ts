import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { addDoc, collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import { encrypt } from '../../../utils/crypt';
import { Accounts, Members } from '../../../types/firestore';

export default NextAuth({

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    pages: {
        signIn: '/accounts/signin',
        signOut: '/accounts/signout'
    },

    callbacks: {
        async signIn({
            user, account, profile, email, credentials,
        }) {
            if (account.provider == "google" && account.type == "oauth") {
                if (profile.hd) {
                    if (profile.hd == "tcsh.hlc.edu.tw") return true;
                }
            }
            // alert("登入失敗，請使用慈大附中 Email")
            return "/";
        },

        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },

        async session({ session, token, user }) {
            session.accessToken = token.accessToken;
            const querySnapshot = await getDocs(query(collection(db, "Accounts"), where("email", "==", session.user?.email)))
            querySnapshot.forEach((doc) => {
                session.firestore = { uid: doc.id, ...doc.data() as Accounts }
            });
            if (!session.firestore) {
                const querySnapshot = await getDocs(query(collection(db, "Members"), where("email", "==", session.user?.email)))
                querySnapshot.forEach((doc) => {
                    session.firestore = { uid: doc.id, ...doc.data() as Members }
                });
            }
            return session;
        },
    },
});  