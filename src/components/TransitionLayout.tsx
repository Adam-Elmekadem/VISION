"use client";

import { useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

export default function TransitionLayout({ children }: { children: React.ReactNode }) {
  const curtainRef    = useRef<HTMLDivElement>(null);
  const pathname      = usePathname();
  const router        = useRouter();
  const transitioning = useRef(false);

  // ── INTERCEPT all internal <a> clicks BEFORE Next.js navigates ────────────
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("mailto") ||
        href.startsWith("tel") ||
        href.startsWith("#") ||
        anchor.target === "_blank"
      ) return;

      // Same page — skip transition entirely (pathname never changes → curtain would stay forever)
      if (href === pathname) return;

      // Already mid-transition — block any new click
      if (transitioning.current) { e.preventDefault(); return; }

      e.preventDefault();
      transitioning.current = true;

      const curtain = curtainRef.current;
      if (!curtain) { router.push(href); return; }

      // EXIT: curtain sweeps DOWN from top, covering the current page
      gsap.fromTo(
        curtain,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          duration: 0.38,
          ease: "power4.inOut",
          onComplete: () => router.push(href),
        }
      );
    };

    // Capture phase — fires before Next.js's own click handler
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  // pathname in deps so the closure always sees the current route
  }, [router, pathname]);

  // ── ENTRANCE: curtain is already covering the new page; lift it away ───────
  useEffect(() => {
    const curtain = curtainRef.current;
    if (!curtain) return;

    gsap.fromTo(
      curtain,
      { scaleY: 1, transformOrigin: "bottom center" },
      {
        scaleY: 0,
        duration: 0.45,
        ease: "power4.inOut",
        delay: 0.05,
        onComplete: () => { transitioning.current = false; },
      }
    );
  }, [pathname]);

  return (
    <>
      <div ref={curtainRef} aria-hidden="true" className="transition-curtain" suppressHydrationWarning />
      <div>{children}</div>
    </>
  );
}
