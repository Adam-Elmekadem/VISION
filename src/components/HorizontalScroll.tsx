"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { products } from "@/lib/products";

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const track = trackRef.current;
      if (!track) return;

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(".hscroll-progress-bar", { scaleX: self.progress });
          },
        },
      });

      // Cards stagger in when section first enters viewport
      gsap.from(".hscroll-card", {
        opacity: 0,
        y: 40,
        stagger: 0.06,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="hscroll-section">

      {/* Section header */}
      <div className="hscroll-header">
        <div>
          <span className="section-label">All Frames</span>
          <h2 className="hscroll-title">The Collection</h2>
        </div>
        <span className="hscroll-count">{products.length} frames</span>
      </div>

      {/* Horizontal card track */}
      <div className="hscroll-viewport">
        <div ref={trackRef} className="hscroll-track">
          {products.map((product, i) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="hscroll-card"
              aria-label={product.name}
            >
              {/* Image */}
              <div className="hscroll-card-img">
                <Image
                  src={product.coverImage}
                  alt={product.name}
                  fill
                  sizes="380px"
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="hscroll-card-info">
                <div className="hscroll-card-meta">
                  <span>0{i + 1} / {product.collection}</span>
                  {product.isLimited && <span>Limited</span>}
                  {!product.isLimited && product.isNew && <span>New</span>}
                  {!product.isLimited && !product.isNew && product.isBestseller && <span>Best</span>}
                </div>
                <h3 className="hscroll-card-name">{product.name}</h3>
                <p className="hscroll-card-tagline">{product.tagline}</p>
                <div className="hscroll-card-footer">
                  <span className="hscroll-card-price">${product.price}</span>
                  <div className="hscroll-card-arrow" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M1 7H13M13 7L8 2M13 7L8 12"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Scroll progress bar */}
      <div className="hscroll-progress-track">
        <div className="hscroll-progress-bar" />
      </div>

      {/* Drag hint */}
      <div className="hscroll-hint">scroll to explore →</div>
    </section>
  );
}
