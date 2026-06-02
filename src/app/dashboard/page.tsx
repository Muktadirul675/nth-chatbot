import ChatsTable from "@/components/tables/ChatsTable"
import LeadsTable from "@/components/tables/LeadsTable"
import { getEngagementRate, getEscalationRate, getLeadCaptureRate, getLeadQualificationRate } from "@/services/analytics"
import { getLatestChats } from "@/services/chats"
import { getLatestLeads } from "@/services/leads"

export default async function DashboardPage() {
    const lead_capture_rate = await getLeadCaptureRate()
    const engagement_rate = await getEngagementRate()
    const escalation_rate = await getEscalationRate()
    const leads = await getLeadQualificationRate()

    const latestLeads = await getLatestLeads()
    const latestChats = await getLatestChats()

    return <div className="p-3">
        <h3 className="text-4xl mb-5">
            Dashboard
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

            <div className="bg-primary rounded-md text-white p-3">
                <h3 className="text-2xl">
                    {lead_capture_rate.lead_capture_rate}%
                </h3>
                <h5 className="text-sm opacity-90">
                    {lead_capture_rate.lead_captured_sessions} / {lead_capture_rate.total_sessions} Lead Capture
                </h5>
            </div>

            <div className="bg-primary rounded-md text-white p-3">
                <h3 className="text-2xl">
                    {engagement_rate.engagement_rate}%
                </h3>
                <h5 className="text-sm opacity-90">
                    {engagement_rate.total_sessions} / {engagement_rate.total_visitors} Visitors Engaged
                </h5>
            </div>

            <div className="bg-primary rounded-md text-white p-3">
                <h3 className="text-2xl">
                    {escalation_rate.lead_escalation_rate}%
                </h3>
                <h5 className="text-sm opacity-90">
                    {escalation_rate.lead_escalated_sessions} / {escalation_rate.total_sessions} Chats Escalated
                </h5>
            </div>

            <div className="bg-primary rounded-md text-white p-3">
                <h3 className="text-2xl">
                    {leads.rate}%
                </h3>
                <h5 className="text-sm opacity-90">
                    {leads.qualified_leads} / {leads.total_leads} Leads Qualified
                </h5>
            </div>

        </div>
        <div className="flex gap-2 my-4">
            <div className="w-1/3">
                <h3 className="text-base mb-1 font-semibold">
                    Latest Leads
                </h3>
                <LeadsTable leads={latestLeads} />
            </div>
            <div className="w-2/3">
                <h3 className="text-base mb-1 font-semibold">
                    Latest Chat Sessions
                </h3>
                <ChatsTable chats={latestChats} />
            </div>
        </div>
    </div>
}