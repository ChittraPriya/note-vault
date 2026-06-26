"use client";
import React from "react";
import { Key } from "lucide-react";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-paper text-ink rounded-[10px] shadow-2xl shadow-black/40 p-8 ${className}`}>
      {children}
    </div>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-wider text-[#8A8275] mb-1.5">
      {children}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-white border-[1.5px] border-hairline rounded-md px-3 py-2.5 text-sm text-ink outline-none mb-4 focus:border-brass transition-colors ${props.className || ""}`}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full bg-white border-[1.5px] border-hairline rounded-md px-3 py-3 text-sm text-ink outline-none mb-4 resize-none focus:border-brass transition-colors ${props.className || ""}`}
    />
  );
}

export function PrimaryButton({
  children,
  className = "",
  color = "bg-ink",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { color?: string }) {
  return (
    <button
      {...props}
      className={`w-full ${color} text-paper rounded-md py-2.5 px-4 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className = "",
  color = "rust",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { color?: "rust" | "moss" | "brass" }) {
  const colorMap = {
    rust: "border-rust text-rust",
    moss: "border-moss text-moss",
    brass: "border-brass text-brass",
  };
  return (
    <button
      {...props}
      className={`bg-transparent border-[1.5px] ${colorMap[color]} rounded-md py-2 px-3.5 text-[13px] font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-opacity ${className}`}
    >
      {children}
    </button>
  );
}

export function Brand() {
  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="w-[26px] h-[26px] rounded-md bg-brass flex items-center justify-center">
        <Key size={15} className="text-ink" />
      </div>
      <span className="font-display text-lg font-semibold">Vault Notes</span>
    </div>
  );
}

export function ErrorBanner({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="bg-rust/10 border border-rust/40 text-rust text-[13px] rounded-md px-3 py-2 mb-4">
      {children}
    </div>
  );
}
