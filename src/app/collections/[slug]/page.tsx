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

function CollectionProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <Link href={`/product/${product.slug}`} className="shop-card">
      <div className="shop-card-img">
        <Image
          src={product.coverImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="shop-card-badges">
          {product.isNew      && <span className="badge badge-new">New</span>}
          {product.isLimited  && <span className="badge badge-ltd">Limited</span>}
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
              <span
                key={c.name}
                className="color-dot"
                style={{ background: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = getProductsByCollection(slug);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Parallax on hero image
    gsap.to(".col-hero-img img", {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: ".col-hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    // Stagger product cards on scroll
    gsap.from(".col-grid .shop-card", {
      opacity: 0,
      y: 40,
      duration: 0.65,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".col-grid",
        start: "top 85%",
      },
    });
  }, { scope: containerRef });

  return (
    <>
      <Navbar />
      <div ref={containerRef} className="col-detail">

        {/* Hero */}
        <div className="col-hero">
          <div className="col-hero-img">
            <Image
              src={collection.coverImage}
              alt={collection.name}
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="col-hero-overlay" />
          <div className="col-hero-content">
            <motion.p
              className="col-hero-season"
              style={{ color: collection.accentColor }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {collection.season} / {collection.year}
            </motion.p>
            <motion.h1
              className="col-hero-name"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {collection.name}
            </motion.h1>
          </div>
        </div>

        {/* Body */}
        <div className="col-body">
          <div className="section-wrap">

            <div className="col-body-inner">
              {/* Left: description */}
              <div>
                <p className="section-label" style={{ color: collection.accentColor }}>
                  About the collection
                </p>
                <p className="col-desc">{collection.description}</p>
                <Link href="/shop" className="btn-ghost" style={{ marginTop: 32, display: "inline-flex" }}>
                  Shop all frames
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>

              {/* Right: count + tagline */}
              <div>
                <p className="col-products-label" style={{ color: collection.accentColor }}>
                  Frames in this collection
                </p>
                <p className="col-products-count">
                  {products.length} {products.length === 1 ? "Frame" : "Frames"}
                </p>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, fontWeight: 300, color: "var(--muted)", lineHeight: 1.7 }}>
                  {collection.tagline}
                </p>
              </div>
            </div>

            {/* Product grid */}
            <div className="col-grid">
              {products.map((product, i) => (
                <CollectionProductCard key={product.id} product={product} index={i} />
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
