import type {NextAuthConfig} from "next-auth";
import NextAuth from "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter";
import {prisma} from "@/db/prisma";
import CredentialsProvider from 'next-auth/providers/credentials'
import {compareSync} from "bcrypt-ts-edge";

export const config = {
    pages: {
        signIn: '/sign-in',
        error: '/sign-in', // Error code passed in query string as ?error=
    },
    session: {
        strategy: "jwt",
        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            credentials: {
                email: {type: 'email'},
                password: {type: 'password'},
            },
            async authorize(credentials) {
                if (credentials === null) return null

                // find user in db
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string,
                    }
                })

                // check if user exists and if the password matches
                if (user && user.password) {
                    const isMatch = compareSync(credentials.password as string, user.password)

                    // if password is correct return user
                    if (isMatch) {
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            role: user.role
                        }
                    }
                }

                // If user does not exist or password does not match, then return ull
                return null
            }
        })
    ],
    callbacks: {
        async session({session, user, trigger, token}: any) {
            // Set user ID from the token
            session.user.id = token.sub;

            //If there is an update, set the username
            if (trigger === 'update') {
                session.user.name = user.name
            }

            return session
        },
    }
} satisfies  NextAuthConfig

export const {handlers, auth, signIn, signOut} = NextAuth(config)
