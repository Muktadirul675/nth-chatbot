import { deleteLead, updateLead } from "@/services/leads";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const {name, email} = await req.json();
    const res = await updateLead(id, name, email);
    if(!res) {
        return new Response(JSON.stringify({message: "Lead not found"}), {status: 404});
    }
    return new Response(JSON.stringify(res), {status: 200});
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const res = await deleteLead(id);
    if(!res) {
        return new Response(JSON.stringify({message: "Lead not found"}), {status: 404});
    }
    return new Response(JSON.stringify({message: "Lead deleted successfully"}), {status: 200});
}