import { getInformations } from "@/services/informations";
import Link from "next/link";
import { BiPlus } from "react-icons/bi";

export const dynamic = "force-dynamic"

export default async function InformationPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam || 1);

  const { data, pagination } = await getInformations(page);

  const truncate = (str: string, len: number) =>
    str.length > len ? str.slice(0, len) + "..." : str;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between">
          <div className="text-xl font-semibold text-slate-900">
            Information
          </div>
          <Link className="bg-primary text-white px-2 py-1.5 rounded cursor-pointer flex items-center gap-2" href="/dashboard/informations/add">
            <BiPlus size={10}/> Add New
          </Link>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Manage extracted URL data. Click any row to view full details.
        </p>
      </div>

      {/* Table */}
      <div className="border border-slate-200 rounded-md overflow-hidden shadow-sm bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="text-left p-3 font-medium">ID</th>
              <th className="text-left p-3 font-medium">URL</th>
              <th className="text-left p-3 font-medium">Content</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data.map((info) => (
              <tr
                key={info.id}
                className="hover:bg-slate-50 transition"
              >
                <td className="p-3">
                  <Link
                    href={`/dashboard/informations/${info.id}/edit`}
                    className="text-slate-700 font-medium hover:text-slate-900"
                  >
                    {truncate(info.id, 8)}
                  </Link>
                </td>

                <td className="p-3 text-slate-600">
                  <Link
                    href={`/dashboard/informations/${info.id}/edit`}
                    className="hover:text-slate-900"
                  >
                    {truncate(info.url ?? "N/A", 60)}
                  </Link>
                </td>

                <td className="p-3 text-slate-500">
                  <Link
                    href={`/dashboard/informations/${info.id}/edit`}
                    className="hover:text-slate-700"
                  >
                    {truncate(info.content ?? "", 40)}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm">
        <p className="text-slate-500">
          Page{" "}
          <span className="text-slate-900 font-medium">
            {pagination.page}
          </span>{" "}
          of {pagination.totalPages} • Total {pagination.total} records
        </p>

        <div className="flex gap-2">
          {pagination.hasPrevPage && (
            <Link
              href={`?page=${page - 1}`}
              className="px-3 py-1 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-100"
            >
              ← Prev
            </Link>
          )}

          {pagination.hasNextPage && (
            <Link
              href={`?page=${page + 1}`}
              className="px-3 py-1 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-100"
            >
              Next →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}