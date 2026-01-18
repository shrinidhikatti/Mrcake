import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// GET - Get single partner
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const partner = await prisma.deliveryPartner.findUnique({
            where: { id: params.id },
            include: {
                orders: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        })

        if (!partner) {
            return NextResponse.json({ error: "Partner not found" }, { status: 404 })
        }

        const { password: _, ...partnerData } = partner

        return NextResponse.json(partnerData)
    } catch (error) {
        console.error("Fetch Partner Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

// PATCH - Update partner
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
        const { name, phone, email, vehicleType, vehicleNumber, status, password } = body

        const updateData: any = {}
        if (name) updateData.name = name
        if (phone) updateData.phone = phone
        if (email !== undefined) updateData.email = email || null
        if (vehicleType !== undefined) updateData.vehicleType = vehicleType || null
        if (vehicleNumber !== undefined) updateData.vehicleNumber = vehicleNumber || null
        if (status) updateData.status = status
        if (password) {
            updateData.password = await bcrypt.hash(password, 10)
        }

        const partner = await prisma.deliveryPartner.update({
            where: { id: params.id },
            data: updateData
        })

        const { password: _, ...partnerData } = partner

        return NextResponse.json(partnerData)
    } catch (error) {
        console.error("Update Partner Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

// DELETE - Delete partner
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await prisma.deliveryPartner.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ message: "Partner deleted successfully" })
    } catch (error) {
        console.error("Delete Partner Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
