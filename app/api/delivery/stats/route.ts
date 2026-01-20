import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

// GET - Get delivery partner stats
export async function GET() {
    try {
        const session = await auth()

        if (!session || session.user.role !== 'DELIVERY_PARTNER') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const partnerId = session.user.id

        // Get partner's total deliveries
        const partner = await prisma.deliveryPartner.findUnique({
            where: { id: partnerId },
            select: { totalDeliveries: true }
        })

        return NextResponse.json({
            totalDeliveries: partner?.totalDeliveries || 0
        })
    } catch (error) {
        console.error("Fetch Delivery Stats Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
