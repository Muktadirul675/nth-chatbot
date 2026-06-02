import { Message } from "@/generated/prisma/client";
import { sendEmail } from "../lib/email";
import { prisma } from "../lib/prisma";
import { redisConnection } from "../lib/redis";
import { Worker } from "bullmq";
import { SETTINGS_TRANSCRIPT_RECEIVERS_KEY } from "@/lib/globals";
import { getSetting } from "@/services/settings";

async function fetchFullChat(chat_session_id: string) {
  const chatSession = await prisma.chatSession.findUnique({
    where: { uid: chat_session_id },
    select: { messages: true }
  })
  if(!chatSession) {
    throw new Error("Chat session not found");
  }
  return chatSession.messages;
}

function buildTranscript(messages: Message[]) {
  return messages
    .map((m) => `${m.role.toUpperCase()}: ${m.message}`)
    .join("\n");
}

export const leadWorker = new Worker(
  "lead-queue",
  async (job) => {
    const { chat_session_id, name, email } = job.data;
    const {id : chat_id} = await prisma.chatSession.findUnique({
      where: { uid: chat_session_id },
      select: { id: true }
    }) || {};
    if(chat_id) {
      await prisma.lead.create({
        data: {
          chat_session_id: chat_id,
          name: name,
          email: email
        }
      });
    }
    // 1. fetch full chat
    const messages = await fetchFullChat(chat_session_id);

    // 2. build transcript
    const transcript = buildTranscript(messages);
    const recievers : string[] = JSON.parse((await getSetting(SETTINGS_TRANSCRIPT_RECEIVERS_KEY) ?? "[]"))
    // 3. send email
    for (const reciever of recievers) {
      await sendEmail({
        to: reciever,
        body: `Name: ${name} & Email : ${email}\nChat Transcript:\n${transcript}
        `,
        subject: `NTH Chatbot - New Lead Captured!`
      })
    }
    await prisma.chatSession.update({
      where: { uid: chat_session_id },
      data: {
        lead_captured: true,
      }
    })
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

leadWorker.on("completed", (job) => {
  console.log(`Lead processed: ${job.id}`);
});

leadWorker.on("failed", (job, err) => {
  console.error(`Lead failed: ${job?.id}`, err);
});

console.log("Lead Worker Started")
