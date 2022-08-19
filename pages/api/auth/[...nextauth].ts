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
            const userFind = await getDocs(query(collection(db, 'users'), where(`linked.${account.provider}`, '==', account.providerAccountId)));
            if (userFind.empty) {
                const info = encrypt(account.providerAccountId);
                const linked: linkedProvider = {};
                linked[account.provider as 'google'] = account.providerAccountId;
                addDoc(collection(db, 'users'), {
                    username: '',
                    email: profile.email,
                    name: profile.name,
                    password: '',
                    avatar: user.image,
                    linked,
                    bio: '',
                    type: 'public',
                    website: '',
                    pronouns: '',
                } as Users);
                return true;
            }
            const userProfile = userFind.docs[0].data();
            if (userProfile.password == '') {
                const info = encrypt(account.providerAccountId);
                return true;
            }
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