import ChatsTable from "@/components/tables/ChatsTable";
import { getChats } from "@/services/chats";


export default async function ChatsPage({ searchParams }: { searchParams: Promise<{ page: number }> }) {
    const { page } = await searchParams;
    const chats = await getChats(page ?? 1)
    return <div className="w-full md:w-1/2 mx-auto my-5">
        <h3 className="text-2xl mt-2 mb-4 font-semibold">Chat Sessions</h3>
        <ChatsTable chats={chats.chats} pagination={chats.pagination} />
    </div>
}