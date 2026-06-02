import { embed, embedMany } from 'ai';
import { jina } from 'jina-ai-provider';

const embeddingModel = jina.textEmbeddingModel('jina-embeddings-v2-base-en');

const generateEmbeddings = async (
  chunks: string[],
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
    providerOptions: {
      jina: {
        inputType: 'retrieval.passage',
      },
    },
  });
  return embeddings.map((embedding, index) => ({
    content: chunks[index]!,
    embedding,
  }));
};

export async function getChunkEmbeddings(chunks: string[]): Promise<{
  embedding: number[];
  content: string;
}[]> {
  const chunkEmbeddings = await generateEmbeddings(chunks)
  return chunkEmbeddings;
}

export async function getEmbedding(query: string) {
  const { embedding } = await embed({
    model: embeddingModel,
    value: query,
    providerOptions: {
      jina: {
        inputType: 'retrieval.passage',
      },
    },
  })
  return embedding;
}
