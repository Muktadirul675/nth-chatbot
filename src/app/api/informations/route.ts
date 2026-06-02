import { prisma } from "@/lib/prisma";
import { generateChunks } from "@/lib/rag/chunking";
import { getChunkEmbeddings } from "@/lib/rag/embedding";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { url, content } = await req.json();

  const rawChunks = await generateChunks(content);
  const chunks = await getChunkEmbeddings(rawChunks);

  // 1. create parent record
  const info = await prisma.information.create({
    data: {
      url,
      content,
    },
    select: {
      id: true,
      url: true,
      content: true,
    },
  });

  // 2. insert chunks (RAW SQL because of pgvector)
  for (const chunk of chunks) {
    await prisma.$executeRaw`
      INSERT INTO "InformationChunk"
      (id, content, url, "informationId", embedding, "createdAt")
      VALUES (
        gen_random_uuid(),
        ${chunk.content},
        ${url},
        ${info.id},
        ${`[${chunk.embedding.join(",")}]`}::vector,
        now()
      )
    `;
  }

  return NextResponse.json(
    {
      res: info,
      chunksInserted: chunks.length,
    },
    { status: 201 }
  );
}