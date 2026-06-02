import { Queue } from "bullmq";
import { redisConnection } from "@/lib/redis";

export const escalationQueue = new Queue("escalation-queue", {
  connection: redisConnection
});