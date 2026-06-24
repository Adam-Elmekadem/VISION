"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ARRIVALS = [
  {
    id: "vector-01",
    name: "Vector 01",
    price: "$195",
    isNew: true,
    image:
      "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=600&q=85",
  },
  {
    id: "chrome-rx",
    name: "Chrome RX",
    price: "$240",
    isNew: true,
    image:
      "https://images.unsplash.com/photo-1582142839970-2b9e4c78f11d?auto=format&fit=crop&w=600&q=85",
  },
  {
    id: "aura-slim",
    name: "Aura Slim",
    price: "$175",
    isNew: false,
    image:
      "https://images.unsplash.com/photo-1624204386084-79974a9d89b6?auto=format&fit=crop&w=600&q=85",
  },
  {
    id: "hex-noir",
    name: "Hex Noir",
    price: "$290",
    isNew: true,
    image:
      "https://images.unsplash.com/photo-1577744486770-020ab432da65?auto=format&fit=crop&w=600&q=85",
  },
];

export default function NewArrivals() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      // Title reveal
      gsap.from(titleRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 82%",
        },
      });

      // Cards stagger in from below
      gsap.from(gridRef.current?.querySelectorAll(".arrival-card") ?? [], {
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 78%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="arrivals-section" id="new-arrivals">
      <div className="section-wrap">
        <div className="arrivals-header">
          <div>
            <p className="section-label" style={{ marginBottom: "20px" }}>
              New Arrivals
            </p>
            <h2 ref={titleRef} className="section-title arrivals-title">
              Just Dropped.
            </h2>
          </div>

          <Link href="/shop" className="btn-ghost">
            View All
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

        <div ref={gridRef} className="arrivals-grid">
          {ARRIVALS.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.id}`}
              className="arrival-card"
              aria-label={`${item.name} — ${item.price}`}
            >
              <div className="arrival-img-wrap">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 1440px) 25vw, 360px"
                  className="object-cover"
                />
                {item.isNew && (
                  <span className="arrival-badge-new" aria-label="New item">
                    New
                  </span>
                )}
              </div>
              <div className="arrival-info">
                <span className="arrival-name">{item.name}</span>
                <span className="arrival-price">{item.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
