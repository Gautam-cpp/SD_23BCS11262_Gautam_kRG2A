import 'dotenv/config';
import prisma from '@/lib';
import redis from '@/lib/redis';

async function processAnalyticsTokens() {
    console.log('Starting Analytics Worker...');

    while (true) {
        try {
            const item = await redis.brpop('analytics_queue', 5);

            if (item) {
                const [, value] = item;
                const entry = JSON.parse(value);

                const urlRecord = await prisma.url.findUnique({
                    where: { shortCode: entry.shortCode },
                    select: { id: true },
                });

                if (urlRecord) {
                    await prisma.$transaction([
                        prisma.clickAnalytics.create({
                            data: {
                                urlId: urlRecord.id,
                                shortCode: entry.shortCode,
                                timestamp: new Date(entry.timestamp),
                                ipAddress: entry.ipAddress,
                                referrer: entry.referrer,
                                userAgent: entry.userAgent,
                                country: entry.country,
                            },
                        }),
                        prisma.url.update({
                            where: { id: urlRecord.id },
                            data: { clickCount: { increment: 1 } },
                        }),
                    ]);
                    console.log(` Processed click for ${entry.shortCode}`);
                } else {
                    console.log(`URL not found for short code: ${entry.shortCode}`);
                }
            }
        } catch (error) {
            console.error(' Error processing analytics queue:', error);
            await new Promise(res => setTimeout(res, 2000));
        }
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await prisma.$disconnect();
    redis.quit();
    process.exit(0);
});

processAnalyticsTokens();
