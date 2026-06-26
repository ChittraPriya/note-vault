"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Lock, Unlock, AlertTriangle, Clock, Eye, X } from "lucide-react";
import { Card, FieldLabel, Input, PrimaryButton } from "@/components/ui";

type Phase =
  | "loading"
  | "invalid"
  | "revoked"
  | "expired"
  | "used"
  | "locked_out"
  | "needs_password"
  | "wrong_password"
  | "public_ready"
  | "unlocking"
  | "unlocked";

export default function SharePage() {
  const params = useParams<{ token: string }>();
  const [phase, setPhase] = useState<Phase>("loading");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(
    null,
  );
  const [viewCount, setViewCount] = useState<number | null>(null);

  // Check status on load WITHOUT consuming the link
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/share/${params.token}`);
      const data = await res.json();
      setTitle(data.title || "");
      setPhase((res.ok ? data.status : "invalid") as Phase);
    })();
  }, [params.token]);

  // Public links auto-unlock (the "view" happens once, on load)
  useEffect(() => {
    if (phase === "public_ready") {
      attemptUnlock();
    }
  }, [phase]);

  async function attemptUnlock(e?: React.FormEvent) {
    e?.preventDefault();
    setErrorMsg("");
    setPhase("unlocking");
    try {
      const res = await fetch(`/api/share/${params.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password || undefined }),
      });
      const data = await res.json();

      if (res.ok && data.status === "unlocked") {
        setContent(data.content);
        setTitle(data.title);
        setViewCount(data.viewCount);
        setPhase("unlocked");
        return;
      }

      setErrorMsg(data.error || "Something went wrong.");
      if (data.attemptsRemaining !== undefined)
        setAttemptsRemaining(data.attemptsRemaining);
      setPhase((data.status as Phase) || "invalid");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setPhase("needs_password");
    }
  }

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-8">
      <Card className="w-full max-w-[460px] rounded-3xl bg-white border border-sky-100 shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-100 mb-4">
            <Lock className="w-7 h-7 text-sky-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Secure Shared Note
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            View securely shared content.
          </p>
        </div>
        {phase === "loading" || phase === "unlocking" ? (
          <StatusBlock
            icon={<Lock size={22} className="text-sky-600" />}
            title="Checking link..."
            sub="One moment."
          />
        ) : null}

        {phase === "invalid" && (
          <StatusBlock
            icon={<AlertTriangle size={22} className="text-red-500" />}
            title="Link not found"
            sub="This share link doesn't exist or was never created. Check the URL and try again."
          />
        )}

        {phase === "revoked" && (
          <StatusBlock
            icon={<X size={22} className="text-rust" />}
            title="Link revoked"
            sub="The owner has disabled this link."
          />
        )}

        {phase === "expired" && (
          <StatusBlock
            icon={<Clock size={22} className="text-rust" />}
            title="This link has expired"
            sub="The time window for viewing this note has closed."
          />
        )}

        {phase === "used" && (
          <StatusBlock
            icon={<Eye size={22} className="text-rust" />}
            title="Already viewed"
            sub="One-time links can only be opened once, and this one's been used."
          />
        )}

        {phase === "locked_out" && (
          <StatusBlock
            icon={<AlertTriangle size={22} className="text-rust" />}
            title="Temporarily locked"
            sub="Too many incorrect attempts. Try again in a few minutes."
          />
        )}

        {(phase === "needs_password" || phase === "wrong_password") && (
          <>
            <StatusBlock
              icon={
                phase === "wrong_password" ? (
                  <AlertTriangle size={22} className="text-rust" />
                ) : (
                  <Lock size={22} className="text-ink" />
                )
              }
              title={
                phase === "wrong_password"
                  ? "Incorrect key"
                  : "This note is locked"
              }
              sub={
                phase === "wrong_password"
                  ? `${errorMsg}${attemptsRemaining !== null ? ` (${attemptsRemaining} attempts left)` : ""}`
                  : "Enter the access key to view it."
              }
            />
            <form onSubmit={attemptUnlock} className="space-y-4 mt-6">
              <Input
                placeholder="Enter access key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-mono tracking-widest border-sky-200 focus:border-sky-500"
                required
              />

              <PrimaryButton
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700"
              >
                <Unlock size={16} />
                {phase === "wrong_password" ? "Try Again" : "Unlock Note"}
              </PrimaryButton>
            </form>
          </>
        )}

        {phase === "unlocked" && (
          <>
            <StatusBlock
              icon={<Unlock size={22} className="text-moss" />}
              title={title}
              sub={`Viewed just now${viewCount !== null ? ` · view #${viewCount}` : ""}.`}
            />
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                <h3 className="text-sm font-semibold text-sky-700 mb-2">
                  Note Content
                </h3>

                <div className="whitespace-pre-wrap text-slate-700 leading-7">
                  {content}
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

function StatusBlock({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div className="text-center mb-6">
      <div className="flex justify-center mb-5">
        <div className="h-16 w-16 rounded-2xl bg-sky-100 flex items-center justify-center">
          {icon}
        </div>
      </div>

      <h1 className="text-2xl font-bold text-sky-700">{title}</h1>

      <p className="text-slate-500 mt-2">{sub}</p>
    </div>
  );
}
