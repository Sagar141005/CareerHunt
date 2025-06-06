import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from '../utils/redis.js';

const rateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: 'rate-limit',
    points: 100,
    duration: 60,
});

const rateLimiterMiddleware = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Authentication required for rate limiting.' });
        }

        const key = req.user.id;
        await rateLimiter.consume(key);
        next();
    } catch (error) {
        res.status(429).json({ message: 'Too Many Requests. Try again later.' });
    }
};


export default rateLimiterMiddleware;