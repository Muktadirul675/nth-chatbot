"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { LuLink, LuFileText, LuLoader, LuDownload } from "react-icons/lu";

export default function AddInformationPage() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);

  // Handle URL extraction
  async function handleExtract() {
    if (!url) {
      toast.error("Please enter a URL first");
      return;
    }

    try {
      setExtracting(true);
      
      const res = await fetch(`/api/informations/url-extract?url=${encodeURIComponent(url)}`, {
        method: "GET",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to extract content from URL");
      }

      if (data?.content) {
        setContent(data.content);
        toast.success("Content extracted successfully");
      } else {
        toast.error("No content returned from this URL");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong while extracting"
      );
    } finally {
      setExtracting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/informations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          content,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to add information");
      }

      toast.success("Information added successfully");

      router.push("/dashboard/informations");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="my-5 w-full md:w-1/2 mx-auto p-6 bg-[#fcfcfc] border border-[#eef0f1] rounded-xl shadow-sm">
      {/* Header section */}
      <div className="mb-6 border-b border-[#eef0f1] pb-4">
        <h1 className="text-xl font-semibold text-[#1c1c1c] tracking-tight">
          Add Knowledge Source
        </h1>
        <p className="text-sm text-[#687076] mt-1">
          Provide a URL or raw text content to ingest into your database.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Field with Extract Action */}
        <div className="flex flex-col gap-1.5">
          <label 
            htmlFor="url" 
            className="text-xs font-medium text-[#687076] flex items-center gap-1.5 uppercase tracking-wider"
          >
            <LuLink className="w-3.5 h-3.5" /> Source URL
          </label>
          <div className="flex gap-2">
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/docs"
              disabled={loading || extracting}
              className="flex-1 px-3 py-2 text-sm bg-white border border-[#dcdede] rounded-md text-[#1c1c1c] placeholder-[#a0a0a0] shadow-sm transition-colors focus:outline-none focus:border-[#df2a34] focus:ring-1 focus:ring-[#df2a34] disabled:opacity-60 disabled:bg-[#f5f5f5]"
            />
            <button
              type="button"
              onClick={handleExtract}
              disabled={loading || extracting || !url}
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
          <span className="text-xs text-[#8d9499]">
            Optional. Link to the documentation or reference website.
          </span>
        </div>

        {/* Content Field */}
        <div className="flex flex-col gap-1.5">
          <label 
            htmlFor="content" 
            className="text-xs font-medium text-[#687076] flex items-center gap-1.5 uppercase tracking-wider"
          >
            <LuFileText className="w-3.5 h-3.5" /> Context Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your markdown or plain text here..."
            required
            disabled={loading || extracting}
            rows={6}
            className="w-full px-3 py-2 text-sm bg-white border border-[#dcdede] rounded-md text-[#1c1c1c] placeholder-[#a0a0a0] shadow-sm transition-colors focus:outline-none focus:border-[#df2a34] focus:ring-1 focus:ring-[#df2a34] disabled:opacity-60 disabled:bg-[#f5f5f5] resize-y"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#eef0f1]">
          <button
            type="button"
            onClick={() => router.push("/dashboard/informations")}
            disabled={loading || extracting}
            className="px-4 py-2 text-sm font-medium text-[#687076] bg-white border border-[#dcdede] rounded-md hover:bg-[#f8f9fa] hover:text-[#1c1c1c] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading || extracting}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#df2a34] hover:bg-[#c8212a] rounded-md shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <LuLoader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}