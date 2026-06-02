import { openai } from '@ai-sdk/openai';
import { ModelMessage, stepCountIs, streamText } from "ai";
import { getSystemPrompt } from "./prompt";
import { detectEscalation, leadTool, searchKnowledge } from "./tools";
import { prisma } from "../prisma";
import { MessageRole } from "@/generated/prisma/enums";

export async function getStreamResult(messages: ModelMessage[], chat_session_id: string) {
  const query = messages.at(-1)?.content
  if (!query) {
    throw new Error("Query is invalid")
  }
  const systemPrompt = await getSystemPrompt(chat_session_id)

  const result = streamText({
    model: openai('gpt-5'),
    system: systemPrompt,
    messages,
    tools: {
      knowledge: searchKnowledge,
      lead: leadTool,
      escalation: detectEscalation
    },
    stopWhen: stepCountIs(5),
    async onFinish({ text }) {
      await prisma.message.create({
        data: {
          message: text,
          chat_session: {
            connect:{
              uid: chat_session_id
            }
          },
          role: MessageRole.assistant,
        },
      });
    },
  });
  return result;
}