import AIMessage from "@/components/ui/AIMessage";
import UserMessage from "@/components/ui/UserMessage";
import { getChat } from "@/services/chats";
import { Metadata } from "next";

export const metadata : Metadata = {
    title : "Chat Transcript"
}

type Lead = {
    name: string,
    email: string
}

function ChatLead({
    lead,
    leadCaptured,
}: {
    lead: Lead | null;
    leadCaptured: boolean;
}) {
    if (!leadCaptured) {
        return (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-2xl font-bold text-slate-700">
                    No Lead Captured
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    The visitor did not submit any contact information during
                    this conversation.
                </p>
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                <h3 className="text-2xl font-bold text-amber-800">
                    Lead Deleted
                </h3>

                <p className="mt-1 text-sm text-amber-700">
                    Contact information was captured during the chat but the
                    lead record has since been removed.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
            <h3 className="text-2xl font-bold text-green-800">
                Lead Captured
            </h3>

            <p className="mt-1 text-sm text-green-700">
                This visitor successfully submitted their contact
                information.
            </p>

            <div className="flex flex-col gap-2 mt-2">
                <div className="rounded-lg bg-white/70 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-green-700">
                        Name
                    </p>

                    <p className="mt-1 text-base font-semibold text-slate-900">
                        {lead.name}
                    </p>
                </div>

                <div className="rounded-lg bg-white/70 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-green-700">
                        Email
                    </p>

                    <p className="mt-1 text-base font-semibold text-slate-900 break-all">
                        {lead.email}
                    </p>
                </div>
            </div>
        </div>
    );
}
function EscalationCard({
    escalated,
}: {
    escalated: boolean;
}) {
    if (!escalated) {
        return (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-2xl font-bold text-slate-700">
                    Not Escalated
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    This conversation stayed within the chatbot and did not require human intervention.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <h3 className="text-2xl font-bold text-red-700">
                Escalated
            </h3>

            <p className="mt-1 text-sm text-red-600">
                This chat was escalated to a human agent due to complexity, user request, or system trigger.
            </p>

            <div className="mt-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm font-medium text-red-700">
                    Requires attention
                </span>
            </div>
        </div>
    );
}

function InboxReplica({ messages }: { messages: { role: string, content: string }[] }) {
    return <div className="w-full bg-slate-50 p-3 rounded-lg flex flex-col gap-2 border border-gray-300">
        {messages.map((msg, index) => {
            if (msg.role === 'user') {
                return <UserMessage key={index} content={msg.content} />
            } else if (msg.role === 'assistant') {
                return <AIMessage key={index} content={msg.content} />
            }
        })}
    </div>
}

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const chat = await getChat(id);
    if (!chat) {
        return <div>Chat Not Found</div>
    }
    return <div className="p-3 rounded-lg w-2/3 mx-auto my-5">
        <div className="p-3 rounded-lg bg-primary text-white mb-3">
            <h3 className="text-xl">Chat Session #{chat.id}</h3>
            <h3>Initiated At: {new Date(chat.createdAt).toLocaleDateString()}</h3>
        </div>
        <div className="flex gap-2 mb-3">
            <ChatLead leadCaptured={chat.lead_captured} lead={chat.lead} />
            <EscalationCard escalated={chat.escalated} />
        </div>
        <InboxReplica messages={chat.messages.map((msg) => ({ role: msg.role, content: msg.message }))} />
    </div>
}
