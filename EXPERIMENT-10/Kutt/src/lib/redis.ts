import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const createRedisClient = () => {
    return new Redis(redisUrl, {
        maxRetriesPerRequest: null,
    });
};

declare global {
    var redisGlobal: undefined | ReturnType<typeof createRedisClient>;
}

const redis = globalThis.redisGlobal ?? createRedisClient();

export default redis;

if (process.env.NODE_ENV !== 'production') globalThis.redisGlobal = redis;
