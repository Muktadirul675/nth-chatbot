import { prisma } from "@/lib/prisma";
import { escalationQueue } from "@/lib/queue/escalationQueue";
import { Worker } from "bullmq";

export const escalationWorker = new Worker(
  "escalation-request",
  async (job) => {
    const { chat_session_id } = job.data;

    if (!chat_session_id) {
      throw new Error("Missing chat_session_id");
    }

    const session = await prisma.chatSession.findUnique({
      where: {
        uid: chat_session_id,
      },
    });

    if (!session) {
      throw new Error(`Chat session not found: ${chat_session_id}`);
    }

    await prisma.chatSession.update({
      where: {
        uid: chat_session_id,
      },
      data: {
        escalated: true,
      },
    });

    return {
      success: true,
      chat_session_id,
    };
  },
  {
    connection: escalationQueue.opts.connection,
  }
);

escalationWorker.on("completed", (job) => {
  console.log(`Escalation processed: ${job.id}`);
});

escalationWorker.on("failed", (job, err) => {
  console.error(`Escalation failed: ${job?.id}`, err);
});

console.log("Escalation Worker Started")
