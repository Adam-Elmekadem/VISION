"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { use } from "react";
import { getProductBySlug, type ProductColor, type ProductSize } from "@/lib/products";
import { useCart } from "@/store/cart";
import Navbar from "@/components/Navbar";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const containerRef     = useRef<HTMLDivElement>(null);
  const [activeImg, setActiveImg]       = useState(0);
  const [activeColor, setActiveColor]   = useState<ProductColor>(product.colors[0]);
  const [activeSize, setActiveSize]     = useState<ProductSize | null>(null);
  const [added, setAdded]               = useState(false);

  const { addItem, openCart } = useCart();

  const handleAddToCart = () => {
    if (!activeSize) return;
    addItem(product, activeColor, activeSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
    openCart();
  };

  useGSAP(() => {
    gsap.from(".pdp-info > *", {
      opacity: 0,
      y: 24,
      duration: 0.6,
      stagger: 0.07,
      ease: "power3.out",
      delay: 0.2,
    });
  }, { scope: containerRef });

  return (
    <>
      <Navbar />
      <div ref={containerRef} className="pdp">
        <div className="pdp-inner">

          {/* ── Gallery (left) ──────────────────────────────── */}
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
                    src={product.images[activeImg] || product.coverImage}
                    alt={`${product.name} view ${activeImg + 1}`}
                    fill
                    priority
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Thumbnails */}
              <div className="pdp-thumbs">
                {product.images.map((img, i) => (
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

          {/* ── Info (right) ────────────────────────────────── */}
          <div className="pdp-info">

            {/* Breadcrumb */}
            <div className="pdp-breadcrumb">
              <Link href="/shop">Shop</Link>
              <span className="pdp-breadcrumb-sep">/</span>
              <Link href={`/collections/${product.collectionSlug}`}>{product.collection}</Link>
              <span className="pdp-breadcrumb-sep">/</span>
              <span style={{ color: "var(--text)" }}>{product.name}</span>
            </div>

            {/* Heading */}
            <div className="pdp-heading">
              <span className="pdp-collection">{product.collection} — {product.category}</span>
              <h1 className="pdp-name">{product.name}</h1>
              <p className="pdp-tagline">{product.tagline}</p>
            </div>

            {/* Price + badges */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <span className="pdp-price">${product.price}</span>
              <div className="pdp-badges">
                {product.isNew      && <span className="badge badge-new">New</span>}
                {product.isLimited  && <span className="badge badge-ltd">Limited</span>}
                {product.isBestseller && <span className="badge badge-best">Bestseller</span>}
                {product.stock <= 6 && (
                  <span className="badge" style={{ border: "1px solid rgba(255,77,0,0.5)", color: "var(--orange)" }}>
                    Only {product.stock} left
                  </span>
                )}
              </div>
            </div>

            {/* Color selector */}
            <div>
              <p className="pdp-section-label">Color — {activeColor.name}</p>
              <div className="pdp-colors">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    className={`pdp-color-btn ${activeColor.name === c.name ? "active" : ""}`}
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
              <p className="pdp-section-label">Size {activeSize ? `— ${activeSize.label}` : "(select one)"}</p>
              <div className="pdp-sizes">
                {product.sizes.map((s) => (
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
              <p className="pdp-description">{product.description}</p>
            </div>

            {/* Specs */}
            <div>
              <p className="pdp-section-label">Specifications</p>
              <div className="pdp-specs">
                <div className="pdp-spec-row">
                  <span className="pdp-spec-key">Material</span>
                  <span className="pdp-spec-val">{product.material.replace("-", " ")}</span>
                </div>
                <div className="pdp-spec-row">
                  <span className="pdp-spec-key">Shape</span>
                  <span className="pdp-spec-val">{product.shape}</span>
                </div>
                <div className="pdp-spec-row">
                  <span className="pdp-spec-key">Category</span>
                  <span className="pdp-spec-val">{product.category}</span>
                </div>
                <div className="pdp-spec-row">
                  <span className="pdp-spec-key">Gender</span>
                  <span className="pdp-spec-val">{product.gender}</span>
                </div>
                <div className="pdp-spec-row">
                  <span className="pdp-spec-key">Lens Types</span>
                  <span className="pdp-spec-val">{product.lensTypes.join(", ").replace(/-/g, " ")}</span>
                </div>
                {activeSize && (
                  <div className="pdp-spec-row">
                    <span className="pdp-spec-key">Dimensions ({activeSize.label})</span>
                    <span className="pdp-spec-val">
                      Lens {activeSize.lens} · Bridge {activeSize.bridge} · Temple {activeSize.temple} mm
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Added to cart feedback toast */}
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
              {product.name} added to cart
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
