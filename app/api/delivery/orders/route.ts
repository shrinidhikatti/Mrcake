import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "fallback-secret")

async function verifyDeliveryToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret)
        return payload
    } catch {
        return null
    }
}

// GET - Get assigned orders for delivery partner
export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const token = authHeader.substring(7)
        const payload = await verifyDeliveryToken(token)

        if (!payload || payload.role !== 'DELIVERY_PARTNER') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const partnerId = payload.id as string

        // Get orders assigned to this partner
        const orders = await prisma.order.findMany({
            where: {
                deliveryPartnerId: partnerId,
                status: {
                    in: ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY']
                }
            },
            include: {
                user: {
                    select: { name: true, phone: true }
                },
                address: true,
                items: {
                    include: {
                        product: {
                            select: { name: true, images: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(orders)
    } catch (error) {
        console.error("Fetch Delivery Orders Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
