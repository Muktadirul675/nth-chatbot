import { MessageRole } from '@/generated/prisma/enums';
import { getStreamResult } from '@/lib/ai';
import { prisma } from '@/lib/prisma';
import { convertToModelMessages, UIMessage } from 'ai';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  console.log(`route uid: ${searchParams.get("uid")}`)
  const uid = searchParams.get("uid") ?? crypto.randomUUID()
  const { messages }: { messages: UIMessage[] } = await req.json()
  let chat_session_id = "";
  let chat_session_uid = "";
  const chat_session = await prisma.chatSession.findUnique({
    where: { uid: uid }, select: { id: true, uid: true }
  })

  const now = new Date();

  // DDMMYY
  const datePart =
    String(now.getDate()).padStart(2, "0") +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getFullYear()).slice(-2);

  // HHMMSS → number
  const timeNumber =
    now.getHours() * 10000 +
    now.getMinutes() * 100 +
    now.getSeconds();

  // convert to HEX
  const hexPart = timeNumber.toString(16).toUpperCase();

  // AM / PM flag
  const ampm = now.getHours() >= 12 ? "P" : "A";

  // final ID
  const formattedID = `N${datePart}${hexPart}${ampm}`;

  if (!chat_session) {
    const new_chat_session = await prisma.chatSession.create({
      data: {
        id: formattedID,
        uid: uid
      },
      select: { id: true, uid: true }
    })
    chat_session_id = new_chat_session.id
    chat_session_uid = new_chat_session.uid
    await prisma.message.createMany({
      data: messages.map((msg) => ({
        message: msg.parts.find((part) => part.type === 'text')?.text as string,
        chat_session_id: new_chat_session.id,
        role: (msg.role === 'assistant' ? MessageRole.assistant : MessageRole.user)
      }))
    })
  } else {
    chat_session_id = chat_session.id
    chat_session_uid = chat_session.uid
    const last_message = messages.at(-1)
    if (last_message) {
      await prisma.message.create({
        data: {
          message: last_message.parts.find((part) => part.type === 'text')?.text as string,
          chat_session_id: chat_session.id,
          role: (last_message.role === 'assistant' ? MessageRole.assistant : MessageRole.user)
        }
      })
    }
  }

  const modelMessages = await convertToModelMessages(messages);
  const result = await getStreamResult(modelMessages, chat_session_uid);

  return result.toUIMessageStreamResponse();
}

