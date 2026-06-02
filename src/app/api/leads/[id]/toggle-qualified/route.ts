import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const {qualified} = await req.json();
    const res = await prisma.lead.update({
        where: { id },
        data: {
            qualified
        }
    })
    if(!res) {
        return new Response(JSON.stringify({message: "Lead not found"}), {status: 404});
    }  
    return new Response(JSON.stringify(res), {status: 200});
}