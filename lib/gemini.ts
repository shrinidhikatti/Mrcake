import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(apiKey)

export const geminiModel = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
})

export async function generateProductRecommendations(userPreferences: string) {
    const prompt = `You are a helpful bakery assistant for MrCake. Based on the user's preferences: "${userPreferences}", recommend 3 bakery products from these categories: Cakes, Pastries, Breads, Cookies. Be concise and friendly.`

    try {
        const result = await geminiModel.generateContent(prompt)
        return result.response.text()
    } catch (error) {
        console.error('Gemini API error:', error)
        return 'Sorry, I couldn unable to generate recommendations at the moment.'
    }
}

export async function chatWithAssistant(message: string, context?: string) {
    const systemPrompt = `You are a friendly AI assistant for MrCake bakery. Help customers with:
- Product recommendations
- Order information
- Delivery details
- Ingredient questions
- Custom cake requests

Be warm, helpful, and concise. ${context || ''}`

    const prompt = `${systemPrompt}\n\nCustomer: ${message}\nAssistant:`

    try {
        const result = await geminiModel.generateContent(prompt)
        return result.response.text()
    } catch (error) {
        console.error('Gemini API error:', error)
        return 'Sorry, I am having trouble responding right now. Please try again.'
    }
}

