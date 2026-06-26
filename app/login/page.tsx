"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { ShieldCheck, Link2, Eye } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Invalid email or password");
        return;
      }

      toast.success("Login Successful!");

      router.push("/notes/new");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-white p-4">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-purple-50 flex-col justify-center items-center px-16">

        <Image
          src="/login.png"
          width={350}
          height={350}
          alt="Login Illustration"
          className="object-contain"
        />

        <h1 className="text-4xl font-bold text-gray-900 mt-8">
          Welcome Back
        </h1>

        <h2 className="text-2xl font-bold text-purple-600 mt-2 text-center">
          Sign in and continue
          <br />
          managing your notes
        </h2>

        <div className="mt-8 space-y-5">

          <div className="flex items-center gap-4 rounded-2xl bg-purple-100 p-4 shadow-sm">
            <div className="rounded-full bg-white p-2 shadow">
              <ShieldCheck size={22} className="text-purple-600" />
            </div>
          <div>
              <h3 className="font-semibold text-gray-900">Secure Login</h3>
                <p className="text-sm text-gray-600">
                  Protected authentication with encrypted access.
                </p>
          </div>
           </div>

            <div className="flex items-center gap-4 rounded-2xl bg-purple-100 p-4 shadow-sm">
            <div className="rounded-full bg-white p-2 shadow">
              <Link2 size={22} className="text-purple-600" />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Access Shared Notes</h3>
              <p className="text-sm text-gray-600">
                Open and manage notes shared with you anytime.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-purple-100 p-4 shadow-sm">
            <div className="rounded-full bg-white p-2 shadow">
              <Eye size={22} className="text-purple-600" />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Continue Where You Left Off</h3>
              <p className="text-sm text-gray-600">
                Pick up right where you left off in your previous session.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center">

        <div className="w-[420px] shadow-xl rounded-3xl p-10 bg-white">

          <div className="text-center">

            <div className="text-5xl">
              🔐
            </div>

            <h1 className="text-3xl font-bold mt-4 text-black">
              Login
            </h1>

            <p className="text-gray-500">
              Welcome back to NoteVault
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-4"
          >

            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-xl p-3 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-xl p-3 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-3 font-semibold transition"
            >
              {loading ? "Signing In..." : "Login"}
            </button>

            <div className="text-center text-gray-400">
              or
            </div>

            <p className="text-center text-gray-700">
              Don't have an account?

              <Link
                href="/register"
                className="text-purple-600 ml-2 font-semibold"
              >
                Register here
              </Link>
            </p>

          </form>

        </div>

      </div>

    </div>
  );
}