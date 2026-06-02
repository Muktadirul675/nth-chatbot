import { generateChunks } from "@/lib/rag/chunking";
import { createChunks } from "@/services/chunking";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const text = searchParams.get('text');

    if (!text) {
        return NextResponse.json({
            error: "No Query Text is Given"
        }, { status: 400 })
    }
    const chunks = await generateChunks(text);
    
    return NextResponse.json({
        chunks: chunks
    }, { status: 200 })
}

export async function POST(req: NextRequest) {
    const { informationId, chunks, url } = await req.json()
    const res = await createChunks(informationId, chunks, url)

    return NextResponse.json({
        chunks: res
    }, { status: 201 })
}
