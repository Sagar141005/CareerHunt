import dotenv from 'dotenv';
dotenv.config();
import { Redis } from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
});
  

redis.on('connect', () => console.log("Redis connected"));
redis.on('error', err => console.error("Redis error", err.message));

export default redis;
