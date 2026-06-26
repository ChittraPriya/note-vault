"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Key, Eye, Clock, Unlock, Lock, Copy, Check } from "lucide-react";
import {
  Card,
  FieldLabel,
  Input,
  Textarea,
  PrimaryButton,
  ErrorBanner,
} from "@/components/ui";
import { AppNav } from "@/components/app-nav";
import { NotebookPen } from "lucide-react";

type ShareType = "ONE_TIME" | "TIME_BASED";
type AccessType = "PUBLIC" | "PASSWORD";

export default function NewNotePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [shareType, setShareType] = useState<ShareType>("ONE_TIME");
  const [accessType, setAccessType] = useState<AccessType>("PASSWORD");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    token: string;
    accessKey: string | null;
    noteId: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (shareType === "TIME_BASED" && !expiresAt) {
      setError("Please choose an expiry date/time for a time-based link.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          expiresAt:
            shareType === "TIME_BASED"
              ? new Date(expiresAt).toISOString()
              : null,
          shareType,
          accessType,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create note.");
        return;
      }
      setResult({
        token: data.shareLink.token,
        accessKey: data.accessKey,
        noteId: data.note.id,
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const shareUrl = result
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/share/${result.token}`
    : "";

  if (result) {
    return (
      <div className="min-h-screen bg-sky-50">
        <AppNav />

        <div className="flex items-center justify-center p-8 pt-16">
          <Card className="w-full max-w-[520px] rounded-3xl shadow-2xl border border-sky-100 bg-white">
            <div className="flex justify-center mb-5">
              <div className="h-16 w-16 rounded-2xl bg-sky-100 flex items-center justify-center">
                <Check className="h-8 w-8 text-sky-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center text-sky-700">
              Link Generated
            </h1>

            <p className="text-center text-gray-500 mb-8">
              Share this secure link with whoever needs access.
            </p>

            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 mb-6">
              <FieldLabel>
                <Copy size={16} />
                Share Link
              </FieldLabel>

              <div className="flex items-center gap-2 mt-2 mb-5">
                <code className="flex-1 truncate rounded-lg border border-sky-200 bg-white px-3 py-2 text-xs font-mono">
                  {shareUrl}
                </code>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="rounded-lg bg-sky-100 p-2 text-sky-600 hover:bg-sky-200 transition"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>

              {result.accessKey && (
                <>
                  <FieldLabel>
                    <Key size={16} />
                    Access Key
                  </FieldLabel>

                  <div className="rounded-lg border border-sky-200 bg-white px-3 py-3 mt-2">
                    <code className="font-mono text-lg font-bold tracking-widest text-sky-700">
                      {result.accessKey}
                    </code>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <PrimaryButton
                className="flex-1 bg-sky-600 hover:bg-sky-700"
                onClick={() => router.push(`/notes/${result.noteId}`)}
              >
                <Eye size={18} />
                View Note
              </PrimaryButton>

              <PrimaryButton
                className="flex-1 bg-gray-600 hover:bg-gray-700"
                onClick={() => {
                  setResult(null);
                  setTitle("");
                  setContent("");
                }}
              >
                <NotebookPen size={18} />
                New Note
              </PrimaryButton>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AppNav />
      <div className="flex items-center justify-center p-8 pt-16">
        <Card className="w-full max-w-[460px]">
          <div className="flex justify-center mb-5">
            <div className="h-16 w-16 rounded-2xl bg-sky-100 flex items-center justify-center">
              <NotebookPen className="h-8 w-8 text-sky-600" />
            </div>
          </div>

          <h1 className="font-display text-3xl font-bold text-center text-sky-700">
            Create Note
          </h1>

          <p className="text-center text-gray-500 mb-8">
            Write it, then choose how it can be unlocked.
          </p>

          <ErrorBanner>{error}</ErrorBanner>

          <form onSubmit={handleSubmit}>
            <div className="flex gap-2 mb-2 text-sky-700">
              <NotebookPen className="w-4 h-4 mt-[2px]" />
              <FieldLabel>Title</FieldLabel>
            </div>
            <Input
              className="border-sky-200 focus:border-sky-500 focus:ring-sky-500"
              placeholder="Server access credentials"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="flex items-center gap-2 mb-2 text-sky-700">
              <Eye size={16} />
              <FieldLabel>
                Content
              </FieldLabel>
            </div>

            <Textarea
              rows={3}
              className="border-sky-200 focus:border-sky-500 focus:ring-sky-500"
              placeholder="Write your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />

            {shareType === "TIME_BASED" && (
              <>
                <div className="flex items-center gap-2 mb-2 text-sky-700">
                  <Unlock size={16} />
                  <FieldLabel>
                    Share Type
                  </FieldLabel>
                </div>
                <Input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  required
                />
              </>
            )}
            <div className="flex items-center gap-2 mb-2 text-sky-700">
              <Lock size={16} />
              <FieldLabel>
                Share Type
              </FieldLabel>
            </div>
            <div className="flex gap-2 mb-4">
              <ToggleButton
                active={shareType === "ONE_TIME"}
                onClick={() => setShareType("ONE_TIME")}
                icon={<Eye size={14} />}
                activeColor="bg-sky-600 text-white border-sky-600"
              >
                One-time
              </ToggleButton>
              <ToggleButton
                active={shareType === "TIME_BASED"}
                onClick={() => setShareType("TIME_BASED")}
                icon={<Clock size={14} />}
                activeColor="bg-sky-600 text-white border-sky-600"
              >
                Time-based
              </ToggleButton>
            </div>

            <div className="flex items-center gap-2 mb-2 text-sky-700">
              <Lock size={16} />
              <FieldLabel>
                Access Type
              </FieldLabel>
            </div>
            <div className="flex gap-2 mb-6">
              <ToggleButton
                active={accessType === "PUBLIC"}
                onClick={() => setAccessType("PUBLIC")}
                icon={<Unlock size={14} />}
                activeColor="bg-sky-600 text-white border-sky-600"
              >
                Public
              </ToggleButton>
              <ToggleButton
                active={accessType === "PASSWORD"}
                onClick={() => setAccessType("PASSWORD")}
                icon={<Lock size={14} />}
                activeColor="bg-sky-600 text-white border-sky-600"
              >
                Password-protected
              </ToggleButton>
            </div>

            <PrimaryButton
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700"
            >
              <Key size={18} />
              {loading ? "Generating..." : "Generate Share Link"}
            </PrimaryButton>
          </form>
        </Card>
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  icon,
  children,
  activeColor,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  activeColor: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-[13px] font-semibold border-[1.5px] transition-colors ${
        active
          ? activeColor
          : "bg-white text-slate-700 border-sky-200 hover:border-sky-400 hover:bg-sky-50"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
