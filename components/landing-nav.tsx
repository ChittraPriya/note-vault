"use client";

import Link from "next/link";
import Image from "next/image";

export function LandingNav() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="#home" className="flex items-center gap-3">
          <Image
            src="/logo.png" // Change this to your logo filename
            alt="Vault Notes Logo"
            width={100}
            height={100}
            className="rounded-lg object-contain"
            priority
          />

          <span className="font-display text-xl font-bold text-slate-900">
            Notes Vault
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link
            href="#home"
            className="hover:text-sky-600 transition-colors"
          >
            Home
          </Link>

          <Link
            href="#features"
            className="hover:text-sky-600 transition-colors"
          >
            Features
          </Link>

          <Link
            href="#how-it-works"
            className="hover:text-sky-600 transition-colors"
          >
            How It Works
          </Link>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Log In
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-sky-600 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}