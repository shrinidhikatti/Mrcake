import { NextRequest, NextResponse } from 'next/server'
import { chatWithAssistant } from '@/lib/gemini'

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json()

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        const response = await chatWithAssistant(message)

        return NextResponse.json({ response })
    } catch (error) {
        console.error('Chat API error:', error)
        return NextResponse.json(
            { error: 'Failed to process chat message' },
            { status: 500 }
        )
    }
}
