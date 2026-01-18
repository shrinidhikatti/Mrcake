import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { items, subtotal, deliveryFee, total, addressData } = body

        if (!items || items.length === 0 || !addressData) {
            return NextResponse.json({ error: "Missing order data" }, { status: 400 })
        }

        // 1. Ensure address exists or create it
        let address = await prisma.address.findFirst({
            where: {
                userId: session.user.id,
                fullName: addressData.name,
                address: addressData.address,
                pincode: addressData.pincode
            }
        })

        if (!address) {
            address = await prisma.address.create({
                data: {
                    userId: session.user.id,
                    fullName: addressData.name,
                    phone: addressData.phone,
                    address: addressData.address,
                    city: addressData.city,
                    state: "Default", // In a real app, this would come from form
                    pincode: addressData.pincode,
                }
            })
        }

        // 2. Create Order
        const orderNumber = `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId: session.user.id,
                addressId: address.id,
                subtotal: parseFloat(subtotal),
                deliveryFee: parseFloat(deliveryFee),
                tax: 0, // Simplified
                total: parseFloat(total),
                status: "PENDING",
                paymentStatus: "PAID", // Assuming payment success for this demo/flow
                deliveryDate: new Date(Date.now() + 86400000), // Default to next day
                deliverySlot: "Anytime",
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        customization: item.customization || ""
                    }))
                }
            },
            include: {
                items: true
            }
        })

        return NextResponse.json(order)

    } catch (error) {
        console.error("Order Creation Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
