"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  LuLink,
  LuFileText,
  LuLoader,
  LuDownload,
} from "react-icons/lu";

interface UpdateInformationPageProps {
  information: {
    id: string;
    url: string | null;
    content: string;
  };
}

export default function UpdateInformationForm({
  information,
}: UpdateInformationPageProps) {
  const router = useRouter();

  const [url, setUrl] = useState(information.url ?? "");
  const [content, setContent] = useState(information.content);

  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this information?"
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);

      const res = await fetch(
        `/api/informations/${information.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message || "Failed to delete information"
        );
      }

      toast.success("Information deleted successfully");

      router.push("/dashboard/informations");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setDeleting(false);
    }
  }

  async function handleExtract() {
    if (!url) {
      toast.error("Please enter a URL first");
      return;
    }

    try {
      setExtracting(true);

      const res = await fetch(
        `/api/informations/url-extract?url=${encodeURIComponent(url)}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message || "Failed to extract content from URL"
        );
      }

      setContent(data.content || "");
      toast.success("Content extracted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to extract content"
      );
    } finally {
      setExtracting(false);
    }
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        `/api/informations/${information.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            content,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message || "Failed to update information"
        );
      }

      toast.success("Information updated successfully");

      router.push("/dashboard/informations");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="my-5 w-full md:w-1/2 mx-auto p-6 bg-[#fcfcfc] border border-[#eef0f1] rounded-xl shadow-sm">
      <div className="mb-6 border-b border-[#eef0f1] pb-4">
        <h1 className="text-xl font-semibold text-[#1c1c1c] tracking-tight">
          Update Knowledge Source
        </h1>
        <p className="text-sm text-[#687076] mt-1">
          Modify the source URL or content stored in your
          knowledge base.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="url"
            className="text-xs font-medium text-[#687076] flex items-center gap-1.5 uppercase tracking-wider"
          >
            <LuLink className="w-3.5 h-3.5" />
            Source URL
          </label>

          <div className="flex gap-2">
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading || extracting}
              placeholder="https://example.com/docs"
              className="flex-1 px-3 py-2 text-sm bg-white border border-[#dcdede] rounded-md text-[#1c1c1c] placeholder-[#a0a0a0] shadow-sm transition-colors focus:outline-none focus:border-[#df2a34] focus:ring-1 focus:ring-[#df2a34]"
            />

            <button
              type="button"
              onClick={handleExtract}
              disabled={
                loading || extracting || !url.trim()
              }
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#687076] bg-white border border-[#dcdede] rounded-md hover:bg-[#f8f9fa] hover:text-[#1c1c1c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap min-w-[90px] justify-center"
            >
              {extracting ? (
                <LuLoader className="w-4 h-4 animate-spin text-[#df2a34]" />
              ) : (
                <>
                  <LuDownload className="w-3.5 h-3.5" />
                  Extract
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="content"
            className="text-xs font-medium text-[#687076] flex items-center gap-1.5 uppercase tracking-wider"
          >
            <LuFileText className="w-3.5 h-3.5" />
            Context Content
          </label>

          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            disabled={loading || extracting}
            placeholder="Paste your markdown or plain text here..."
            className="w-full px-3 py-2 text-sm bg-white border border-[#dcdede] rounded-md text-[#1c1c1c] placeholder-[#a0a0a0] shadow-sm transition-colors focus:outline-none focus:border-[#df2a34] focus:ring-1 focus:ring-[#df2a34] resize-y"
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#eef0f1]">

          {/* Delete button */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading || extracting || deleting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-colors disabled:opacity-70"
          >
            {deleting ? (
              <>
                <LuLoader className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              disabled={loading || extracting || deleting}
              onClick={() =>
                router.push("/dashboard/informations")
              }
              className="px-4 py-2 text-sm font-medium text-[#687076] bg-white border border-[#dcdede] rounded-md hover:bg-[#f8f9fa]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || extracting || deleting}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#df2a34] hover:bg-[#c8212a] rounded-md shadow-sm transition-colors disabled:opacity-70"
            >
              {loading ? (
                <>
                  <LuLoader className="w-4 h-4 animate-spin" />
                  Updating...
                </>
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