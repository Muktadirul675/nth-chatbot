import { prisma } from "@/lib/prisma";
import { getChunkEmbeddings } from "@/lib/rag/embedding";

export async function createChunks(informationID: string, chunks: string[], url:string|null=null){
    if(chunks.length>0){
        const embeddedChunks = await getChunkEmbeddings(chunks)
        const dbChunks = await prisma.informationChunk.createManyAndReturn({
            data: embeddedChunks.map((chunk)=>({
                informationId: informationID,
                content: chunk.content,
                embeddings: chunk.embedding,
                url: url
            }))
        })
        return dbChunks
    }
    return null;
}