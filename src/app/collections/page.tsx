"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion } from "motion/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { collections } from "@/lib/collections";
import Navbar from "@/components/Navbar";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ORDINALS = ["01", "02", "03"];
const MARQUEE_ITEMS = [...collections, ...collections, ...collections, ...collections];

export default function CollectionsPage() {
  const pageRef    = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Title slide-up on load
    gsap.from(".cl-page-title", {
      yPercent: 110,
      duration: 1.1,
      ease: "power4.out",
      delay: 0.1,
    });

    // Infinite marquee scroll
    const inner = marqueeRef.current;
    if (inner) {
      gsap.fromTo(inner, { x: 0 }, {
        x: -(inner.scrollWidth / 2),
        duration: 28,
        ease: "none",
        repeat: -1,
      });
    }

    // Per-section animations
    gsap.utils.toArray<HTMLElement>(".cl-section").forEach((section) => {
      // Clip-path image reveal from bottom
      gsap.from(section.querySelector(".cl-img-wrap"), {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: { trigger: section, start: "top 82%", toggleActions: "play none none none" },
      });

      // Image parallax scrub
      gsap.to(section.querySelector(".cl-img-wrap img"), {
        yPercent: -8,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.5 },
      });

      // Text stagger
      gsap.from(
        section.querySelectorAll(".cl-eyebrow, .cl-col-name, .cl-col-tagline, .cl-col-desc, .cl-cta"),
        {
          opacity: 0,
          y: 36,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none none" },
        }
      );

      // Accent line (CSS transition driven by class toggle)
      ScrollTrigger.create({
        trigger: section,
        start: "top 78%",
        onEnter:     () => section.classList.add("is-visible"),
        onLeaveBack: () => section.classList.remove("is-visible"),
      });
    });
  }, { scope: pageRef });

  return (
    <>
      <Navbar />
      <div ref={pageRef} className="min-h-screen bg-black pt-[72px] overflow-x-hidden">

        {/* ── Page header ──────────────────────────────────────────── */}
        <header className="relative py-16 overflow-hidden border-b border-border">
          <div className="max-w-[1440px] mx-auto px-12 flex items-end justify-between gap-8">
            {/* Big title */}
            <div className="overflow-hidden leading-[0.88]">
              <span className="cl-page-title block font-space text-[clamp(80px,13vw,180px)] font-bold tracking-[-0.05em] text-text leading-[0.88] will-change-transform">
                COLLECTIONS
              </span>
            </div>
            {/* Series count badge */}
            <div className="flex flex-col items-end gap-2 pb-2 flex-shrink-0">
              <motion.span
                className="font-space text-5xl font-bold tracking-[-0.04em] text-text leading-none"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                {String(collections.length).padStart(2, "0")}
              </motion.span>
              <motion.span
                className="font-space text-[9px] font-semibold tracking-[0.4em] uppercase text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                Series
              </motion.span>
            </div>
          </div>
        </header>

        {/* ── Infinite marquee ─────────────────────────────────────── */}
        <div className="overflow-hidden border-b border-border py-[14px] bg-surface">
          <div ref={marqueeRef} className="flex whitespace-nowrap will-change-transform">
            {MARQUEE_ITEMS.map((col, i) => (
              <span
                key={`${col.slug}-${i}`}
                className="font-space text-[9px] font-semibold tracking-[0.38em] uppercase text-muted flex items-center gap-5 px-10 flex-shrink-0"
              >
                <span
                  className="inline-block w-[5px] h-[5px] rotate-45 flex-shrink-0"
                  style={{ background: col.accentColor }}
                  aria-hidden="true"
                />
                {col.name}
                <span className="opacity-30 mx-1">·</span>
                {col.season} {col.year}
              </span>
            ))}
          </div>
        </div>

        {/* ── Collection sections ───────────────────────────────────── */}
        {collections.map((col, idx) => {
          const isRev = idx % 2 !== 0;
          return (
            <section
              key={col.slug}
              className="cl-section relative overflow-hidden border-b border-border min-h-[85vh] flex flex-col justify-center"
            >
              {/* Ghost ordinal background number */}
              <span
                className="absolute bottom-[-0.1em] right-[-0.02em] font-space font-bold tracking-[-0.06em] leading-none select-none pointer-events-none z-0 text-border opacity-40"
                style={{ fontSize: "clamp(180px,28vw,360px)" }}
                aria-hidden="true"
              >
                {ORDINALS[idx]}
              </span>

              <div className="max-w-[1440px] mx-auto px-8 lg:px-12 py-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-[2]">

                {/* Text side */}
                <div className={`cl-text-side flex flex-col gap-7 ${isRev ? "lg:order-2" : "lg:order-1"}`}>
                  {/* Eyebrow: number + accent line + season */}
                  <div className="cl-eyebrow flex items-center gap-4">
                    <span
                      className="font-space text-[10px] font-bold tracking-[0.32em] uppercase px-3 py-[5px] border"
                      style={{
                        color: col.accentColor,
                        borderColor: `${col.accentColor}40`,
                        background: `${col.accentColor}12`,
                      }}
                    >
                      {ORDINALS[idx]}
                    </span>
                    {/* Accent line — width animated via .cl-section.is-visible CSS rule */}
                    <span
                      className="cl-accent-line h-px flex-shrink-0 transition-[width] duration-700 ease-out"
                      style={{ background: col.accentColor, width: 0 }}
                      aria-hidden="true"
                    />
                    <span
                      className="font-space text-[9px] font-bold tracking-[0.38em] uppercase"
                      style={{ color: col.accentColor }}
                    >
                      {col.season} / {col.year}
                    </span>
                  </div>

                  <h2 className="cl-col-name font-space text-[clamp(52px,6.5vw,96px)] font-bold tracking-[-0.04em] text-text leading-[0.92]">
                    {col.name}
                  </h2>

                  <p className="cl-col-tagline font-inter text-base font-light text-muted leading-relaxed">
                    {col.tagline}
                  </p>

                  <p className="cl-col-desc font-inter text-sm font-light text-muted leading-[1.85] line-clamp-3">
                    {col.description.slice(0, 160)}{col.description.length > 160 ? "…" : ""}
                  </p>

                  {/* CTA with fill-from-left hover */}
                  <Link
                    href={`/collections/${col.slug}`}
                    className="cl-cta group relative inline-flex items-center overflow-hidden border border-border px-8 py-[17px] self-start cursor-none mt-1"
                  >
                    {/* Fill overlay */}
                    <span
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"
                      style={{ background: col.accentColor }}
                      aria-hidden="true"
                    />
                    {/* Label + arrow */}
                    <span className="relative z-10 flex items-center gap-3 font-space text-[10px] font-bold tracking-[0.28em] uppercase text-text group-hover:text-[#0d0d0d] transition-colors duration-200">
                      Explore Collection
                      <svg
                        width="14" height="14" viewBox="0 0 14 14" fill="none"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      >
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </Link>
                </div>

                {/* Image side */}
                <div className={`cl-img-side relative ${isRev ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="cl-img-wrap relative overflow-hidden aspect-[3/2] bg-surface">
                    <Image
                      src={col.coverImage}
                      alt={col.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[900ms] ease-out"
                    />
                    {/* Subtle dark-corner tint */}
                    <div className="absolute inset-0 bg-gradient-to-tl from-black/30 to-transparent pointer-events-none z-[1]" />
                  </div>
                  <span className="absolute -bottom-5 right-0 font-space text-[8px] font-semibold tracking-[0.38em] uppercase pointer-events-none" style={{ color: `${col.accentColor}66` }}>
                    Vision — {col.name} {col.year}
                  </span>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
