"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { collections } from "@/lib/collections";
import Navbar from "@/components/Navbar";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function CollectionsPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".collection-card", {
      opacity: 0,
      y: 40,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
      delay: 0.3,
    });
  }, { scope: pageRef });

  return (
    <>
      <Navbar />
      <div ref={pageRef} className="collections-page">

        {/* Header */}
        <div className="collections-header">
          <div className="section-wrap">
            <motion.p
              className="section-label"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Seasonal Drops
            </motion.p>
            <motion.h1
              className="collections-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Collections
            </motion.h1>
          </div>
        </div>

        {/* Collections grid */}
        <div className="section-wrap collections-grid">
          {collections.map((col) => (
            <Link key={col.slug} href={`/collections/${col.slug}`} className="collection-card">
              <div className="collection-card-img">
                <Image
                  src={col.coverImage}
                  alt={col.name}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="collection-card-overlay" />
              </div>
              <div className="collection-card-info">
                <p className="collection-season" style={{ color: col.accentColor }}>
                  {col.season} / {col.year}
                </p>
                <h2 className="collection-name">{col.name}</h2>
                <p className="collection-tagline">{col.tagline}</p>
              </div>
              <div className="collection-arrow">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
