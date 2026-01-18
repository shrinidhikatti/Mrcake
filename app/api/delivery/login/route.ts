import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"
import { rateLimit } from "@/lib/rateLimit"
import { getAuthSecret } from "@/lib/deliveryAuth"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { phone, password } = body

        if (!phone || !password) {
            return NextResponse.json({ error: "Phone and password required" }, { status: 400 })
        }

        // Rate limiting: 5 attempts per 15 minutes per phone
        const rateLimitOk = rateLimit(`delivery-login:${phone}`, {
            interval: 15 * 60 * 1000,
            maxRequests: 5
        })

        if (!rateLimitOk) {
            return NextResponse.json({ error: "Too many login attempts. Please try again later." }, { status: 429 })
        }

        // Find partner
        const partner = await prisma.deliveryPartner.findUnique({
            where: { phone }
        })

        if (!partner) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        // Verify password
        const isValid = await bcrypt.compare(password, partner.password)
        if (!isValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        // Create JWT token
        const token = await new SignJWT({
            id: partner.id,
            phone: partner.phone,
            role: 'DELIVERY_PARTNER'
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .sign(getAuthSecret())

        // Update partner status to AVAILABLE on login
        await prisma.deliveryPartner.update({
            where: { id: partner.id },
            data: { status: 'AVAILABLE' }
        })

        const { password: _, ...partnerData } = partner

        return NextResponse.json({
            partner: partnerData,
            token
        })
    } catch (error) {
        console.error("Delivery Login Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
