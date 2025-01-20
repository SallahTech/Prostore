// pages/api/auth/[...nextauth].ts
import NextAuth, {NextAuthConfig} from "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter";
import {prisma} from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import {compare} from "@/lib/encryp";

export const config = {
    pages: {
        signIn: '/sign-in',
        error: '/sign-in', // Error code passed in query string as ?error=
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials: any) {
                if (!credentials) return null;

                const user = await prisma.user.findFirst({
                    where: {email: credentials.email},
                });


                if (user && user.password) {
                    const isMatch = await compare(credentials.password, user.password);
                    if (isMatch) {
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            role: user.role,
                        };
                    }
                }
                return null;
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async session({session, token}: any) {
            session.user = {
                id: token.sub,
                role: token.role,
                name: token.name,
            };
            return session;
        },
        async jwt({token, user}: any) {
            if (user) {
                token.role = user.role;
                token.name = user.name;
            }
            return token;
        },
    },
} satisfies  NextAuthConfig;

export const {handlers, auth, signIn, signOut} = NextAuth(config)
