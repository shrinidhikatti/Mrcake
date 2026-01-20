import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { rateLimit } from "@/lib/rateLimit"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                // Rate limiting: 5 attempts per 15 minutes per email
                const identifier = `login:${credentials.email}`
                const rateLimitOk = rateLimit(identifier, {
                    interval: 15 * 60 * 1000, // 15 minutes
                    maxRequests: 5
                })

                if (!rateLimitOk) {
                    throw new Error('Too many login attempts. Please try again later.')
                }

                // First, try to find in User table
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                })

                if (user && user.password) {
                    const isValid = await bcrypt.compare(
                        credentials.password as string,
                        user.password
                    )

                    if (isValid) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            role: user.role,
                        }
                    }
                }

                // If not found in User table, check DeliveryPartner table
                const deliveryPartner = await prisma.deliveryPartner.findUnique({
                    where: { email: credentials.email as string },
                })

                if (deliveryPartner && deliveryPartner.password) {
                    const isValid = await bcrypt.compare(
                        credentials.password as string,
                        deliveryPartner.password
                    )

                    if (isValid) {
                        return {
                            id: deliveryPartner.id,
                            name: deliveryPartner.name,
                            email: deliveryPartner.email,
                            image: null,
                            role: 'DELIVERY_PARTNER',
                        }
                    }
                }

                return null
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role as string
            }
            return token
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
                session.user.role = token.role as string
            }
            return session
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production'
            }
        }
    },
})
