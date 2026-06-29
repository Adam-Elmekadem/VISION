"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCart } from "@/store/cart";
import ThemeToggle from "@/components/ThemeToggle";

gsap.registerPlugin(useGSAP);

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const totalItems = useCart((s) => s.totalItems());

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        delay: 0.3,
      })
        .from(
          logoRef.current,
          { x: -24, opacity: 0, duration: 0.7 },
          "-=0.5"
        )
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
    <nav ref={navRef} className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Logo */}
        <Link ref={logoRef} href="/" className="navbar-logo">
          <span className="navbar-logo-dot" aria-hidden="true" />
          VISION
        </Link>

        {/* Nav Links */}
        <ul ref={linksRef} className="nav-links" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="nav-link">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div ref={actionsRef} className="navbar-actions">
          <ThemeToggle />

          <button
            className="navbar-icon-btn"
            aria-label="Search"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.25" />
              <path d="M12 12L16 16" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
            </svg>
          </button>

          <button
            className="navbar-icon-btn"
            aria-label="Account"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.25" />
              <path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
            </svg>
          </button>

          <Link
            href="/cart"
            className="navbar-icon-btn"
            aria-label={`Cart (${totalItems} items)`}
            style={{ position: "relative" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 1h3l2 9h8l2-7H5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="7.5" cy="14.5" r="1.2" fill="currentColor" />
              <circle cx="13.5" cy="14.5" r="1.2" fill="currentColor" />
            </svg>
            {totalItems > 0 && (
              <span className="cart-badge" aria-label={`${totalItems} items in cart`}>
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
