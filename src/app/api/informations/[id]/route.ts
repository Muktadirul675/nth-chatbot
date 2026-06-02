import { deleteInformation, updateInformation } from "@/services/informations";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { url, content } = await req.json();
    const res = await updateInformation(id, url, content)
    return NextResponse.json(res, { status: 200 });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const res = await deleteInformation(id);
    return NextResponse.json(res, { status: 200 });
}
