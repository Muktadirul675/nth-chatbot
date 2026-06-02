import Link from "next/link";
import { BiCheck, BiEdit, BiMessage } from "react-icons/bi";
import { TiTimes } from "react-icons/ti";

type Lead = {
  id: string
  name: string;
  email: string;
  createdAt: Date;
  chat_session_id: string
  qualified: boolean
};

type Pagination = {
  page: number;
  totalPages: number;
  total: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
};

interface LeadsTableProps {
  leads: Lead[];
  pagination?: Pagination;
}

export default function LeadsTable({
  leads,
  pagination,
}: LeadsTableProps) {
  return (
    <div>
      <div className="border border-slate-200 rounded-md overflow-hidden shadow-sm bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Email</th>
              <th className="text-left p-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {leads.map((lead, index) => (
              <tr
                key={`${lead.email}-${index}`}
                className="hover:bg-slate-50 transition"
              >
                <td className="p-3 font-medium text-slate-700">
                  {lead.name}
                </td>

                <td className="p-3 text-slate-600">
                  <div className="flex gap-2 items-center flex-wrap">
                    {lead.email}
                    {lead.qualified ? (<BiCheck className="text-green-500"/>) : (<TiTimes className="text-red-500"/>)}
                  </div>
                </td>
                <td className="p-3 text-blue-700 flex gap-2 flex-wrap">
                  <Link href={`/dashboard/chats/${lead.chat_session_id}`}>
                    <BiMessage size={20} />
                  </Link>
                  <Link href={`/dashboard/leads/${lead.id}`}>
                    <BiEdit size={20} />
                  </Link>
                </td>
              </tr>
            ))}

            {leads.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="p-8 text-center text-slate-500"
                >
                  No leads found.
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
                href={`?page=${parseInt(`${pagination.page}`) - 1}`}
                className="px-3 py-1 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100"
              >
                ← Prev
              </Link>
            )}

            {pagination.hasNextPage && (
              <Link
                href={`?page=${parseInt(`${pagination.page}`) + 1}`}
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