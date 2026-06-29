"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

export default function SunglassesScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLDivElement>(null);
  const modelRef   = useRef<THREE.Group | null>(null);

  // GSAP writes here; Three.js render loop reads every frame
  const state = useRef({ rotX: 0.05, rotY: -0.2, rotZ: 0.08, posX: 3.8, posY: 0 });

  // ── Three.js ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 0.35, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace    = THREE.SRGBColorSpace;
    renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 2.8;
    container.appendChild(renderer.domElement);

    // Lighting ─────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 3.5));

    const front = new THREE.DirectionalLight(0xffffff, 6);
    front.position.set(0, 2, 10);
    scene.add(front);

    const keyR = new THREE.DirectionalLight(0xffffff, 5);
    keyR.position.set(6, 4, 6);
    scene.add(keyR);

    const keyL = new THREE.DirectionalLight(0xffffff, 4);
    keyL.position.set(-6, 1, 6);
    scene.add(keyL);

    const top = new THREE.DirectionalLight(0xffffff, 3);
    top.position.set(0, 10, 2);
    scene.add(top);

    const accent = new THREE.PointLight(0xff4d00, 12, 20);
    accent.position.set(3, -1, 6);
    scene.add(accent);

    const rim = new THREE.DirectionalLight(0x88aaff, 2.5);
    rim.position.set(-6, 3, -4);
    scene.add(rim);

    // Load GLB ─────────────────────────────────────────────────────────────────
    const loader = new GLTFLoader();
    loader.load(
      "/3D_GLB_OBJECTS/futuristic_sunglasses.glb",
      (gltf) => {
        const raw = gltf.scene;
        const box    = new THREE.Box3().setFromObject(raw);
        const centre = box.getCenter(new THREE.Vector3());
        const size   = box.getSize(new THREE.Vector3());
        raw.position.sub(centre);
        raw.scale.setScalar(2.0 / Math.max(size.x, size.y, size.z));

        const group = new THREE.Group();
        group.add(raw);
        scene.add(group);
        modelRef.current = group;
      },
      undefined,
      (err) => console.error("GLB load error:", err)
    );

    // Render loop — syncs GSAP state → Three.js every frame ───────────────────
    let raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const m = modelRef.current;
      if (m) {
        const s = state.current;
        m.rotation.x = s.rotX;
        m.rotation.y = s.rotY;
        m.rotation.z = s.rotZ;
        m.position.x = s.posX;
        m.position.y = s.posY;
      }
      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  // ── GSAP scroll ─────────────────────────────────────────────────────────────
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // ── Force initial states immediately on mount ─────────────────────────────
    // Right text: hidden before the animation reaches them
    gsap.set(".sg-right-label", { opacity: 0, y: 18 });
    gsap.set(".sg-right-line",  { yPercent: 110 });
    gsap.set(".sg-right-desc",  { opacity: 0, y: 18 });
    gsap.set(".sg-right-cta",   { opacity: 0, y: 12 });
    // Left intro text: visible (no set needed — natural state)

    const s = state.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start:   "top top",
        end:     () => `+=${window.innerHeight * 3.5}`,
        pin:     true,
        scrub:   1.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl
      // ── Left intro fades out at the very start of scroll ───────────────────
      .to(".sg-intro",
        { opacity: 0, y: -40, duration: 0.45, ease: "power2.in" },
        0
      )

      // ── Phase 1 (0 → 1): spin 360° + roll toward centre ───────────────────
      .to(s, {
        rotX: -0.04,
        rotY: Math.PI * 2,
        rotZ:  0.28,
        posX:  0.25,
        posY:  0.06,
        duration: 1,
        ease: "none",
      }, 0)

      // ── Phase 2 (1 → 2): sweep to left, level out ─────────────────────────
      .to(s, {
        rotX:  0,
        rotY:  Math.PI * 2.15,
        rotZ:  0,
        posX: -2.4,
        posY:  0,
        duration: 1,
        ease: "power3.inOut",
      }, 1)

      // ── Right text reveals as glasses settle on left ───────────────────────
      .to(".sg-right-label",
        { opacity: 1, y: 0, clearProps: "transform", duration: 0.4 },
        1.3
      )
      .to(".sg-right-line",
        { yPercent: 0, clearProps: "transform", stagger: 0.1, duration: 0.7, ease: "power4.out" },
        1.4
      )
      .to(".sg-right-desc",
        { opacity: 1, y: 0, clearProps: "transform", duration: 0.5 },
        1.88
      )
      .to(".sg-right-cta",
        { opacity: 1, y: 0, clearProps: "transform", duration: 0.4 },
        2.08
      );

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ background: "#080808" }}
    >
      {/* Three.js canvas — behind everything */}
      <div ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Orange glow that follows where the glasses will land */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 65% at 26% 52%, rgba(255,77,0,0.07) 0%, transparent 68%)",
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,77,0,0.02) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,77,0,0.02) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
        }}
      />

      {/* ── Two-column overlay ────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-10 pointer-events-none grid grid-cols-2">

        {/* LEFT — initial state text */}
        <div className="sg-intro flex flex-col justify-center px-16 pl-20 gap-6">
          <p className="font-space text-[9px] font-semibold tracking-[0.5em] uppercase text-orange flex items-center gap-3">
            <span className="block w-8 h-px bg-orange flex-shrink-0" />
            Vision Eyewear
          </p>

          <h2 className="font-space text-[clamp(42px,5vw,76px)] font-bold tracking-[-0.04em] text-text leading-[0.88]">
            See<br />beyond<br />ordinary.
          </h2>

          <p className="font-inter text-sm font-light text-muted leading-[1.85] max-w-[280px]">
            Scroll to discover the frame that redefines what eyewear can be.
          </p>

          <div className="flex items-center gap-3 mt-2">
            <span className="block w-2 h-2 rounded-full bg-orange animate-pulse flex-shrink-0" />
            <span className="font-space text-[9px] font-semibold tracking-[0.4em] uppercase text-[rgba(255,77,0,0.6)]">
              Scroll to rotate
            </span>
          </div>
        </div>

        {/* RIGHT — reveals after glasses settle on the left */}
        <div className="flex flex-col justify-center px-14 pr-20">
          {/* All right-side elements start invisible (GSAP reveals them) */}
          <p
            className="sg-right-label font-space text-[9px] font-semibold tracking-[0.5em] uppercase text-orange mb-7"
            style={{ opacity: 0, transform: "translateY(18px)" }}
          >
            Collection SS/25
          </p>

          <h2 className="font-space text-[clamp(36px,4.4vw,66px)] font-bold tracking-[-0.04em] text-text leading-[0.9] mb-9">
            {["Engineered", "beyond", "the visible."].map((line, i) => (
              <span key={i} className="overflow-hidden block">
                <span
                  className="sg-right-line block"
                  style={{ transform: "translateY(110%)" }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h2>

          <p
            className="sg-right-desc font-inter text-sm font-light text-muted leading-[1.85] max-w-[290px] mb-10"
            style={{ opacity: 0, transform: "translateY(18px)" }}
          >
            Precision-crafted frames that merge aerospace-grade materials with
            an unmistakable aesthetic — built for those who see further.
          </p>

          <Link
            href="/shop"
            className="sg-right-cta pointer-events-auto inline-flex items-center gap-4 self-start font-space text-xs font-bold tracking-[0.28em] uppercase text-black bg-orange px-12 py-5 cursor-none transition-colors duration-300 hover:bg-text"
            style={{ opacity: 0, transform: "translateY(12px)" }}
          >
            Explore frames
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 7h12M8 2l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* HUD corners */}
      <p className="absolute top-8 left-8 z-10 font-space text-[8px] font-semibold tracking-[0.45em] uppercase text-[rgba(255,77,0,0.35)] pointer-events-none">
        3D RENDER — SCROLL TO ROTATE
      </p>
      <p className="absolute bottom-8 right-8 z-10 font-space text-[8px] font-semibold tracking-[0.4em] uppercase text-[rgba(255,77,0,0.18)] pointer-events-none">
        FUTURISTIC SGL — 001
      </p>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,77,0,0.3)] to-transparent z-10" />
    </section>
  );
}
