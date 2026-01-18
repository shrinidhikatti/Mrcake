// Simple in-memory rate limiter
// For production, use Redis-based solution like @upstash/ratelimit

interface RateLimitStore {
    [key: string]: {
        count: number
        resetTime: number
    }
}

const store: RateLimitStore = {}

// Clean up old entries every 10 minutes
setInterval(() => {
    const now = Date.now()
    Object.keys(store).forEach(key => {
        if (store[key].resetTime < now) {
            delete store[key]
        }
    })
}, 600000)

export interface RateLimitConfig {
    interval: number // in milliseconds
    maxRequests: number
}

export function rateLimit(identifier: string, config: RateLimitConfig): boolean {
    const now = Date.now()
    const record = store[identifier]

    // If no record or reset time has passed, create new record
    if (!record || record.resetTime < now) {
        store[identifier] = {
            count: 1,
            resetTime: now + config.interval
        }
        return true
    }

    // Check if limit exceeded
    if (record.count >= config.maxRequests) {
        return false
    }

    // Increment count
    record.count++
    return true
}

export function getRemainingRequests(identifier: string, maxRequests: number): number {
    const record = store[identifier]
    if (!record || record.resetTime < Date.now()) {
        return maxRequests
    }
    return Math.max(0, maxRequests - record.count)
}

export function getResetTime(identifier: string): number | null {
    const record = store[identifier]
    if (!record || record.resetTime < Date.now()) {
        return null
    }
    return record.resetTime
}
