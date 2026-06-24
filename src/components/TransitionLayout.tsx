"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function TransitionLayout({ children }: { children: React.ReactNode }) {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const pathname   = usePathname();

  // Entrance wipe on every route change
  useEffect(() => {
    const curtain = curtainRef.current;
    const wrap    = wrapRef.current;
    if (!curtain || !wrap) return;

    const tl = gsap.timeline();
    // 1. Curtain comes down from top
    tl.fromTo(curtain,
      { scaleY: 0, transformOrigin: "top center" },
      { scaleY: 1, duration: 0.38, ease: "power4.inOut" }
    )
    // 2. Page content swaps (happens while curtain is fully covering)
    .set(wrap, { opacity: 0 })
    // 3. Curtain lifts away from bottom
    .to(curtain, {
      scaleY: 0,
      transformOrigin: "bottom center",
      duration: 0.42,
      ease: "power4.inOut",
    })
    // 4. Page fades in underneath
    .to(wrap, { opacity: 1, duration: 0.25, ease: "power2.out" }, "-=0.15");

    return () => { tl.kill(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {/* Full-screen wipe curtain — styles via CSS class to avoid SSR/hydration mismatch */}
      <div ref={curtainRef} aria-hidden="true" className="transition-curtain" />
      <div ref={wrapRef}>
        {children}
      </div>
    </>
  );
}
