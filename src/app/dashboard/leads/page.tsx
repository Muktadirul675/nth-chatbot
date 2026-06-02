import LeadsTable from "@/components/tables/LeadsTable";
import { getLeads } from "@/services/leads";

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ page: number }> }) {
    const { page } = await searchParams;
    const leads = await getLeads(page ?? 1)
    return <div className="w-full md:w-1/2 mx-auto my-5">
        <h3 className="text-2xl mt-2 mb-4 font-semibold">Leads</h3>
        <LeadsTable leads={leads.data} pagination={leads.pagination} />
    </div>
}