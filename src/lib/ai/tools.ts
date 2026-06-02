import { tool } from "ai";
import { z } from 'zod';
import { getSimilars } from "../rag/retrieval";
import { leadQueue } from "../queue/leadQueue";
import { escalationQueue } from "../queue/escalationQueue";
import { createLead } from "@/services/leads";

export const detectEscalation = tool({
  description:
    "Called when the LLM determines the user explicitly wants to speak with a human expert or Nth team member.",
  inputSchema: z.object({
    chat_session_id: z.string().describe("The active chat session ID"),
    reason: z.string().optional(),
  }),
  execute: async ({ chat_session_id, reason }) => {
    await escalationQueue.add(
      "escalation-request",
      {
        chat_session_id,
        reason: reason ?? "user_requested_human_assistance",
        type: "human_handoff",
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 3000,
        },
      }
    );

    return {
      success: true,
      status: "escalation_queued",
    };
  },
});

export const searchKnowledge = tool({
  description: `
Search Nth Generation's internal knowledge base.
Use this before answering any question about: services, solutions, technologies, expertise, case studies, industries, company information, cloud, cybersecurity, networking, AI, managed services, consulting, or partnerships.
Always generate a detailed search query. Never use vague searches like "pricing" or "security".
`,
  inputSchema: z.object({
    query: z.string(),
  }),
  execute: async ({ query }) => {
    const docs = await getSimilars(query);
    return docs.map(doc => ({
      content: doc.content,
      url: doc.url,
    }));
  },
});

export const leadTool = tool({
  description: "Call immediately when both name and email are explicitly available from the user dialogue.",
  inputSchema: z.object({
    chat_session_id: z.string().describe("The active chat session ID"),
    name: z.string(),
    email: z.string(),
  }),
  execute: async ({ chat_session_id, name, email }) => {
    await leadQueue.add(
      "process-lead",
      {
        chat_session_id,
        name,
        email,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
      }
    );

    // CRITICAL FIX: Return a structural value to ensure the agent 
    // loops back cleanly to generate the text response stream.
    return {
      success: true,
      status: "lead_captured",
    };
  },
});