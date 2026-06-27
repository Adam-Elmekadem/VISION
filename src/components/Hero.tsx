"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import ShaderAnimation from "@/components/ShaderAnimation";

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 1.0,
      });

      tl.from(eyebrowRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
      }).from(
        searchRef.current,
        {
          y: 30,
          opacity: 0,
          scale: 0.97,
          duration: 0.9,
        },
        "-=0.4"
      ).from(
        scrollRef.current,
        { opacity: 0, duration: 0.8 },
        "-=0.2"
      );
    },
    { scope: contentRef }
  );

  return (
    <section className="hero" aria-label="Hero">
      {/* ── Full-bleed shader background ── */}
      <ShaderAnimation />

      {/* Dark vignette so text stays readable over the shader */}
      <div className="hero-vignette" aria-hidden="true" />

      {/* ── HUD corner decorations ── */}
      <div className="hero-corner hero-corner-tl" aria-hidden="true" />
      <div className="hero-corner hero-corner-tr" aria-hidden="true" />
      <div className="hero-corner hero-corner-bl" aria-hidden="true" />
      <div className="hero-corner hero-corner-br" aria-hidden="true" />

      <div className="hero-hud hero-hud-tl" aria-hidden="true">
        <div>EST. 2025</div>
        <div>VISION™ LAB</div>
      </div>
      <div className="hero-hud hero-hud-tr" aria-hidden="true">
        <div>COL. SS/25</div>
        <div>FRAMES — 142</div>
      </div>

      {/* ── Main content ── */}
      <div ref={contentRef} className="hero-content">
        <p ref={eyebrowRef} className="hero-eyebrow" aria-label="New season collection">
          New Season Drop
        </p>

        {/* Search */}
        <div ref={searchRef} className="hero-search-wrap">
          <motion.input
            type="search"
            className="hero-search"
            placeholder="Search frames, collections..."
            aria-label="Search eyewear"
            whileFocus={{ scale: 1.005 }}
            transition={{ duration: 0.2 }}
          />
          <span className="hero-search-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle
                cx="7.5"
                cy="7.5"
                r="5.5"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M12 12L16.5 16.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div ref={scrollRef} className="hero-scroll" aria-hidden="true">
        <div className="hero-scroll-line" />
        <span className="hero-scroll-label">Scroll</span>
      </div>
    </section>
  );
}
