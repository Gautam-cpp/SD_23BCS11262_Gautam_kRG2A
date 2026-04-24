import prisma from '@/lib';
import redis from '@/lib/redis';
import { decode } from '@/lib/shortcode';

export class RedirectService {
    static async getUrlAndRecordClick(shortCode: string, clickData: {
        ipAddress?: string;
        referrer?: string;
        userAgent?: string;
        country?: string; // e.g. from CF-IPCountry header
    }): Promise<string | null> {
        const cacheKey = `url:${shortCode}`;

        const cachedData = await redis.get(cacheKey);
        let originalUrl: string | null = null;
        let isExpired = false;

        if (cachedData) {
            // Cache HIT
            const parsed = JSON.parse(cachedData);
            if (parsed.expiresAt && new Date(parsed.expiresAt) <= new Date()) {
                isExpired = true;
            } else {
                originalUrl = parsed.longUrl;
            }
        } else {
            const decodedUrl = decode(shortCode);
            const urlRecord = await prisma.url.findUnique({
                where: { id: decodedUrl },
            });

            if (urlRecord) {
                if (urlRecord.expiresAt && urlRecord.expiresAt <= new Date()) {
                    isExpired = true;
                } else {
                    originalUrl = urlRecord.longUrl;

                    const CACHE_TTL = parseInt(process.env.CACHE_TTL || '3600', 10);
                    await redis.set(
                        cacheKey,
                        JSON.stringify({
                            longUrl: urlRecord.longUrl,
                            expiresAt: urlRecord.expiresAt ? urlRecord.expiresAt.toISOString() : null,
                        }),
                        'EX',
                        CACHE_TTL
                    );
                }
            }
        }

        if (isExpired || !originalUrl) {
            return null;
        }

        const clickRecord = {
            shortCode,
            timestamp: new Date().toISOString(),
            ...clickData,
        };
        await redis.lpush('analytics_queue', JSON.stringify(clickRecord));

        return originalUrl;
    }
}
