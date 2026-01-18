import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET - Get orders for logged-in user
export async function GET() {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const orders = await prisma.order.findMany({
            where: { userId: session.user.id },
            include: {
                address: true,
                deliveryPartner: true,
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                images: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(orders)
    } catch (error) {
        console.error("Fetch User Orders Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
