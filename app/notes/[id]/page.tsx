"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Copy,
  Check,
  X,
  NotebookPen,
  CalendarDays,
  FileText,
  Link2,
  Eye,
  Shield,
} from "lucide-react";
import { Card, FieldLabel, GhostButton } from "@/components/ui";
import { AppNav } from "@/components/app-nav";

interface ShareLink {
  id: string;
  token: string;
  shareType: "ONE_TIME" | "TIME_BASED";
  accessType: "PUBLIC" | "PASSWORD";
  isUsed: boolean;
  isRevoked: boolean;
  viewCount: number;
  expiresAt: string | null;
}

interface NoteData {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  shareLinks: ShareLink[];
}

function statusOf(link: ShareLink): { label: string; color: string } {
  if (link.isRevoked) return { label: "REVOKED", color: "bg-rust" };
  if (link.shareType === "ONE_TIME" && link.isUsed)
    return { label: "USED", color: "bg-rust" };
  if (link.expiresAt && new Date(link.expiresAt) < new Date())
    return { label: "EXPIRED", color: "bg-rust" };
  return { label: "ACTIVE", color: "bg-moss" };
}

export default function NoteDetailPage() {
  const params = useParams<{ id: string }>();
  const [note, setNote] = useState<NoteData | null>(null);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function load() {
    const res = await fetch(`/api/notes/${params.id}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not load note.");
      return;
    }
    setNote(data);
  }

  useEffect(() => {
    load();
  }, [params.id]);

  async function handleRevoke(shareLinkId: string) {
    await fetch(`/api/notes/${params.id}/revoke`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shareLinkId }),
    });
    load();
  }

  if (error) {
    return (
      <div className="min-h-screen bg-sky-50">
        <AppNav />
        <div className="flex items-center justify-center p-8 pt-16">
          <Card className="w-full max-w-[560px] rounded-3xl border border-sky-100 shadow-2xl bg-white">
            {error}
          </Card>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen">
        <AppNav />
        <div className="flex items-center justify-center text-[#8A8275] pt-16">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50">
      <AppNav />

      <div className="flex items-center justify-center p-8 pt-16">
        <Card className="w-full max-w-[560px] rounded-3xl border border-sky-100 bg-white shadow-2xl">
          {/* Top Icon */}
          <div className="flex justify-center mb-5">
            <div className="h-16 w-16 rounded-2xl bg-sky-100 flex items-center justify-center">
              <NotebookPen className="h-8 w-8 text-sky-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl font-bold text-center text-sky-700 mb-2">
            {note.title}
          </h1>

          {/* Date */}
          <p className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-8">
            <CalendarDays size={16} className="text-sky-600" />
            Created {new Date(note.createdAt).toLocaleDateString()}
          </p>

          {/* Note Content */}
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} className="text-sky-600" />
              <FieldLabel className="text-sky-700">Note Content</FieldLabel>
            </div>

            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
              {note.content}
            </p>
          </div>

          {/* Share Links */}
          {note.shareLinks.map((link) => {
            const status = statusOf(link);

            const shareUrl = `${
              typeof window !== "undefined" ? window.location.origin : ""
            }/share/${link.token}`;

            return (
              <div
                key={link.id}
                className="bg-white border border-sky-100 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all mb-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Link2 size={18} className="text-sky-600" />
                    <FieldLabel className="text-sky-700">Share Link</FieldLabel>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      status.label === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {status.label}
                  </span>
                </div>

                {/* URL */}
                <div className="flex items-center gap-2 mb-4">
                  <code className="flex-1 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-mono text-slate-700 truncate">
                    {shareUrl}
                  </code>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      setCopiedId(link.id);
                      setTimeout(() => setCopiedId(null), 1500);
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600 hover:bg-sky-200 transition"
                  >
                    {copiedId === link.id ? (
                      <Check size={18} />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>
                </div>

                {/* Details */}
                <div className="space-y-3 text-sm text-slate-600 mb-5">
                  <div className="flex items-center gap-2">
                    <Eye size={16} className="text-sky-600" />
                    <span>
                      <strong>{link.viewCount}</strong> views •{" "}
                      {link.shareType === "ONE_TIME"
                        ? "One-time"
                        : "Time-based"}{" "}
                      •{" "}
                      {link.accessType === "PUBLIC"
                        ? "Public"
                        : "Password Protected"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-sky-600" />

                    <span>
                      {link.expiresAt
                        ? `Expires on ${new Date(
                            link.expiresAt,
                          ).toLocaleString()}`
                        : link.shareType === "ONE_TIME"
                          ? "Expires after first successful view"
                          : "No expiry"}
                    </span>
                  </div>
                </div>

                {/* Revoke */}
                {status.label === "ACTIVE" && (
                  <GhostButton
                    color="rust"
                    onClick={() => handleRevoke(link.id)}
                    className="w-full justify-center border border-red-200 hover:bg-red-50 text-red-600"
                  >
                    <X size={16} />
                    Revoke Link
                  </GhostButton>
                )}
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}
