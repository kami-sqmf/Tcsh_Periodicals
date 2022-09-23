import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
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
                    if (profile.hd == "tcsh.hlc.edu.tw") {
                        let result = {}
                        const querySnapshot = await getDocs(query(collection(db, "Accounts"), where("email", "==", profile.email)))
                        querySnapshot.forEach((doc) => {
                            result = { uid: doc.id, ...doc.data() as Accounts }
                        });
                        if (Object.getOwnPropertyNames(result).length === 0) {
                            const querySnapshot = await getDocs(query(collection(db, "Members"), where("email", "==", profile.email)))
                            querySnapshot.forEach((doc) => {
                                result = { uid: doc.id, ...doc.data() as Members }
                            });
                        }
                        if(Object.getOwnPropertyNames(result).length === 0){
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
                        }else{
                            return true;
                        }
                    }
                }
            }
            return "/?error=1";
        },

        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },

        async jwt({ token }) {
            const querySnapshot = await getDocs(query(collection(db, "Accounts"), where("email", "==", token.email)))
            querySnapshot.forEach((doc) => {
                token.firestore = { uid: doc.id, ...doc.data() as Accounts }
            });
            if (!token.firestore) {
                const querySnapshot = await getDocs(query(collection(db, "Members"), where("email", "==", token.email)))
                querySnapshot.forEach((doc) => {
                    token.firestore = { uid: doc.id, ...doc.data() as Members }
                });
            }
            return token;
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