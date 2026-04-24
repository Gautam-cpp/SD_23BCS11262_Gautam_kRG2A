import 'dotenv/config';
import prisma from '@/lib';
import redis from '@/lib/redis';

const CLEANUP_INTERVAL_MS = 1000 * 60 * 60; // Run every hour

async function cleanupExpiredUrls() {
    console.log('Starting Expiry Cleanup Worker...');

    while (true) {
        try {
            console.log(`[${new Date().toISOString()}] Checking for expired URLs...`);

            const now = new Date();
            // Find expired URLs
            const expiredUrls = await prisma.url.findMany({
                where: {
                    expiresAt: { lte: now },
                    userId: null,
                },
            });

            if (expiredUrls.length > 0) {
                const result = await prisma.url.deleteMany({
                    where: {
                        expiresAt: { lte: now },
                        userId: null,
                    },
                });

                console.log(`Deleted ${result.count} expired URLs from DB.`);

                // Invalidate from cache
                for (const url of expiredUrls) {
                    if (url.shortCode) {
                        await redis.del(`url:${url.shortCode}`);
                    }
                }
            } else {
                console.log('No expired URLs found.');
            }
        } catch (error) {
            console.error('Error in Expiry Worker:', error);
        }

        // Sleep till next interval
        await new Promise(res => setTimeout(res, CLEANUP_INTERVAL_MS));
    }
}

process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await prisma.$disconnect();
    redis.quit();
    process.exit(0);
});

cleanupExpiredUrls();
