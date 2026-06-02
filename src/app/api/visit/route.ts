import { VISITOR_KEY } from "@/lib/globals";
import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const uid = req.nextUrl.searchParams.get("uid")
    if (!uid) {
        return NextResponse.json({
            "error": "No Chat Session recieved"
        }, { status: 400 })
    }

    await redis.incr(VISITOR_KEY)

    return NextResponse.json({
        "success": true,
    }, { status: 200 })
}