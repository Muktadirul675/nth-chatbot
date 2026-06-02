import { prisma } from "../prisma";
import { getEmbedding } from "./embedding";

export async function getSimilars(query: string) {
  const queryEmbedding = await getEmbedding(query);

  if (!Array.isArray(queryEmbedding)) {
    throw new Error("Embedding is not an array");
  }

  const vector = `[${queryEmbedding.map(Number).join(",")}]`;

  const results = await prisma.$queryRaw<
    {
      id: string;
      content: string;
      url: string | null;
      similarity: number;
    }[]
  >`
    SELECT 
      id,
      content,
      url,
      embedding <-> ${vector}::vector AS similarity
    FROM "InformationChunk"
    ORDER BY embedding <-> ${vector}::vector
    LIMIT 5;
  `;

  return results;
}