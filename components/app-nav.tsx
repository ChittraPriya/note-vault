"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Plus } from "lucide-react";

export function AppNav() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <nav className="border-b border-slate-200 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/notes/new" className="flex items-center gap-3">
          <Image
            src="/logo.png" // Change to your image name
            alt="Vault Notes Logo"
            width={100}
            height={100}
            className="rounded-lg object-contain"
            priority
          />

          <span className="font-display text-xl font-bold text-slate-900">
            Vault Notes
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-5">
          <Link
            href="/notes/new"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition"
          >
            <Plus size={18} />
            New Note
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
}