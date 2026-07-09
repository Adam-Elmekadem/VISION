"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useAuth } from "@/store/auth";
import Navbar from "@/components/Navbar";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export default function RegisterPage() {
  const router  = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const { setAuth, isLoggedIn } = useAuth();

  const [fields, setFields] = useState({
    name:                  "",
    email:                 "",
    password:              "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useGSAP(() => {
    gsap.from(".rg-line", { yPercent: 115, duration: 1.1, stagger: 0.1, ease: "power4.out", delay: 0.1 });
    gsap.from(".rg-form",  { opacity: 0, y: 24, duration: 0.9, ease: "power3.out", delay: 0.5 });
  }, { scope: pageRef });

  if (typeof window !== "undefined" && isLoggedIn()) {
    router.replace("/");
    return null;
  }

  const set = (k: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(fields),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const flat: Record<string, string> = {};
          for (const [k, v] of Object.entries(data.errors as Record<string, string[]>)) {
            flat[k] = (v as string[])[0];
          }
          setFieldErrors(flat);
        } else {
          setError(data.message ?? "Registration failed. Please try again.");
        }
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

  const inputCls = (field: string) =>
    `w-full bg-surface border px-5 py-[14px] font-inter text-[14px] text-text placeholder:text-muted focus:outline-none transition-colors duration-200 ${
      fieldErrors[field] ? "border-orange" : "border-border focus:border-orange"
    }`;
  const labelCls =
    "block font-space text-[9px] font-semibold tracking-[0.35em] uppercase text-muted mb-2";

  return (
    <>
      <Navbar />
      <div
        ref={pageRef}
        className="min-h-screen bg-black pt-[72px] flex items-center justify-center px-6 py-12 overflow-hidden"
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
              Join VISION
            </p>
            <div className="overflow-hidden mb-1">
              <h1 className="rg-line font-space text-[clamp(44px,6.5vw,76px)] font-bold tracking-[-0.05em] text-text leading-[0.88]">
                Create Account
              </h1>
            </div>
            <div className="overflow-hidden">
              <p className="rg-line font-inter text-[14px] font-light text-muted mt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-orange hover:underline cursor-none">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="rg-form flex flex-col gap-5">
            <div>
              <label className={labelCls}>Full Name</label>
              <input
                required
                type="text"
                autoComplete="name"
                placeholder="Adam El Mekadem"
                value={fields.name}
                onChange={set("name")}
                className={inputCls("name")}
              />
              {fieldErrors.name && (
                <p className="font-inter text-[11px] text-orange mt-1">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label className={labelCls}>Email</label>
              <input
                required
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={fields.email}
                onChange={set("email")}
                className={inputCls("email")}
              />
              {fieldErrors.email && (
                <p className="font-inter text-[11px] text-orange mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className={labelCls}>Password</label>
              <input
                required
                type="password"
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={fields.password}
                onChange={set("password")}
                className={inputCls("password")}
              />
              {fieldErrors.password && (
                <p className="font-inter text-[11px] text-orange mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label className={labelCls}>Confirm Password</label>
              <input
                required
                type="password"
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={fields.password_confirmation}
                onChange={set("password_confirmation")}
                className={inputCls("password_confirmation")}
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
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="font-space text-[8px] font-semibold tracking-[0.22em] uppercase text-muted text-center">
              By creating an account, you agree to our Terms of Service
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
