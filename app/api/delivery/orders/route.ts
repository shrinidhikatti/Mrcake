import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

// GET - Get assigned orders for delivery partner
export async function GET(req: Request) {
    try {
        const session = await auth()

        if (!session || session.user.role !== 'DELIVERY_PARTNER') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const partnerId = session.user.id

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
