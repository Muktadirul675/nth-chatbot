import { openai } from '@ai-sdk/openai';
import { generateText } from "ai"

const SYSTEM_PROMPT = `
You are an expert in creating chunks from given text paragraph. These chunks will be used for embedding.
Return a list of strings where each string is a chunk. Even if there is only one chunk, include that in the list too. 
IMPORTANT: You must return a list of strings. No extra texts.
OUTPUT FORMAT:
[chunk1, chunk2, chunk3...]
`

async function chunkText(text: string) : Promise<string[]>{
    const result = await generateText({
        model: openai('gpt-5'),
        system: SYSTEM_PROMPT,
        prompt: text
    })
    const chunks = JSON.parse(result.text)
    return chunks;
}

export async function generateChunks(text: string) : Promise<string[]>{
    const chunks = await chunkText(text)
    return chunks;
}