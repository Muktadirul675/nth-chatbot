import Redis from 'ioredis';
import dotenv from "dotenv";
dotenv.config();

export const redisConnection = {
  host: process.env.REDIS_HOST!,
  port: 6379,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null, // Critical for BullMQ
  keepAlive: 30000,
};

export const redis = new Redis(redisConnection);