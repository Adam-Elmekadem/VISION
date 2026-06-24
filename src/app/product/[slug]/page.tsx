"use client";

import { useState, useRef, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { getProductBySlug, type ProductColor, type ProductSize } from "@/lib/products";
import { useCart } from "@/store/cart";
import Navbar from "@/components/Navbar";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);

  // ── All hooks BEFORE any notFound() throw (Rules of Hooks) ───────────────
  const containerRef   = useRef<HTMLDivElement>(null);
  const [activeImg, setActiveImg]     = useState(0);
  const [activeColor, setActiveColor] = useState<ProductColor | null>(
    product?.colors[0] ?? null
  );
  const [activeSize, setActiveSize]   = useState<ProductSize | null>(null);
  const [added, setAdded]             = useState(false);

  // Zustand selectors — stable references, no object destructure
  const addItem  = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);

  // Register GSAP plugins inside the hook so they never run on the server
  useGSAP(
    () => {
      gsap.registerPlugin();
      gsap.from(".pdp-info > *", {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.07,
        ease: "power3.out",
        delay: 0.2,
      });
    },
    { scope: containerRef, dependencies: [] }
  );

  // ── After all hooks: guard ────────────────────────────────────────────────
  if (!product) notFound();
  // TypeScript narrowing — product is non-null below this line
  const p = product!;
  const color = activeColor ?? p.colors[0];

  const handleAddToCart = () => {
    if (!activeSize) return;
    addItem(p, color, activeSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
    openCart();
  };

  return (
    <>
      <Navbar />
      <div ref={containerRef} className="pdp">

        {/* ── Fixed left gallery ──────────────────────────────── */}
        <div className="pdp-gallery">
          <div className="pdp-main-img">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ position: "absolute", inset: 0 }}
              >
                <Image
                  src={p.images[activeImg] || p.coverImage}
                  alt={`${p.name} view ${activeImg + 1}`}
                  fill
                  priority
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Thumbnails */}
            <div className="pdp-thumbs">
              {p.images.map((img, i) => (
                <button
                  key={i}
                  className={`pdp-thumb ${activeImg === i ? "active" : ""}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Scrolling right info panel ──────────────────────── */}
        <div className="pdp-info">

          {/* Breadcrumb */}
          <div className="pdp-breadcrumb">
            <Link href="/shop">Shop</Link>
            <span className="pdp-breadcrumb-sep">/</span>
            <Link href={`/collections/${p.collectionSlug}`}>{p.collection}</Link>
            <span className="pdp-breadcrumb-sep">/</span>
            <span style={{ color: "var(--text)" }}>{p.name}</span>
          </div>

          {/* Heading */}
          <div className="pdp-heading">
            <span className="pdp-collection">{p.collection} — {p.category}</span>
            <h1 className="pdp-name">{p.name}</h1>
            <p className="pdp-tagline">{p.tagline}</p>
          </div>

          {/* Price + badges */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <span className="pdp-price">${p.price}</span>
            <div className="pdp-badges">
              {p.isNew        && <span className="badge badge-new">New</span>}
              {p.isLimited    && <span className="badge badge-ltd">Limited</span>}
              {p.isBestseller && <span className="badge badge-best">Bestseller</span>}
              {p.stock <= 6   && (
                <span className="badge" style={{ border: "1px solid rgba(255,77,0,0.5)", color: "var(--orange)" }}>
                  Only {p.stock} left
                </span>
              )}
            </div>
          </div>

          {/* Color selector */}
          <div>
            <p className="pdp-section-label">Color — {color.name}</p>
            <div className="pdp-colors">
              {p.colors.map((c) => (
                <button
                  key={c.name}
                  className={`pdp-color-btn ${color.name === c.name ? "active" : ""}`}
                  style={{ background: c.hex }}
                  onClick={() => { setActiveColor(c); setActiveImg(0); }}
                  aria-label={`Color: ${c.name}`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div>
            <p className="pdp-section-label">
              Size {activeSize ? `— ${activeSize.label}` : "(select one)"}
            </p>
            <div className="pdp-sizes">
              {p.sizes.map((s) => (
                <button
                  key={s.label}
                  className={`pdp-size-btn ${activeSize?.label === s.label ? "active" : ""}`}
                  onClick={() => setActiveSize(s)}
                  aria-label={`Size ${s.label}: lens ${s.lens}mm`}
                >
                  {s.label}
                  <span className="size-mm">{s.lens}mm</span>
                </button>
              ))}
            </div>
          </div>

          {/* Add to cart */}
          <button
            className="pdp-add-btn"
            onClick={handleAddToCart}
            disabled={!activeSize}
          >
            {added ? "Added to Cart ✓" : "Add to Cart"}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2h2l2 8h6l2-5H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="7" cy="13" r="1" fill="currentColor"/>
              <circle cx="11" cy="13" r="1" fill="currentColor"/>
            </svg>
          </button>

          {/* Description */}
          <div>
            <p className="pdp-section-label">About</p>
            <p className="pdp-description">{p.description}</p>
          </div>

          {/* Specs */}
          <div>
            <p className="pdp-section-label">Specifications</p>
            <div className="pdp-specs">
              {[
                ["Material",  p.material.replace(/-/g, " ")],
                ["Shape",     p.shape],
                ["Category",  p.category],
                ["Gender",    p.gender],
                ["Lens Types", p.lensTypes.join(", ").replace(/-/g, " ")],
                ...(activeSize
                  ? [[`Dimensions (${activeSize.label})`,
                      `Lens ${activeSize.lens} · Bridge ${activeSize.bridge} · Temple ${activeSize.temple} mm`]]
                  : []),
              ].map(([key, val]) => (
                <div key={key} className="pdp-spec-row">
                  <span className="pdp-spec-key">{key}</span>
                  <span className="pdp-spec-val">{val}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Added feedback toast */}
        <AnimatePresence>
          {added && (
            <motion.div
              className="pdp-added-feedback"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35 }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="var(--orange)" strokeWidth="1.2"/>
                <path d="M4.5 7l2 2 3-3" stroke="var(--orange)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {p.name} added to cart
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
