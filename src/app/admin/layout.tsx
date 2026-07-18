"use client";

import { useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/store/auth";

const NAV = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="2" width="13" height="12" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <path d="M4 6h8M4 9h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path d="M2 4l6-2 6 2v7l-6 3-6-3V4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M8 2v10M2 4l6 3 6-3" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Colors",
    href: "/admin/colors",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="8" cy="8" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Sizes",
    href: "/admin/sizes",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path d="M1 8h14M1 8l3-3M1 8l3 3M15 8l-3-3M15 8l-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const mounted  = useSyncExternalStore(() => () => {}, () => true, () => false);
  const router   = useRouter();
  const pathname = usePathname();
  const { user, clearAuth, isLoggedIn } = useAuth();

  if (!mounted) return null;

  if (!isLoggedIn() || !user?.is_admin) {
    router.replace("/login");
    return null;
  }

  const handleSignOut = () => { clearAuth(); router.push("/"); };

  return (
    <div className="flex min-h-screen bg-black cursor-auto">

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside className="fixed top-0 left-0 bottom-0 w-[220px] bg-surface border-r border-border flex flex-col z-[100]">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 px-5 pt-6 pb-5 font-space text-[13px] font-bold tracking-[0.22em] text-text no-underline border-b border-border mb-2 hover:text-orange transition-colors">
          <span className="w-[7px] h-[7px] rounded-full bg-orange shrink-0" />
          VISION
        </Link>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <p className="font-space text-[9px] font-semibold tracking-[0.38em] uppercase text-muted px-2 pt-2 pb-1.5">
            Admin
          </p>
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-2.5 px-2.5 py-2 mb-px font-space text-[11.5px] font-medium tracking-[0.04em] no-underline rounded transition-colors duration-200",
                  active
                    ? "text-orange bg-orange/10 font-semibold"
                    : "text-muted hover:text-text hover:bg-white/[0.04]",
                ].join(" ")}
              >
                <span className="shrink-0 w-4 h-4 flex items-center justify-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex items-center gap-2.5 px-4 py-3.5 border-t border-border">
          <span className="w-[30px] h-[30px] rounded-full bg-orange text-[#0d0d0d] font-space text-[11px] font-bold flex items-center justify-center shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-space text-[11px] font-semibold text-text truncate">{user.name}</p>
            <p className="font-space text-[9px] text-muted tracking-[0.06em]">Administrator</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-muted hover:text-orange transition-colors p-1 shrink-0"
            aria-label="Sign out"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5.5 2.5H3A1 1 0 0 0 2 3.5v7a1 1 0 0 0 1 1h2.5M9 10l3-3-3-3M12 7H5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <div className="ml-[220px] flex-1 min-h-screen overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
