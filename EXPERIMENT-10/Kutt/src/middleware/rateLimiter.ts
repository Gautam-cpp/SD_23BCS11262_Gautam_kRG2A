import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';

const RATE_LIMIT = parseInt(process.env.RATE_LIMIT || '10', 10);
const WINDOW_DURATION = 60; // 1 minute in seconds

export async function rateLimit(req: NextRequest) {
    let ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    if (ip.includes(',')) {
        ip = ip.split(',')[0].trim();
    }

    const key = `rate_limit:${ip}`;

    try {
        const currentCount = await redis.incr(key);

        if (currentCount === 1) {
            await redis.expire(key, WINDOW_DURATION);
        }

        if (currentCount > RATE_LIMIT) {
            return NextResponse.json(
                { error: 'Rate limit exceeded' },
                { status: 429 }
            );
        }
    } catch (error) {
        console.error('Redis Rate Limit Error:', error);
    }

    return null;
}
