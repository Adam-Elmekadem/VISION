"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const CHUNK =
  "VISION — ENGINEERED BEYOND THE VISIBLE — SEE WHAT OTHERS MISS — CRAFTED FOR THE FUTURE — " +
  "TITANIUM PRECISION — ULTRALIGHT FORM — WHERE DESIGN MEETS PERCEPTION — ";

const MANIFESTO = CHUNK.repeat(4);

export default function ScaleReveal() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 2}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      tl
        .fromTo(
          ".sr-img",
          { clipPath: "inset(25% 25% 25% 25% round 8px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.75 }
        )
        .to(".sr-overlay", { opacity: 0.55, duration: 0.75 }, "<")
        .to(".sr-label", { opacity: 0, y: -14, duration: 0.3 }, "<")
        .fromTo(
          ".sr-text-track",
          { xPercent: 0 },
          { xPercent: -50, duration: 1 },
          "<"
        );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="scale-reveal-section">
      {/* Full-screen image — clip-path animates from 50×50 box to 100vw×100vh */}
      <div className="sr-img">
        <Image
          src="https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=2000&q=90"
          alt="Vision — beyond the visible"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Dark overlay fades in as image expands */}
      <div className="sr-overlay" />

      {/* Center label — fades out immediately as scroll starts */}
      <div className="sr-label">
        <p className="section-label">The Manifesto</p>
        <p className="sr-label-sub">Engineered beyond the visible.</p>
      </div>

      {/* Long text ticker — scrolls horizontally driven by scroll position */}
      <div className="sr-text-bar">
        <div className="sr-text-track">{MANIFESTO}</div>
      </div>
    </section>
  );
}
