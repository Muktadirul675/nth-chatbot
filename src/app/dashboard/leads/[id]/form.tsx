"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { LuLoader, LuUser, LuMail } from "react-icons/lu";

interface Lead {
  id: string;
  name: string;
  email: string;
  qualified: boolean;
}

interface UpdateLeadFormProps {
  lead: Lead;
}

export default function UpdateLeadForm({
  lead,
}: UpdateLeadFormProps) {
  const router = useRouter();

  const [name, setName] = useState(lead.name);
  const [email, setEmail] = useState(lead.email);

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // UPDATE lead
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message || "Failed to update lead"
        );
      }

      toast.success("Lead updated successfully");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  // DELETE lead
  async function handleDelete() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);

      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message || "Failed to delete lead"
        );
      }

      toast.success("Lead deleted successfully");
      router.push("/dashboard/leads");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setDeleting(false);
    }
  }

  // TOGGLE QUALIFIED
  async function toggleQualified() {
    try {
      setUpdatingStatus(true);

      const res = await fetch(`/api/leads/${lead.id}/toggle-qualified`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qualified: !lead.qualified,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message || "Failed to update status"
        );
      }

      toast.success(
        lead.qualified
          ? "Marked as disqualified"
          : "Marked as qualified"
      );

      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setUpdatingStatus(false);
    }
  }

  return (
    <div className="my-5 w-full md:w-1/2 mx-auto p-6 bg-[#fcfcfc] border border-[#eef0f1] rounded-xl shadow-sm">

      {/* HEADER */}
      <div className="mb-6 border-b border-[#eef0f1] pb-4">
        <h1 className="text-xl font-semibold text-[#1c1c1c] tracking-tight">
          Update Lead
        </h1>
        <p className="text-sm text-[#687076] mt-1">
          Manage lead information and qualification status.
        </p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">

        {/* NAME */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#687076] uppercase tracking-wider flex items-center gap-1.5">
            <LuUser className="w-3.5 h-3.5" />
            Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading || deleting}
            className="px-3 py-2 text-sm bg-white border border-[#dcdede] rounded-md"
          />
        </div>

        {/* EMAIL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#687076] uppercase tracking-wider flex items-center gap-1.5">
            <LuMail className="w-3.5 h-3.5" />
            Email
          </label>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || deleting}
            className="px-3 py-2 text-sm bg-white border border-[#dcdede] rounded-md"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#eef0f1]">

          {/* DELETE */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading || deleting || updatingStatus}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
          >
            {deleting ? (
              <span className="flex items-center gap-2">
                <LuLoader className="w-4 h-4 animate-spin" />
                Deleting...
              </span>
            ) : (
              "Delete"
            )}
          </button>

          <div className="flex gap-3">

            {/* QUALIFY TOGGLE */}
            <button
              type="button"
              onClick={toggleQualified}
              disabled={loading || deleting || updatingStatus}
              className={`px-4 py-2 text-sm font-medium rounded-md border transition ${
                lead.qualified
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                  : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
              }`}
            >
              {updatingStatus ? (
                <span className="flex items-center gap-2">
                  <LuLoader className="w-4 h-4 animate-spin" />
                  Updating...
                </span>
              ) : lead.qualified ? (
                "Mark Disqualified"
              ) : (
                "Mark Qualified"
              )}
            </button>

            {/* CANCEL */}
            <button
              type="button"
              onClick={() =>
                router.push("/dashboard/leads")
              }
              disabled={loading || deleting || updatingStatus}
              className="px-4 py-2 text-sm font-medium text-[#687076] bg-white border border-[#dcdede] rounded-md hover:bg-[#f8f9fa]"
            >
              Cancel
            </button>

            {/* UPDATE */}
            <button
              type="submit"
              disabled={loading || deleting || updatingStatus}
              className="px-4 py-2 text-sm font-medium text-white bg-[#df2a34] hover:bg-[#c8212a] rounded-md"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <LuLoader className="w-4 h-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}