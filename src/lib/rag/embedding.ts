import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";

const embeddingModel = openai.embedding("text-embedding-3-small");

const generateEmbeddings = async (
  chunks: string[],
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });

  return embeddings.map((embedding, index) => ({
    content: chunks[index]!,
    embedding,
  }));
};

export async function getChunkEmbeddings(
  chunks: string[],
): Promise<
  {
    embedding: number[];
    content: string;
  }[]
> {
  return generateEmbeddings(chunks);
}

export async function getEmbedding(query: string) {
  const { embedding } = await embed({
    model: embeddingModel,
    value: query,
  });

  return embedding;
}