"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useAuth } from "@/store/auth";
import Navbar from "@/components/Navbar";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export default function LoginPage() {
  const router  = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const { setAuth, isLoggedIn } = useAuth();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  useGSAP(() => {
    gsap.from(".ln-line", { yPercent: 115, duration: 1.1, stagger: 0.1, ease: "power4.out", delay: 0.1 });
    gsap.from(".ln-form",  { opacity: 0, y: 24, duration: 0.9, ease: "power3.out", delay: 0.5 });
  }, { scope: pageRef });

  // Redirect if already logged in
  if (typeof window !== "undefined" && isLoggedIn()) {
    router.replace("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Invalid credentials. Please try again.");
        return;
      }

      setAuth(data.user, data.token);
      router.push("/");
    } catch {
      setError("Could not connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-surface border border-border px-5 py-[14px] font-inter text-[14px] text-text placeholder:text-muted focus:outline-none focus:border-orange transition-colors duration-200 autofill:bg-surface";
  const labelCls =
    "block font-space text-[9px] font-semibold tracking-[0.35em] uppercase text-muted mb-2";

  return (
    <>
      <Navbar />
      <div
        ref={pageRef}
        className="min-h-screen bg-black pt-[72px] flex items-center justify-center px-6 overflow-hidden"
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 55% at 50% 45%, rgba(255,77,0,0.05) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 w-full max-w-[440px]">
          {/* Title */}
          <div className="mb-10 text-center">
            <p className="font-space text-[9px] font-semibold tracking-[0.45em] uppercase text-orange mb-4">
              Welcome Back
            </p>
            <div className="overflow-hidden mb-1">
              <h1 className="ln-line font-space text-[clamp(48px,7vw,80px)] font-bold tracking-[-0.05em] text-text leading-[0.88]">
                Sign In
              </h1>
            </div>
            <div className="overflow-hidden">
              <p className="ln-line font-inter text-[14px] font-light text-muted mt-4">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-orange hover:underline cursor-none">
                  Create one
                </Link>
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="ln-form flex flex-col gap-5">
            <div>
              <label className={labelCls}>Email</label>
              <input
                required
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Password</label>
              <input
                required
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
              />
            </div>

            {error && (
              <div className="border border-[rgba(255,77,0,0.4)] bg-[rgba(255,77,0,0.06)] px-5 py-3">
                <p className="font-inter text-[13px] text-orange">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-orange text-[#0d0d0d] py-[17px] font-space text-[11px] font-bold tracking-[0.28em] uppercase cursor-none flex items-center justify-center gap-3 disabled:opacity-50 transition-opacity hover:opacity-90"
            >
              {loading ? (
                <>
                  <span className="block w-4 h-4 rounded-full border-2 border-[#0d0d0d] border-t-transparent animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-1">
              <span className="flex-1 h-px bg-border" />
              <span className="font-space text-[8px] font-semibold tracking-[0.3em] uppercase text-muted">
                or
              </span>
              <span className="flex-1 h-px bg-border" />
            </div>

            <Link
              href="/register"
              className="w-full border border-border text-text py-[16px] font-space text-[11px] font-bold tracking-[0.28em] uppercase cursor-none flex items-center justify-center hover:border-orange transition-colors duration-200"
            >
              Create Account
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}
