import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyDeliveryToken } from "@/lib/deliveryAuth"

// PATCH - Update order status by delivery partner
export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
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
        const body = await req.json()
        const { status, note } = body

        // Validate status is one of the allowed values
        const validStatuses = ['PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED']
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 })
        }

        // Get current order
        const currentOrder = await prisma.order.findUnique({
            where: { id: params.id }
        })

        if (!currentOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }

        // Verify this order is assigned to this partner
        if (currentOrder.deliveryPartnerId !== partnerId) {
            return NextResponse.json({ error: "Not authorized for this order" }, { status: 403 })
        }

        // Validate status transition
        const validTransitions: Record<string, string[]> = {
            ASSIGNED: ['PICKED_UP'],
            PICKED_UP: ['OUT_FOR_DELIVERY'],
            OUT_FOR_DELIVERY: ['DELIVERED']
        }

        if (!validTransitions[currentOrder.status]?.includes(status)) {
            return NextResponse.json({
                error: `Cannot transition from ${currentOrder.status} to ${status}`
            }, { status: 400 })
        }

        // Parse and update status history
        let statusHistory = []
        try {
            statusHistory = currentOrder.statusHistory ? JSON.parse(currentOrder.statusHistory) : []
        } catch (e) {
            statusHistory = []
        }

        statusHistory.push({
            status,
            timestamp: new Date().toISOString(),
            note: note || `Status updated to ${status}`
        })

        // Update order
        const updateData: any = {
            status,
            statusHistory: JSON.stringify(statusHistory)
        }

        // If COD and Delivered, mark as PAID
        if (status === 'DELIVERED' &&
            (currentOrder.paymentMethod === 'COD' || currentOrder.paymentMethod === 'CASH') &&
            currentOrder.paymentStatus === 'PENDING'
        ) {
            updateData.paymentStatus = 'PAID'
        }

        const order = await prisma.order.update({
            where: { id: params.id },
            data: updateData,
            include: {
                deliveryPartner: true,
                user: true,
                address: true,
                items: {
                    include: { product: true }
                }
            }
        })

        // If delivered, increment partner's total deliveries and check if should be AVAILABLE
        if (status === 'DELIVERED') {
            await prisma.deliveryPartner.update({
                where: { id: partnerId },
                data: {
                    totalDeliveries: { increment: 1 }
                }
            })

            // Check if partner has any more active orders
            const activeOrders = await prisma.order.count({
                where: {
                    deliveryPartnerId: partnerId,
                    status: {
                        in: ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY']
                    }
                }
            })

            if (activeOrders === 0) {
                await prisma.deliveryPartner.update({
                    where: { id: partnerId },
                    data: { status: 'AVAILABLE' }
                })
            }
        }

        return NextResponse.json(order)
    } catch (error) {
        console.error("Update Order Status Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
