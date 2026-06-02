// src/lib/queue/leadQueue.ts
import { Queue } from "bullmq";
import { redis, redisConnection } from "@/lib/redis";

export const leadQueue = new Queue("lead-queue", {
  connection: redisConnection,
});