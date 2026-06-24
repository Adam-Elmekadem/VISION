"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATS = [
  { value: "142+", label: "Frames" },
  { value: "18", label: "Materials" },
  { value: "2025", label: "Founded" },
];

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Parallax: image moves at 60% of scroll speed
      gsap.to(imgRef.current?.querySelector("img") ?? null, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: imgRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      // Text side stagger
      const textEls = textRef.current?.children ?? [];
      gsap.from(textEls, {
        x: -40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 75%",
        },
      });

      // Stat numbers count up (visual effect via scale)
      gsap.from(".stat-val", {
        textContent: 0,
        snap: { textContent: 1 },
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".philosophy-stats",
          start: "top 85%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="philosophy-section" id="philosophy">
      <div className="section-wrap">
        <div className="philosophy-inner">
          {/* Text */}
          <div ref={textRef} className="philosophy-text">
            <p className="section-label">Our Philosophy</p>

            <h2 className="philosophy-title">
              See the
              <span className="accent"> Future.</span>
            </h2>

            <p className="philosophy-desc">
              Every frame is engineered at the intersection of art and
              precision optics. We design for those who look forward —
              literally and figuratively. Material science meets visual
              identity in each VISION piece.
            </p>

            <div className="philosophy-stats">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="stat-val">{s.value}</div>
                  <div className="stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image with parallax */}
          <div className="philosophy-img-side">
            <div ref={imgRef} className="philosophy-img-frame">
              <motion.div
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                whileInView={{ clipPath: "inset(0% 0 0 0)" }}
                transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
                viewport={{ once: true, margin: "-10%" }}
                style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=900&q=85"
                  alt="Futuristic eyewear close up"
                  fill
                  sizes="(max-width: 1440px) 50vw, 720px"
                  className="object-cover"
                  style={{ objectPosition: "center 30%" }}
                />
              </motion.div>
            </div>
            <div className="philosophy-img-border" aria-hidden="true" />
            <span className="philosophy-img-label" aria-hidden="true">
              Vision Lab / SS25
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
