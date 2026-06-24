"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (typeof window === "undefined") return;

    gsap.set([dotRef.current, ringRef.current], { opacity: 0 });

    const onMove = (e: MouseEvent) => {
      gsap.to(dotRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.06,
        ease: "none",
        opacity: 1,
      });
      gsap.to(ringRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.38,
        ease: "power2.out",
        opacity: 1,
      });
    };

    const onLeave = () => {
      gsap.to([dotRef.current, ringRef.current], {
        opacity: 0,
        duration: 0.25,
      });
    };

    const onEnterInteractive = () => {
      gsap.to(ringRef.current, {
        scale: 1.9,
        borderColor: "rgba(255,77,0,0.9)",
        duration: 0.28,
        ease: "power2.out",
      });
      gsap.to(dotRef.current, {
        scale: 0,
        duration: 0.2,
      });
    };

    const onLeaveInteractive = () => {
      gsap.to(ringRef.current, {
        scale: 1,
        borderColor: "rgba(255,77,0,0.45)",
        duration: 0.28,
        ease: "power2.out",
      });
      gsap.to(dotRef.current, {
        scale: 1,
        duration: 0.2,
      });
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    const addListeners = () => {
      document
        .querySelectorAll("a, button, input, [data-hover]")
        .forEach((el) => {
          el.addEventListener("mouseenter", onEnterInteractive);
          el.addEventListener("mouseleave", onLeaveInteractive);
        });
    };

    addListeners();

    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      observer.disconnect();
    };
  });

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
