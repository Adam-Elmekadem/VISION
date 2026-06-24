"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { getFeaturedProducts, type Product } from "@/lib/products";

const FEATURED = getFeaturedProducts();

function productTag(p: Product): string {
  if (p.isLimited)    return "Limited";
  if (p.isBestseller) return "Bestseller";
  if (p.isNew)        return "New Drop";
  return p.collection;
}

function TiltCard({ product }: { product: Product }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), {
    stiffness: 260,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), {
    stiffness: 260,
    damping: 28,
  });
  const glowX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="product-card-outer">
      <motion.div
        ref={cardRef}
        className="product-card"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ z: 20 }}
        transition={{ duration: 0.25 }}
      >
        {/* Image */}
        <div className="product-img-wrap">
          <Image
            src={product.coverImage}
            alt={product.name}
            fill
            sizes="(max-width: 1440px) 33vw, 480px"
            className="object-cover"
          />
        </div>

        {/* Dynamic glow highlight */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at ${glowX.get()} ${glowY.get()}, rgba(255,77,0,0.1) 0%, transparent 60%)`,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        <div className="product-overlay" aria-hidden="true" />

        {/* Info */}
        <div className="product-info">
          <span className="product-tag">{productTag(product)}</span>
          <h3 className="product-name">{product.name}</h3>
          <span className="product-price">${product.price}</span>
        </div>

        {/* CTA arrow */}
        <Link
          href={`/product/${product.slug}`}
          className="product-cta"
          aria-label={`View ${product.name}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8H13M13 8L9 4M13 8L9 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
}

export default function FeaturedDrop() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const words = titleRef.current?.querySelectorAll(".reveal-word-inner");
      if (words) {
        gsap.from(words, {
          y: "110%",
          opacity: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
          },
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="featured-section" id="featured">
      <div className="section-wrap">
        <div className="featured-header">
          <div>
            <p className="section-label" style={{ marginBottom: "20px" }}>
              Featured Collection
            </p>
            <h2 ref={titleRef} className="section-title featured-title">
              {["The", "Drop."].map((word, i, arr) => (
                <span key={i} className="reveal-word">
                  <span className="reveal-word-inner">
                    {word}{i < arr.length - 1 ? " " : ""}
                  </span>
                </span>
              ))}
            </h2>
          </div>

          <Link href="/collections" className="btn-ghost">
            All Collections
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 7H13M13 7L8 2M13 7L8 12"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <div className="featured-grid">
          {FEATURED.map((p) => (
            <TiltCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
