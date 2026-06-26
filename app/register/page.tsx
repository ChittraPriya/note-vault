"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { ShieldCheck, Link2, Eye } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    console.log("FORM SUBMIT FIRED");
    e.preventDefault();

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    console.log("REGISTER DATA:", {
        email,
        password,
      });

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not create account");
        return;
      }

      toast.success("Registration successful!");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-white">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-green-50 flex-col justify-center items-center px-16">

        <Image
          src="/Register.png"
          width={350}
          height={350}
          alt="Register Illustration"
          className="object-contain"
        />

        <h1 className="text-4xl font-bold text-gray-900 mt-8">
          Create Your Account
        </h1>

        <h2 className="text-2xl font-bold text-green-600 mt-2">
          Start sharing your notes
          <br />
          the smart way
        </h2>

        <div className="mt-8 space-y-5">
          <div className="flex items-center gap-2 text-red-600">
           <ShieldCheck size={20} />
           <span className="text-lg">Secure & Private</span>
          </div>
          <div className="flex items-center gap-2 text-red-600">
            <Link2 size={20} />
            <span className="text-lg">Share Securely</span>
          </div>
          <div className="flex items-center gap-2 text-red-600">
            <Eye size={20} />
            <span className="text-lg">Track Activity</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center">

        <div className="w-[420px] shadow-xl rounded-3xl p-10 bg-white">

          <div className="text-center">

            <div className="text-5xl">
              👤
            </div>

            <h1 className="text-3xl font-bold mt-4 text-black">
              Register
            </h1>

            <p className="text-gray-500">
              Create your account
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

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border rounded-xl p-3 text-black"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />

            <label className="text-sm flex items-center gap-2 text-gray-700">
              <input type="checkbox" required />
              I agree to Terms and Privacy Policy
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold transition"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>

            <div className="text-center text-gray-400">
              or continue with
            </div>

            <p className="text-center text-gray-700">

              Already have an account?

              <Link
                href="/login"
                className="text-green-600 ml-2 font-semibold"
              >
                Login here
              </Link>

            </p>

          </form>

        </div>

      </div>

    </div>
  );
}