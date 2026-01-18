import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// Update Order Status
export async function PATCH(req: Request) {
    try {
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { orderId, status } = await req.json()

        if (!orderId || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 })
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status }
        })

        return NextResponse.json(updatedOrder)

    } catch (error) {
        console.error("Admin Order Update Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
