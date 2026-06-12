import NextAuth, { User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { verifyUser } from "./services/verification"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            credentials: {
                username: { type: "text", label: "Username" },
                password: { type: "password", label: "Password" }
            },
            authorize: async (credentials) => {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }
                try {
                    // This calls your service logic
                    const user = await verifyUser(
                        credentials.username as string, 
                        credentials.password as string
                    )
                    return user; // Passes { id, name } to the jwt callback below
                } catch (error) {
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    // 🚨 CALLBACKS ARE REQUIRED TO TRANSITION DATA FROM AUTHORIZE TO SESSION 🚨
    callbacks: {
        async jwt({ token, user }) {
            // "user" is only available the first time this callback is run right after sign in
            if (user) {
                token.id = user.id;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            // Forward the data from the signed JWT token straight into the client-side session object
            if (session.user && token) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
            }
            return session;
        }
    }
})