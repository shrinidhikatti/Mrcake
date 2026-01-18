import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// PATCH - Assign delivery partner to order
export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { deliveryPartnerId } = body

        if (!deliveryPartnerId) {
            return NextResponse.json({ error: "Delivery partner ID required" }, { status: 400 })
        }

        // Verify partner exists and is available
        const partner = await prisma.deliveryPartner.findUnique({
            where: { id: deliveryPartnerId }
        })

        if (!partner) {
            return NextResponse.json({ error: "Delivery partner not found" }, { status: 404 })
        }

        // Get current order to append to history
        const currentOrder = await prisma.order.findUnique({
            where: { id: params.id }
        })

        if (!currentOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }

        // Parse existing history or create new
        let statusHistory = []
        try {
            statusHistory = currentOrder.statusHistory ? JSON.parse(currentOrder.statusHistory) : []
        } catch (e) {
            statusHistory = []
        }

        // Add assignment to history
        statusHistory.push({
            status: 'ASSIGNED',
            timestamp: new Date().toISOString(),
            note: `Assigned to ${partner.name}`
        })

        // Update order
        const order = await prisma.order.update({
            where: { id: params.id },
            data: {
                deliveryPartnerId,
                status: 'ASSIGNED',
                statusHistory: JSON.stringify(statusHistory)
            },
            include: {
                deliveryPartner: true,
                user: true,
                address: true,
                items: {
                    include: { product: true }
                }
            }
        })

        // Update partner status to BUSY if they have active orders
        const activeOrders = await prisma.order.count({
            where: {
                deliveryPartnerId,
                status: {
                    in: ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY']
                }
            }
        })

        if (activeOrders > 0) {
            await prisma.deliveryPartner.update({
                where: { id: deliveryPartnerId },
                data: { status: 'BUSY' }
            })
        }

        return NextResponse.json(order)
    } catch (error) {
        console.error("Assign Partner Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
