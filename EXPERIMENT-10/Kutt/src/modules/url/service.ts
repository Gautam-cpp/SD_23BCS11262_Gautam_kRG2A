import prisma from '@/lib';
import redis from '@/lib/redis';
import { encode } from '@/lib/shortcode';

export class UrlService {
    static async shortenUrl(longUrl: string, expiry?: Date, userId?: number) {
        // Increment the Redis counter to get a unique sequential integer ID
        const counterId = await redis.incr('url_shortcode_counter');
        
        // Encode the integer ID to our custom shortcode format
        const shortCode = encode(counterId);

        const urlRecord = await prisma.url.create({
            data: {
                shortCode,
                longUrl,
                expiresAt: expiry || null,
                userId: userId || null,
            },
        });

        const CACHE_TTL = parseInt(process.env.CACHE_TTL || '3600', 10);
        const cacheData = JSON.stringify({
            longUrl,
            expiresAt: expiry ? expiry.toISOString() : null,
        });
        await redis.set(`url:${shortCode}`, cacheData, 'EX', CACHE_TTL);

        return { shortCode, id: urlRecord.id, createdAt: urlRecord.createdAt };
    }
}
