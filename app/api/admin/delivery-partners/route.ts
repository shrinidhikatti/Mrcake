import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// GET - List all delivery partners
export async function GET() {
    try {
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const partners = await prisma.deliveryPartner.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { orders: true }
                }
            }
        })

        return NextResponse.json(partners)
    } catch (error) {
        console.error("Fetch Partners Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

// POST - Create new delivery partner
export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { name, phone, email, password, vehicleType, vehicleNumber } = body

        if (!name || !phone || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Check if phone already exists
        const existing = await prisma.deliveryPartner.findUnique({
            where: { phone }
        })

        if (existing) {
            return NextResponse.json({ error: "Phone number already registered" }, { status: 400 })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        const partner = await prisma.deliveryPartner.create({
            data: {
                name,
                phone,
                email: email || null,
                password: hashedPassword,
                vehicleType: vehicleType || null,
                vehicleNumber: vehicleNumber || null,
            }
        })

        // Don't return password
        const { password: _, ...partnerData } = partner

        return NextResponse.json(partnerData, { status: 201 })
    } catch (error) {
        console.error("Create Partner Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
