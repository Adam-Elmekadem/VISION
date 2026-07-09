"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PILLARS = [
  {
    num: "01",
    title: "Material\nScience",
    desc: "Every frame begins with aerospace-grade titanium and carbon-fiber composites — materials chosen not for their name, but for their ability to disappear on your face while lasting a lifetime.",
    detail: "Grade-5 Ti / Carbon weave",
  },
  {
    num: "02",
    title: "Precision\nEngineering",
    desc: "Tolerances measured in microns. Hinge geometry tested over 200 000 cycles. Temple tension calibrated to the exact force that feels natural after eight hours of wear.",
    detail: "±0.01 mm tolerance",
  },
  {
    num: "03",
    title: "Future\nAesthetic",
    desc: "We study how light bends around a face the way architects study how sun moves through a building. Every silhouette is a deliberate decision — never a compromise.",
    detail: "Computational form design",
  },
];

const STATS = [
  { value: "2 023", label: "Founded" },
  { value: "47",    label: "Frame geometries" },
  { value: "0.01",  label: "Millimeter precision" },
  { value: "5",     label: "Material families" },
];

export default function AboutPage() {
  const pageRef   = useRef<HTMLDivElement>(null);
  const heroRef   = useRef<HTMLElement>(null);
  const [count, setCount] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCount(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    // Hero title reveal — each line clips up
    gsap.from(".ab-hero-line", {
      yPercent: 110,
      duration: 1.2,
      stagger: 0.1,
      ease: "power4.out",
      delay: 0.15,
    });

    gsap.from(".ab-hero-sub", {
      opacity: 0,
      y: 22,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.75,
    });

    gsap.from(".ab-hero-cta", {
      opacity: 0,
      y: 18,
      duration: 0.8,
      ease: "power3.out",
      delay: 1.0,
    });

    // Manifesto section
    gsap.from(".ab-manifesto-label", {
      opacity: 0, y: 14, duration: 0.6,
      scrollTrigger: { trigger: ".ab-manifesto", start: "top 82%" },
    });
    gsap.from(".ab-manifesto-text", {
      opacity: 0, y: 32, duration: 1.0, ease: "power3.out",
      scrollTrigger: { trigger: ".ab-manifesto", start: "top 78%" },
    });

    // Pillars
    gsap.from(".ab-pillar", {
      opacity: 0,
      y: 48,
      duration: 0.85,
      stagger: 0.14,
      ease: "power3.out",
      scrollTrigger: { trigger: ".ab-pillars", start: "top 80%" },
    });

    // Dividers
    gsap.from(".ab-divider", {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 1.1,
      ease: "power4.out",
      stagger: 0.12,
      scrollTrigger: { trigger: ".ab-pillars", start: "top 78%" },
    });

    // Stats
    gsap.from(".ab-stat", {
      opacity: 0,
      y: 28,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".ab-stats", start: "top 82%" },
    });

    // Vision bar horizontal lines
    gsap.from(".ab-rule", {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 1.4,
      ease: "expo.out",
      stagger: 0.08,
      scrollTrigger: { trigger: ".ab-closing", start: "top 80%" },
    });

    gsap.from(".ab-closing-title", {
      yPercent: 110,
      duration: 1.15,
      ease: "power4.out",
      delay: 0.1,
      scrollTrigger: { trigger: ".ab-closing", start: "top 76%" },
    });

    gsap.from(".ab-closing-cta", {
      opacity: 0,
      y: 16,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: ".ab-closing", start: "top 72%" },
    });

    // Hero parallax
    gsap.to(".ab-hero-bg", {
      yPercent: 18,
      ease: "none",
      scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1.5 },
    });
  }, { scope: pageRef });

  return (
    <>
      <Navbar />
      <div ref={pageRef} className="min-h-screen bg-black overflow-x-hidden">

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="relative h-screen min-h-[600px] overflow-hidden flex flex-col justify-end pt-[72px]"
        >
          {/* BG image — parallaxed */}
          <div
            className="ab-hero-bg absolute inset-0 z-0 will-change-transform"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=1600&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center 30%",
              filter: "brightness(0.28) contrast(1.1) saturate(0.5)",
            }}
          />

          {/* Orange glow */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 70% at 30% 80%, rgba(255,77,0,0.09) 0%, transparent 65%)",
            }}
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,77,0,0.025) 1px, transparent 1px)," +
                "linear-gradient(90deg, rgba(255,77,0,0.025) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          {/* HUD label */}
          <p className="absolute top-[88px] left-8 z-10 font-space text-[8px] font-semibold tracking-[0.45em] uppercase text-[rgba(255,77,0,0.4)] pointer-events-none">
            VISION EYEWEAR — EST. 2023
          </p>

          {/* Content */}
          <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-16 pb-16 lg:pb-20 w-full">
            <p className="ab-hero-sub font-space text-[10px] font-semibold tracking-[0.45em] uppercase text-orange mb-6 flex items-center gap-3">
              <span className="block w-8 h-px bg-orange flex-shrink-0" />
              Our Story
            </p>

            <div className="overflow-hidden mb-2">
              <h1 className="ab-hero-line font-space text-[clamp(64px,11vw,164px)] font-bold tracking-[-0.05em] text-text leading-[0.88]">
                Born from
              </h1>
            </div>
            <div className="overflow-hidden mb-10">
              <h1 className="ab-hero-line font-space text-[clamp(64px,11vw,164px)] font-bold tracking-[-0.05em] text-orange leading-[0.88]">
                the future.
              </h1>
            </div>

            <div className="ab-hero-cta flex items-center gap-8 flex-wrap">
              <p className="font-inter text-[15px] font-light text-[rgba(240,240,240,0.55)] leading-[1.7] max-w-[400px]">
                We didn't set out to make eyewear. We set out to
                make something that hadn't existed yet.
              </p>
              <Link
                href="/collections"
                className="group relative inline-flex items-center gap-4 overflow-hidden border border-[rgba(255,77,0,0.35)] px-8 py-[16px] font-space text-[10px] font-bold tracking-[0.28em] uppercase text-text cursor-none flex-shrink-0"
              >
                <span className="absolute inset-0 bg-orange -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 group-hover:text-[#0d0d0d] transition-colors duration-200 flex items-center gap-3">
                  View collections
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                    <path d="M1.5 6.5h10M7.5 2l4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-[2] pointer-events-none" />
        </section>

        {/* ── Manifesto ─────────────────────────────────────────────── */}
        <section className="ab-manifesto max-w-[1440px] mx-auto px-8 lg:px-16 py-24 lg:py-32 border-b border-border">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
            <div>
              <p className="ab-manifesto-label font-space text-[9px] font-semibold tracking-[0.42em] uppercase text-orange">
                Our Manifesto
              </p>
            </div>
            <div>
              <p className="ab-manifesto-text font-space text-[clamp(22px,3vw,40px)] font-light text-text leading-[1.35] tracking-[-0.02em]">
                "The face is the most personal canvas. Every frame
                we make is a statement — not about fashion, but
                about the kind of person who sees the world
                differently, and wants the world to know it."
              </p>
              <p className="ab-manifesto-text font-inter text-[15px] font-light text-muted leading-[1.9] mt-8 max-w-[580px]">
                We are a team of engineers and designers who met at the intersection of aerospace
                manufacturing and contemporary aesthetics. We asked a simple question: why does
                eyewear still look the same as it did in 1990? Three years later, VISION exists
                because the answer wasn't good enough.
              </p>
            </div>
          </div>
        </section>

        {/* ── Three pillars ─────────────────────────────────────────── */}
        <section className="ab-pillars max-w-[1440px] mx-auto px-8 lg:px-16 py-24 lg:py-32 border-b border-border">
          <div className="flex items-center justify-between gap-8 mb-16">
            <p className="font-space text-[9px] font-semibold tracking-[0.42em] uppercase text-orange">
              What we stand for
            </p>
            <span className="hidden lg:block h-px flex-1 bg-border mx-8" />
            <span className="font-space text-[9px] font-semibold tracking-[0.32em] uppercase text-muted">
              Three Pillars
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {PILLARS.map((p, i) => (
              <div key={p.num} className="ab-pillar group relative">
                {/* Left border rule */}
                <div
                  className="ab-divider absolute top-0 left-0 w-px bg-border h-full origin-top"
                  aria-hidden
                />

                <div className="pl-8 pr-6 pb-12 pt-0">
                  <span className="font-space text-[10px] font-bold tracking-[0.3em] text-orange mb-6 block">
                    {p.num}
                  </span>
                  <h3 className="font-space text-[clamp(28px,3vw,42px)] font-bold tracking-[-0.03em] text-text leading-[1.08] mb-6 whitespace-pre-line">
                    {p.title}
                  </h3>
                  <p className="font-inter text-[14px] font-light text-muted leading-[1.85] mb-8">
                    {p.desc}
                  </p>
                  <span className="font-space text-[9px] font-semibold tracking-[0.38em] uppercase text-orange opacity-60">
                    {p.detail}
                  </span>
                </div>

                {/* Last column doesn't need a right rule, but we add one for layout */}
                {i === PILLARS.length - 1 && (
                  <div
                    className="ab-divider absolute top-0 right-0 w-px bg-border h-full origin-top"
                    aria-hidden
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Numbers ───────────────────────────────────────────────── */}
        <section className="ab-stats border-b border-border">
          <div className="max-w-[1440px] mx-auto px-8 lg:px-16 py-20 grid grid-cols-2 lg:grid-cols-4 gap-0">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`ab-stat flex flex-col gap-3 py-10 px-6 ${i > 0 ? "border-l border-border" : ""}`}
              >
                <span className="font-space text-[clamp(40px,5vw,72px)] font-bold tracking-[-0.05em] text-text leading-none tabular-nums">
                  {s.value}
                </span>
                <span className="font-space text-[9px] font-semibold tracking-[0.38em] uppercase text-muted">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Process strip ─────────────────────────────────────────── */}
        <section className="max-w-[1440px] mx-auto px-8 lg:px-16 py-24 lg:py-32 border-b border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image grid */}
            <div className="grid grid-cols-2 gap-[3px]">
              <div
                className="aspect-[3/4] bg-surface-2 overflow-hidden"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "grayscale(20%) brightness(0.85)",
                }}
              />
              <div className="aspect-[3/4] bg-surface-2 overflow-hidden mt-12">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "grayscale(20%) brightness(0.85)",
                  }}
                />
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col gap-8">
              <p className="font-space text-[9px] font-semibold tracking-[0.42em] uppercase text-orange">
                The Process
              </p>
              <h2 className="font-space text-[clamp(32px,4vw,58px)] font-bold tracking-[-0.04em] text-text leading-[1.05]">
                Made without<br />compromise.
              </h2>
              <div className="flex flex-col gap-6">
                {[
                  { step: "01", label: "Concept", desc: "Form studies start on paper. Hundreds of sketches before a single file is opened." },
                  { step: "02", label: "Prototype", desc: "3D-printed in 24 hours. Worn for 2 weeks. Revised until nothing feels wrong." },
                  { step: "03", label: "Manufacture", desc: "Produced in micro-runs with human quality checks at every stage." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-6 items-start">
                    <span className="font-space text-[9px] font-bold tracking-[0.3em] text-orange mt-[3px] flex-shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <p className="font-space text-[13px] font-bold tracking-[0.02em] text-text mb-1">
                        {item.label}
                      </p>
                      <p className="font-inter text-[13px] font-light text-muted leading-[1.75]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Closing CTA ───────────────────────────────────────────── */}
        <section className="ab-closing relative overflow-hidden py-32 lg:py-44">
          {/* Horizontal rules */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="ab-rule absolute left-0 right-0 h-px bg-border pointer-events-none"
              style={{ top: `${(i + 1) * (100 / 7)}%` }}
            />
          ))}

          <div className="relative z-10 max-w-[1440px] mx-auto px-8 lg:px-16 text-center">
            <p className="font-space text-[9px] font-semibold tracking-[0.45em] uppercase text-orange mb-8">
              Join the vision
            </p>
            <div className="overflow-hidden mb-2">
              <h2 className="ab-closing-title font-space text-[clamp(56px,10vw,148px)] font-bold tracking-[-0.05em] text-text leading-[0.88]">
                See further.
              </h2>
            </div>
            <div className="ab-closing-cta flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
              <Link
                href="/shop"
                className="group relative inline-flex items-center gap-4 overflow-hidden bg-orange px-10 py-[18px] font-space text-[11px] font-bold tracking-[0.28em] uppercase text-[#0d0d0d] cursor-none"
              >
                Shop all frames
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                  <path d="M1.5 6.5h10M7.5 2l4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/collections"
                className="group relative inline-flex items-center gap-4 overflow-hidden border border-border px-10 py-[18px] font-space text-[11px] font-bold tracking-[0.28em] uppercase text-text cursor-none"
              >
                <span className="absolute inset-0 bg-surface -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center gap-3">
                  Explore collections
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                    <path d="M1.5 6.5h10M7.5 2l4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
