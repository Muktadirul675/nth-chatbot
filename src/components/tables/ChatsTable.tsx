import Link from "next/link";

type Chat = {
  id: string;
  createdAt: Date;
  lead_captured: boolean;
  lead: {name: string, email: string} | null;
  escalated: boolean;
  _count: {
    messages: number;
  };
};

type Pagination = {
  page: number;
  totalPages: number;
  total: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
};

interface ChatsTableProps {
  chats: Chat[];
  pagination?: Pagination;
}

export default function ChatsTable({
  chats,
  pagination,
}: ChatsTableProps) {
  return (
    <div>
      <div className="border border-slate-200 rounded-md overflow-hidden shadow-sm bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="text-left p-3 font-medium">ID</th>
              <th className="text-left p-3 font-medium">Created</th>
              <th className="text-left p-3 font-medium">Messages</th>
              <th className="text-left p-3 font-medium">Lead</th>
              <th className="text-left p-3 font-medium">Escalated</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {chats.map((chat) => (
              <tr
                key={chat.id}
                className="hover:bg-slate-50 transition"
              >
                <td className="p-3">
                  <Link
                    href={`/dashboard/chats/${chat.id}`}
                    className="block font-medium text-slate-700 hover:text-slate-900"
                  >
                    {chat.id.slice(0, 8)}
                  </Link>
                </td>

                <td className="p-3 text-slate-600">
                  <Link
                    href={`/dashboard/chats/${chat.id}`}
                    className="block"
                  >
                    {new Date(chat.createdAt).toLocaleString()}
                  </Link>
                </td>

                <td className="p-3 text-slate-600">
                  <Link
                    href={`/dashboard/chats/${chat.id}`}
                    className="block"
                  >
                    {chat._count.messages}
                  </Link>
                </td>

                <td className="p-3 text-slate-600">
                  <Link
                    href={`/dashboard/chats/${chat.id}`}
                    className="block"
                  >
                    {chat.lead_captured
                      ? "Captured"
                      : "N/A"}
                  </Link>
                </td>

                <td className="p-3">
                  <Link
                    href={`/dashboard/chats/${chat.id}`}
                    className="block"
                  >
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        chat.escalated
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {chat.escalated ? "Yes" : "No"}
                    </span>
                  </Link>
                </td>
              </tr>
            ))}

            {chats.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-slate-500"
                >
                  No chats found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <p className="text-slate-500">
            Page{" "}
            <span className="font-medium text-slate-900">
              {pagination.page}
            </span>{" "}
            of {pagination.totalPages} • Total {pagination.total} records
          </p>

          <div className="flex gap-2">
            {pagination.hasPrevPage && (
              <Link
                href={`?page=${pagination.page - 1}`}
                className="px-3 py-1 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100"
              >
                ← Prev
              </Link>
            )}

            {pagination.hasNextPage && (
              <Link
                href={`?page=${pagination.page + 1}`}
                className="px-3 py-1 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100"
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}