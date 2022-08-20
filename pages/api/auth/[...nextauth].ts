import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { addDoc, collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import { encrypt } from '../../../utils/crypt';

export default NextAuth({

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    pages: {
        signIn: 'accounts/login',
    },

    callbacks: {
        async signIn({
            user, account, profile, email, credentials,
        }) {
            return true;
        },

        async jwt({ token, account }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },

        async session({ session, token, user }) {
            session.accessToken = token.accessToken;
            return session;
        },
    },
});  