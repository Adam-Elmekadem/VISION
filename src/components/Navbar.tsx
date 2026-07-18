"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useSyncExternalStore } from "react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import ThemeToggle from "@/components/ThemeToggle";

gsap.registerPlugin(useGSAP);

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const navRef       = useRef<HTMLElement>(null);
  const logoRef      = useRef<HTMLAnchorElement>(null);
  const linksRef     = useRef<HTMLUListElement>(null);
  const actionsRef   = useRef<HTMLDivElement>(null);
  const dropdownRef  = useRef<HTMLDivElement>(null);
  const router       = useRouter();
  const totalItems   = useCart((s) => s.totalItems());
  const { user, clearAuth, isLoggedIn } = useAuth();
  const mounted  = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [dropOpen, setDropOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleSignOut = () => {
    setDropOpen(false);
    setMenuOpen(false);
    clearAuth();
    router.push("/");
  };

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(navRef.current, { y: -100, opacity: 0, duration: 1, delay: 0.3 })
        .from(logoRef.current, { x: -24, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(
          linksRef.current?.querySelectorAll("li") ?? [],
          { y: -16, opacity: 0, stagger: 0.07, duration: 0.55 },
          "-=0.5"
        )
        .from(
          actionsRef.current?.children ?? [],
          { y: -16, opacity: 0, stagger: 0.06, duration: 0.5 },
          "-=0.4"
        );
    },
    { scope: navRef }
  );

  return (
    <>
      <nav ref={navRef} className="navbar" role="navigation" aria-label="Main navigation">
        <div className="navbar-inner">

          {/* Logo */}
          <Link ref={logoRef} href="/" className="navbar-logo">
            <span className="navbar-logo-dot" aria-hidden="true" />
            VISION
          </Link>

          {/* Nav Links — desktop only */}
          <ul ref={linksRef} className="nav-links" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="nav-link">{link.label}</Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div ref={actionsRef} className="navbar-actions">
            <ThemeToggle />

            <button className="navbar-icon-btn" aria-label="Search" type="button">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.25" />
                <path d="M12 12L16 16" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
            </button>

            {/* Account — dropdown when logged in, link to /login when logged out */}
            <div className="relative" ref={dropdownRef}>
              {mounted && isLoggedIn() ? (
                <>
                  <button
                    className="navbar-icon-btn relative"
                    aria-label={`Account — ${user?.name}`}
                    aria-expanded={dropOpen}
                    type="button"
                    onClick={() => setDropOpen((o) => !o)}
                  >
                    <span className="flex items-center justify-center w-[18px] h-[18px] rounded-full bg-orange text-[#0d0d0d] font-space text-[9px] font-bold leading-none">
                      {user!.name.charAt(0).toUpperCase()}
                    </span>
                  </button>

                  {dropOpen && (
                    <>
                      <div className="fixed inset-0 z-[49]" onClick={() => setDropOpen(false)} aria-hidden />
                      <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[200px] bg-surface border border-border shadow-xl">
                        <div className="px-4 py-3 border-b border-border">
                          <p className="font-space text-[11px] font-bold tracking-[0.02em] text-text truncate">{user!.name}</p>
                          <p className="font-inter text-[11px] text-muted truncate mt-0.5">{user!.email}</p>
                        </div>
                        <div className="py-1">
                          {/* Dashboard — admin only */}
                          {user!.is_admin && (
                            <Link
                              href="/admin/dashboard"
                              onClick={() => setDropOpen(false)}
                              className="flex items-center gap-3 px-4 py-[10px] font-space text-[10px] font-semibold tracking-[0.18em] uppercase text-orange hover:bg-surface-2 transition-colors cursor-none border-b border-border"
                            >
                              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                                <rect x="1.5" y="1.5" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.1" />
                                <rect x="7.5" y="1.5" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.1" />
                                <rect x="1.5" y="7.5" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.1" />
                                <rect x="7.5" y="7.5" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.1" />
                              </svg>
                              Dashboard
                            </Link>
                          )}
                          <Link href="/account" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-[10px] font-space text-[10px] font-semibold tracking-[0.18em] uppercase text-text hover:text-orange hover:bg-surface-2 transition-colors cursor-none">
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                              <circle cx="6.5" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.1" />
                              <path d="M1.5 11.5c0-2.485 2.239-4.5 5-4.5s5 2.015 5 4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                            </svg>
                            My Account
                          </Link>
                          <Link href="/account/orders" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-[10px] font-space text-[10px] font-semibold tracking-[0.18em] uppercase text-text hover:text-orange hover:bg-surface-2 transition-colors cursor-none">
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                              <rect x="1.5" y="2" width="10" height="9" rx="1" stroke="currentColor" strokeWidth="1.1" />
                              <path d="M4 5h5M4 7.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                            </svg>
                            My Orders
                          </Link>
                        </div>
                        <div className="border-t border-border py-1">
                          <button
                            type="button"
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-[10px] font-space text-[10px] font-semibold tracking-[0.18em] uppercase text-muted hover:text-orange hover:bg-surface-2 transition-colors cursor-none text-left"
                          >
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                              <path d="M5 2H2.5A1 1 0 0 0 1.5 3v7a1 1 0 0 0 1 1H5M8.5 9.5 11.5 6.5 8.5 3.5M11.5 6.5H5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Link href="/login" className="navbar-icon-btn" aria-label="Sign in">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.25" />
                    <path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                  </svg>
                </Link>
              )}
            </div>

            <Link
              href="/cart"
              className="navbar-icon-btn"
              aria-label={mounted ? `Cart (${totalItems} items)` : "Cart"}
              style={{ position: "relative" }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1 1h3l2 9h8l2-7H5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="7.5" cy="14.5" r="1.2" fill="currentColor" />
                <circle cx="13.5" cy="14.5" r="1.2" fill="currentColor" />
              </svg>
              {mounted && totalItems > 0 && (
                <span className="cart-badge" aria-label={`${totalItems} items in cart`}>
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* Hamburger — mobile only */}
            <button
              className="navbar-hamburger"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span
                className="bar"
                style={menuOpen ? { transform: "rotate(45deg) translate(4px, 4px)" } : undefined}
              />
              <span
                className="bar"
                style={menuOpen ? { transform: "rotate(-45deg) translate(4px, -4px)" } : undefined}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <div
        className={`nav-mobile-overlay${menuOpen ? " open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        role="dialog"
      >
        {/* Header */}
        <div className="nav-mobile-header">
          <Link href="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
            <span className="navbar-logo-dot" aria-hidden="true" />
            VISION
          </Link>
          <button
            className="navbar-icon-btn"
            aria-label="Close menu"
            type="button"
            onClick={() => setMenuOpen(false)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="nav-mobile-links" aria-label="Mobile navigation links">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="nav-mobile-footer">
          <ThemeToggle />
          <Link
            href="/cart"
            className="navbar-icon-btn relative"
            aria-label={mounted ? `Cart (${totalItems} items)` : "Cart"}
            onClick={() => setMenuOpen(false)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 1h3l2 9h8l2-7H5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="7.5" cy="14.5" r="1.2" fill="currentColor" />
              <circle cx="13.5" cy="14.5" r="1.2" fill="currentColor" />
            </svg>
            {mounted && totalItems > 0 && (
              <span className="cart-badge">{totalItems > 9 ? "9+" : totalItems}</span>
            )}
          </Link>
          {mounted && isLoggedIn() ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="ml-auto navbar-icon-btn font-space text-[10px] font-semibold tracking-[0.18em] uppercase text-muted hover:text-orange transition-colors cursor-none flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 13 13" fill="none" aria-hidden>
                <path d="M5 2H2.5A1 1 0 0 0 1.5 3v7a1 1 0 0 0 1 1H5M8.5 9.5 11.5 6.5 8.5 3.5M11.5 6.5H5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="ml-auto navbar-icon-btn font-space text-[10px] font-semibold tracking-[0.18em] uppercase text-text hover:text-orange transition-colors cursor-none"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
