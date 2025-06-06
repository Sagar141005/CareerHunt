import redis from "./redis.js";

export const getOrSetCache = async (key, cb, ttl = 60) => {
    const cached = await redis.get(key);

    if(cached) {
        return JSON.parse(cached);
    }

    const freshData = await cb();
    await redis.set(key, JSON.stringify(freshData), 'EX', ttl);
    return freshData;
}

export default getOrSetCache;