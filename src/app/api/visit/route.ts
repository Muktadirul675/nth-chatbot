import { getCorsHeaders } from "@/lib/cors";
import { VISITOR_KEY } from "@/lib/globals";
import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function OPTIONS(req: NextRequest) {
    const origin = req.headers.get("origin");

    return new NextResponse(null, {
        status: 204,
        headers: getCorsHeaders(origin),
    });
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get("origin");

    const uid = req.nextUrl.searchParams.get("uid");

    if (!uid) {
        return NextResponse.json(
            {
                error: "No Chat Session received",
            },
            {
                status: 400,
                headers: getCorsHeaders(origin),
            }
        );
    }

    await redis.incr(VISITOR_KEY);

    return NextResponse.json(
        {
            success: true,
        },
        {
            status: 200,
            headers: getCorsHeaders(origin),
        }
    );
}