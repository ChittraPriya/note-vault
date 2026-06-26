import Link from "next/link";
import {
  Key,
  Lock,
  Unlock,
  Clock,
  Eye,
  ShieldCheck,
  BarChart3,
  Ban,
  AlertTriangle,
  X,
} from "lucide-react";
import { LandingNav } from "@/components/landing-nav";

const edgeCases = [
  {
    icon: AlertTriangle,
    label: "Invalid link",
    note: "Bad or unknown token returns a clear 404 state.",
  },
  {
    icon: Unlock,
    label: "Public access",
    note: "Opens instantly, no key needed, view counted.",
  },
  {
    icon: Lock,
    label: "Password-protected",
    note: "Locked behind a bcrypt-hashed access key.",
  },
  {
    icon: X,
    label: "Wrong password",
    note: "Rejected with no view-count change.",
  },
  {
    icon: Clock,
    label: "Expired link",
    note: "Time-based links close themselves automatically.",
  },
  {
    icon: Eye,
    label: "One-time, already used",
    note: "Second visitor sees 'already viewed.'",
  },
  {
    icon: Ban,
    label: "Revoked link",
    note: "Owner can kill a link instantly, any time.",
  },
  {
    icon: ShieldCheck,
    label: "Concurrent one-time opens",
    note: "Atomic DB update — only one winner, guaranteed.",
  },
  {
    icon: BarChart3,
    label: "Accurate view count",
    note: "Increments only on a genuinely successful view.",
  },
];

const steps = [
  {
    n: "01",
    title: "Write the note",
    body: "Add a title and content — anything from credentials to a quick message.",
  },
  {
    n: "02",
    title: "Choose how it unlocks",
    body: "One-time or time-based expiry. Public or password-protected access.",
  },
  {
    n: "03",
    title: "Share the sealed link",
    body: "Get a unique link, plus a one-time access key if it's password-protected.",
  },
  {
    n: "04",
    title: "Track or revoke",
    body: "Watch the view count update live, or force-invalidate the link any time.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <LandingNav />

      {/* HOME / HERO */}
      <section
        id="home"
        className="max-w-6xl mx-auto px-6 pt-24 pb-28 grid md:grid-cols-2 gap-12 items-center"
      >
        <div>
          <div className="font-serif text-[11px] uppercase tracking-widest text-sky-600 mb-4">
            Secure, expiring note sharing
          </div>
          <h1 className="font-display text-[44px] leading-[1.05] mb-5">
            Every note you share is a key,
            <br />
            not a door left open.
          </h1>
          <p className="text-slate-600 text-[15px] leading-relaxed mb-8 max-w-md">
            Create a note, seal it behind a one-time view or a deadline, and
            decide whether it needs a password. Once it's opened — or revoked,
            or expired — it's closed for good.
          </p>
          <div className="flex gap-3">
            <Link
              href="/register"
              className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-3 rounded-lg text-sm flex items-center gap-2 transition"
            >
              <Key size={15} /> Get started
            </Link>
            <Link
              href="#how-it-works"
              className="border border-sky-200 text-sky-700 hover:bg-sky-50 font-semibold px-5 py-3 rounded-lg text-sm transition"
            >
              See how it works
            </Link>
          </div>
        </div>

        {/* sealed-link visual */}
        <div className="bg-white rounded-2xl border border-sky-100 shadow-xl p-6 max-w-sm md:ml-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="font-serif text-[10px] uppercase tracking-wider text-[#8A8275]">
              Share link
            </span>
            <span className="font-serif text-[10px] bg-sky-100 text-sky-700 px-2 py-1 rounded-full">
              ACTIVE
            </span>
          </div>
          <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
            <code className="font-serif text-xs text-slate-800 bg-white border border-slate-200 px-3 py-2 rounded-lg block mb-3 truncate">
              vault.app/share/k3J9-mQ2pXz
            </code>
            <div className="font-serif text-[10px] uppercase tracking-wider text-[#8A8275] mb-1">
              Access key
            </div>
            <code className="font-serif text-base font-bold text-sky-600 tracking-wider">
              8F3A-2C1D
            </code>
          </div>
          <div className="flex justify-between mt-4 font-mono text-xs text-slate-500">
            <span>views: 0</span>
            <span>one-time · password</span>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="max-w-6xl mx-auto px-6 py-24 border-t border-slate-200"
      >
        <div className="mb-12 max-w-lg">
          <div className="font-serif text-[11px] uppercase tracking-widest text-sky-600 mb-3">
            Features
          </div>
          <h2 className="font-display text-3xl mb-3">
            Built around the edge cases, not just the happy path
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Every state a share link can end up in is handled explicitly —
            nothing silently falls through.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {edgeCases.map(({ icon: Icon, label, note }) => (
            <div
              key={label}
              className="bg-white border border-sky-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center mb-3">
                <Icon size={16} className="text-sky-600" />
              </div>
              <div className="font-semibold text-sm mb-1">{label}</div>
              <div className="text-slate-500 text-[13px] leading-relaxed">
                {note}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="max-w-6xl mx-auto px-6 py-24 border-t border-slate-200"
      >
        <div className="mb-12 max-w-lg">
          <div className="font-serif text-[11px] uppercase tracking-widest text-sky-600 mb-3">
            How it works
          </div>
          <h2 className="font-display text-3xl mb-3">
            From note to sealed link in four steps
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.n}>
              <div className="font-serif text-2xl text-sky-600 mb-3">{s.n}</div>
              <div className="font-display text-lg mb-2">{s.title}</div>
              <div className="text-slate-500 text-[13px] leading-relaxed">
                {s.body}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-12 border-t border-sky-50 bg-gradient-to-r from-sky-50 via-white to-sky-50 py-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-sky-100 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-sky-600" />
          </div>

          <h3 className="text-base font-semibold text-slate-800">
            Notes Vault
          </h3>

          <p className="text-sm text-slate-500 max-w-md text-center leading-6">
            Securely create, share, and protect your notes with one-time or
            time-limited access.
          </p>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Vault Notes • Secure Note Sharing
          </p>
        </div>
      </footer>
    </div>
  );
}
