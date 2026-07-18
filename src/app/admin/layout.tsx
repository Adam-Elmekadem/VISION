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
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="2" width="13" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <path d="M4 6h8M4 9h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 4l6-2 6 2v7l-6 3-6-3V4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M8 2v10M2 4l6 3 6-3" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Colors",
    href: "/admin/colors",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="8" cy="8" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Sizes",
    href: "/admin/sizes",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1 8h14M1 8l3-3M1 8l3 3M15 8l-3-3M15 8l-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
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

  const handleSignOut = () => {
    clearAuth();
    router.push("/");
  };

  return (
    <div className="adm-shell">
      {/* Sidebar */}
      <aside className="adm-sidebar">
        <Link href="/" className="adm-logo">
          <span className="adm-logo-dot" />
          VISION
        </Link>

        <nav className="adm-nav">
          <p className="adm-nav-label">Admin</p>
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`adm-nav-link${active ? " active" : ""}`}
              >
                <span className="adm-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="adm-sidebar-footer">
          <div className="adm-user">
            <span className="adm-user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div className="adm-user-info">
              <p className="adm-user-name">{user.name}</p>
              <p className="adm-user-role">Administrator</p>
            </div>
          </div>
          <button className="adm-signout" onClick={handleSignOut} type="button">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5.5 2.5H3A1 1 0 0 0 2 3.5v7a1 1 0 0 0 1 1h2.5M9 10l3-3-3-3M12 7H5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="adm-main">
        {children}
      </div>
    </div>
  );
}
