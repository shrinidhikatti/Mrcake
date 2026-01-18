import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.AUTH_SECRET)

if (!secret || !process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET environment variable is required")
}

export async function verifyDeliveryToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret)
        if (payload.role !== 'DELIVERY_PARTNER') {
            return null
        }
        return payload
    } catch {
        return null
    }
}

export function getAuthSecret() {
    if (!process.env.AUTH_SECRET) {
        throw new Error("AUTH_SECRET environment variable is required")
    }
    return new TextEncoder().encode(process.env.AUTH_SECRET)
}
