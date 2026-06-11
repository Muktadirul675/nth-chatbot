import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { verifyUser } from "./services/verification"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [Credentials({
        credentials: {
            username: {
                type: "username",
                label: "Username"
            },
            password: {
                type: "password",
                label: "Password"
            }
        },
        authorize: async (credentials) => {
            if (!credentials.username || !credentials.password) {
                throw new Error("Invalid Credentials")
            }
            const user = await verifyUser(credentials.username as string, credentials.password as string)
            if (user) {
                return user;
            }
            throw new Error("Invalid Credentials")
        }
    })],
})