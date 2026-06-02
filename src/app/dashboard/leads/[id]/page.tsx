import { getLead } from "@/services/leads";
import UpdateLeadForm from "./form";

export default async function LeadPage({params}:{params:Promise<{id: string}>}){
    const {id} = await params;
    const lead = await getLead(id);
    if(!lead) {
        return <div className="p-5">Lead not found</div>
    }
    return <UpdateLeadForm lead={lead} />
}