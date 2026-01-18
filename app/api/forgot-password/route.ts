import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            )
        }

        // Rate limiting: 3 password reset requests per hour per email
        const identifier = `forgot-password:${email}`
        const rateLimitOk = rateLimit(identifier, {
            interval: 60 * 60 * 1000, // 1 hour
            maxRequests: 3
        })

        if (!rateLimitOk) {
            return NextResponse.json(
                { error: 'Too many password reset requests. Please try again later.' },
                { status: 429 }
            )
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email }
        })

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                message: 'If an account exists with this email, you will receive a password reset link.'
            })
        }

        // Generate reset token
        const token = crypto.randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 3600000) // 1 hour from now

        // Delete any existing tokens for this email
        await prisma.passwordResetToken.deleteMany({
            where: { email }
        })

        // Create new reset token
        await prisma.passwordResetToken.create({
            data: {
                email,
                token,
                expiresAt
            }
        })

        // In production, send email here
        // For now, log the reset link (remove in production!)
        const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password/${token}`
        console.log('Password Reset Link:', resetLink)

        // TODO: Send email with reset link
        // await sendPasswordResetEmail(email, resetLink)

        return NextResponse.json({
            message: 'If an account exists with this email, you will receive a password reset link.'
        })

    } catch (error) {
        console.error('Forgot Password Error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
