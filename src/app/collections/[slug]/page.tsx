"use client";

import { use, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "motion/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getCollectionBySlug } from "@/lib/collections";
import { getProductsByCollection, type Product } from "@/lib/products";
import Navbar from "@/components/Navbar";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="shop-card">
      <div className="shop-card-img">
        <Image
          src={product.coverImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="shop-card-badges">
          {product.isNew     && <span className="badge badge-new">New</span>}
          {product.isLimited && <span className="badge badge-ltd">Limited</span>}
        </div>
      </div>
      <div className="shop-card-info">
        <div>
          <span className="shop-card-collection">{product.collection}</span>
          <h3 className="shop-card-name">{product.name}</h3>
        </div>
        <div className="shop-card-bottom">
          <span className="shop-card-price">${product.price}</span>
          <div className="shop-card-colors">
            {product.colors.slice(0, 3).map((c) => (
              <span key={c.name} className="color-dot" style={{ background: c.hex }} title={c.name} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug }   = use(params);
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const products     = getProductsByCollection(slug);
  const containerRef = useRef<HTMLDivElement>(null);
  const accent       = collection.accentColor;

  useGSAP(() => {
    // Hero image wipe-in from right on mount
    gsap.to(".col-v2-img-reveal", {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.4,
      ease: "power4.inOut",
      delay: 0.2,
    });

    // Hero image parallax on scroll
    gsap.to(".col-v2-hero-img", {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: ".col-v2-hero",
        start: "top top",
        end:   "bottom top",
        scrub: 1.4,
      },
    });

    // Editorial info fade-in
    gsap.from(".col-v2-info-grid > *", {
      opacity: 0,
      y: 32,
      duration: 0.75,
      stagger: 0.14,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".col-v2-editorial",
        start: "top 82%",
        toggleActions: "play none none none",
      },
    });

    // Stat values
    gsap.from(".col-v2-stat-val", {
      opacity: 0,
      y: 24,
      duration: 0.65,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".col-v2-stats",
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    // Product cards stagger
    gsap.from(".col-v2-grid .shop-card", {
      opacity: 0,
      y: 40,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".col-v2-grid",
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  }, { scope: containerRef });

  return (
    <>
      <Navbar />
      <div ref={containerRef} className="min-h-screen bg-black pt-[72px]">

        {/* ── Cinematic split hero ────────────────────────────────── */}
        <div className="col-v2-hero grid grid-cols-1 lg:grid-cols-2 min-h-[100svh] lg:h-[calc(100vh-72px)] lg:min-h-[560px] overflow-hidden">

          {/* Left — dark text panel */}
          <div className="bg-black flex flex-col justify-end px-10 lg:px-14 pb-14 lg:pb-[72px] pt-12 lg:pt-0 relative z-[2] border-b lg:border-b-0 lg:border-r border-border">

            {/* Breadcrumb */}
            <nav
              className="font-space text-[9px] font-semibold tracking-[0.32em] uppercase text-muted flex items-center gap-2 mb-6 flex-wrap"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="text-muted hover:text-orange transition-colors cursor-none">Home</Link>
              <span className="text-border/60">/</span>
              <Link href="/collections" className="text-muted hover:text-orange transition-colors cursor-none">Collections</Link>
              <span className="text-border/60">/</span>
              <span style={{ color: "var(--text-mid)" }}>{collection.name}</span>
            </nav>

            {/* Season */}
            <motion.span
              className="font-space text-[10px] font-bold tracking-[0.38em] uppercase mb-4 block"
              style={{ color: accent }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              {collection.season} / {collection.year}
            </motion.span>

            {/* Title */}
            <motion.h1
              className="font-space text-[clamp(52px,7vw,96px)] font-bold tracking-[-0.04em] text-text leading-[0.92] mb-5"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {collection.name}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="font-inter text-[15px] font-light text-muted leading-[1.65] max-w-[380px] mb-10"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              {collection.tagline}
            </motion.p>

            {/* CTA + count */}
            <div className="flex items-center gap-8 flex-wrap">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.75 }}
              >
                <a
                  href="#products"
                  className="inline-flex items-center gap-3 font-space text-[11px] font-bold tracking-[0.25em] uppercase text-[#0d0d0d] px-8 py-[18px] cursor-none transition-opacity hover:opacity-85"
                  style={{ background: accent }}
                >
                  Shop Now
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M7 2v10M3 8l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </motion.div>

              <motion.span
                className="font-space text-[9px] font-semibold tracking-[0.35em] uppercase text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                {products.length} {products.length === 1 ? "Frame" : "Frames"}
              </motion.span>
            </div>
          </div>

          {/* Right — image with wipe reveal */}
          <div className="col-v2-hero-img-panel relative overflow-hidden min-h-[55vw] lg:min-h-0">
            <div
              className="col-v2-img-reveal absolute inset-0 [will-change:clip-path]"
              style={{ clipPath: "inset(0% 100% 0% 0%)" }}
            >
              <div className="col-v2-hero-img absolute inset-0 [will-change:transform]">
                <Image
                  src={collection.coverImage}
                  alt={collection.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  style={{ filter: "brightness(0.78) contrast(1.06) saturate(0.9)" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Editorial info ─────────────────────────────────────── */}
        <section className="col-v2-editorial max-w-[1440px] mx-auto px-8 lg:px-12 py-20 lg:py-24 border-b border-border">
          <div className="col-v2-info-grid grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Description */}
            <div>
              <p
                className="font-space text-[9px] font-bold tracking-[0.4em] uppercase mb-6 block"
                style={{ color: accent }}
              >
                About the collection
              </p>
              <p className="font-inter text-[15px] font-light leading-[1.9] text-muted">
                {collection.description}
              </p>
            </div>

            {/* Stats */}
            <div className="col-v2-stats flex flex-col gap-8 border-t lg:border-t-0 lg:border-l border-border pt-10 lg:pt-0 lg:pl-12">
              <div className="col-v2-stat flex flex-col gap-1.5">
                <p
                  className="col-v2-stat-val font-space text-[clamp(36px,4vw,56px)] font-bold tracking-[-0.04em] leading-none"
                  style={{ color: accent }}
                >
                  {String(products.length).padStart(2, "0")}
                </p>
                <p className="font-space text-[9px] font-semibold tracking-[0.35em] text-muted uppercase">
                  Frames
                </p>
              </div>
              <div className="col-v2-stat flex flex-col gap-1.5">
                <p className="col-v2-stat-val font-space text-[clamp(36px,4vw,56px)] font-bold tracking-[-0.04em] text-text leading-none">
                  {collection.year}
                </p>
                <p className="font-space text-[9px] font-semibold tracking-[0.35em] text-muted uppercase">
                  Season {collection.season}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Product grid ─────────────────────────────────────────── */}
        <section id="products" className="col-v2-products max-w-[1440px] mx-auto px-8 lg:px-12 py-16 pb-24">
          <div className="flex items-end justify-between gap-8 pb-12 border-b border-border mb-0">
            <div>
              <p
                className="font-space text-[9px] font-bold tracking-[0.4em] uppercase mb-3"
                style={{ color: accent }}
              >
                The Frames
              </p>
              <h2 className="col-v2-products-title font-space text-[clamp(28px,3.5vw,52px)] font-bold tracking-[-0.03em] text-text leading-tight">
                {collection.name} — Full Drop
              </h2>
            </div>
            <Link href="/shop" className="btn-ghost flex-shrink-0">
              All frames
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="col-v2-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px]">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
