import { RazorpayOrderOptions } from 'razorpay/dist/types/orders'

// This is a server-side utility
export const createRazorpayOrder = async (amount: number) => {
    // Mock order creation for development
    return {
        id: `order_${Math.random().toString(36).substring(7)}`,
        amount: amount * 100,
        currency: 'INR',
    }
}

// Client-side loader
export const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })
}
