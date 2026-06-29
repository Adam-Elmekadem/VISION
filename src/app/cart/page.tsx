"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCart, type CartItem } from "@/store/cart";
import Navbar from "@/components/Navbar";

const FREE_SHIP = 300;

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyCart() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".ce-label", { opacity: 0, y: 14, duration: 0.6, ease: "power3.out", delay: 0.4 });
    gsap.from(".ce-line", { y: "105%", duration: 1.0, ease: "power4.out", stagger: 0.12, delay: 0.5 });
    gsap.from(".ce-sub",  { opacity: 0, y: 16, duration: 0.7, ease: "power3.out", delay: 1.0 });
    gsap.from(".ce-btns", { opacity: 0, y: 16, duration: 0.7, ease: "power3.out", delay: 1.15 });
  }, { scope: ref });

  return (
    <div
      ref={ref}
      className="relative min-h-screen pt-[72px] bg-black overflow-hidden flex items-center justify-center"
    >
      {/* Concentric rings — individually centered */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[64vmin] h-[64vmin] rounded-full border border-[rgba(255,77,0,0.08)] pointer-events-none animate-ring-pulse"
      />
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44vmin] h-[44vmin] rounded-full border border-[rgba(255,77,0,0.07)] pointer-events-none [animation:ring-pulse_5s_ease-in-out_infinite_0.7s]"
      />
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[26vmin] h-[26vmin] rounded-full border border-dashed border-[rgba(255,77,0,0.1)] pointer-events-none animate-ring-spin"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-5 px-6">
        <p className="ce-label font-space text-[10px] font-semibold tracking-[0.42em] uppercase text-orange">
          Your Selection
        </p>

        <h1 className="font-space text-[clamp(60px,9.5vw,128px)] font-bold tracking-[-0.04em] text-text leading-[0.92] flex flex-col">
          <span className="overflow-hidden block">
            <span className="ce-line block">Nothing</span>
          </span>
          <span className="overflow-hidden block">
            <span className="ce-line block">here yet.</span>
          </span>
        </h1>

        <p className="ce-sub font-inter text-sm font-light text-muted leading-[1.85] max-w-[300px]">
          Your cart is empty. Explore the collection<br />and find your perfect frame.
        </p>

        <div className="ce-btns flex items-center gap-3 mt-3 flex-wrap justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-4 bg-orange text-black font-space text-xs font-bold tracking-[0.25em] uppercase no-underline py-5 px-14 cursor-none transition-colors duration-300 hover:bg-text"
          >
            Shop all frames
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link
            href="/collections"
            className="inline-flex items-center gap-3 border border-border text-muted font-space text-xs font-semibold tracking-[0.2em] uppercase no-underline py-5 px-10 cursor-none transition-colors duration-300 hover:border-orange hover:text-orange"
          >
            Browse collections
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Cart item card ───────────────────────────────────────────────────────────
function CartItemCard({
  item, onFocus, onBlur, onRemove, onQty,
}: {
  item: CartItem;
  onFocus: () => void;
  onBlur: () => void;
  onRemove: () => void;
  onQty: (q: number) => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -60, transition: { duration: 0.28, ease: "easeIn" } }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="grid grid-cols-[110px_1fr] gap-5 py-[26px] border-b border-border last:border-b-0 cursor-none"
      onMouseEnter={onFocus}
      onMouseLeave={onBlur}
    >
      {/* Thumbnail */}
      <div className="relative w-[110px] aspect-square overflow-hidden bg-surface shrink-0">
        <Image
          src={item.color.frameImage || item.product.coverImage}
          alt={item.product.name}
          fill
          sizes="110px"
          className="object-cover brightness-[0.86] saturate-80 transition-[filter] duration-300"
        />
        <span
          className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 rounded-full border border-white/20 z-[2]"
          style={{ background: item.color.hex }}
          title={item.color.name}
        />
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <div className="flex items-start justify-between gap-2.5">
          <div>
            <span className="block font-space text-[9px] font-semibold tracking-[0.32em] uppercase text-orange mb-[3px]">
              {item.product.collection}
            </span>
            <h3 className="font-space text-[17px] font-bold tracking-[-0.01em] text-text leading-[1.1]">
              {item.product.name}
            </h3>
          </div>
          <button
            className="border border-transparent w-7 h-7 flex items-center justify-center text-muted cursor-none shrink-0 transition-colors duration-200 hover:text-orange hover:border-[rgba(255,77,0,0.3)]"
            onClick={onRemove}
            aria-label={`Remove ${item.product.name}`}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className="font-inter text-[11px] font-light text-muted flex items-center gap-2.5 flex-wrap">
          <span>{item.color.name}</span>
          <span aria-hidden className="inline-block w-px h-[9px] bg-border-bright shrink-0" />
          <span>Size {item.size.label}</span>
          <span aria-hidden className="inline-block w-px h-[9px] bg-border-bright shrink-0" />
          <span className="capitalize">{item.product.material.replace(/-/g, " ")}</span>
        </p>

        <div className="flex items-center justify-between mt-auto pt-2.5">
          {/* Qty control */}
          <div className="flex items-center border border-border" role="group" aria-label="Quantity">
            <button
              className="w-[30px] h-7 bg-transparent border-none text-muted cursor-none text-[15px] font-light font-space flex items-center justify-center leading-none transition-colors duration-[180ms] hover:text-text hover:bg-surface"
              onClick={() => onQty(item.quantity - 1)}
              aria-label="Decrease"
            >−</button>
            <span className="min-w-8 text-center font-space text-xs font-semibold tracking-[0.1em] text-text leading-7 border-x border-border px-0.5">
              {String(item.quantity).padStart(2, "0")}
            </span>
            <button
              className="w-[30px] h-7 bg-transparent border-none text-muted cursor-none text-[15px] font-light font-space flex items-center justify-center leading-none transition-colors duration-[180ms] hover:text-text hover:bg-surface"
              onClick={() => onQty(item.quantity + 1)}
              aria-label="Increase"
            >+</button>
          </div>
          <span className="font-space text-[15px] font-semibold text-text tracking-[0.02em]">
            ${(item.product.price * item.quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CartPage() {
  const items      = useCart((s) => s.items);
  const removeItem = useCart((s) => s.removeItem);
  const updateQty  = useCart((s) => s.updateQuantity);
  const clearCart  = useCart((s) => s.clearCart);
  const subtotal   = useCart((s) => s.totalPrice());
  const totalItems = useCart((s) => s.totalItems());

  const [hovered, setHovered] = useState<string | null>(null);
  const preview = items.find((i) => i.key === hovered) ?? items[0] ?? null;

  const shipping   = subtotal >= FREE_SHIP ? 0 : 25;
  const grandTotal = subtotal + shipping;
  const shipPct    = Math.min((subtotal / FREE_SHIP) * 100, 100);
  const remaining  = Math.max(FREE_SHIP - subtotal, 0);

  const TICKER = `VISION — YOUR SELECTION — ${totalItems} ${totalItems === 1 ? "ITEM" : "ITEMS"} — $${grandTotal.toLocaleString()} TOTAL — FREE SHIPPING OVER $${FREE_SHIP} — SECURE CHECKOUT — PREMIUM PACKAGING — 30-DAY RETURNS — `;

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <EmptyCart />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-[72px] min-h-screen bg-black">

        {/* Ticker */}
        <div className="h-[38px] overflow-hidden bg-surface border-b border-border flex items-center" aria-hidden>
          <div className="flex whitespace-nowrap animate-cart-ticker will-change-transform">
            <span className="font-space text-[9px] font-semibold tracking-[0.38em] uppercase text-[rgba(240,240,240,0.3)] shrink-0">{TICKER}</span>
            <span className="font-space text-[9px] font-semibold tracking-[0.38em] uppercase text-[rgba(240,240,240,0.3)] shrink-0">{TICKER}</span>
          </div>
        </div>

        {/* 55 / 45 split */}
        <div className="grid grid-cols-[55fr_45fr] items-start min-h-[calc(100vh-72px-38px)]">

          {/* ── Left: sticky preview ─────────────────────── */}
          <aside
            className="sticky top-[72px] h-[calc(100vh-72px)] bg-surface border-r border-border overflow-hidden"
            aria-hidden
          >
            <AnimatePresence mode="wait">
              {preview && (
                <motion.div
                  key={preview.key}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src={preview.color.frameImage || preview.product.coverImage}
                    alt={preview.product.name}
                    fill
                    sizes="55vw"
                    className="object-cover brightness-[0.72] saturate-80"
                    priority
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scan line */}
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[rgba(255,77,0,0.3)] to-transparent z-[3] pointer-events-none animate-scan" />

            {/* Grid overlay */}
            <div
              className="absolute inset-0 z-[1] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,77,0,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.035) 1px, transparent 1px)",
                backgroundSize: "52px 52px",
              }}
            />

            {/* Gradient */}
            <div className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-t from-[rgba(8,8,8,0.97)] via-[rgba(8,8,8,0.25)] to-transparent" />

            {/* HUD */}
            <p className="absolute top-6 left-7 z-[6] font-space text-[9px] font-semibold tracking-[0.35em] uppercase text-[rgba(255,77,0,0.5)] pointer-events-none">
              {String(totalItems).padStart(2, "0")} ITEMS SELECTED
            </p>

            {/* Watermark */}
            <p
              aria-hidden
              className="absolute right-[-52px] top-1/2 -translate-y-1/2 rotate-90 font-space text-[10px] font-bold tracking-[0.6em] uppercase text-[rgba(255,77,0,0.05)] z-[4] pointer-events-none whitespace-nowrap"
            >
              SELECTION
            </p>

            {/* Info overlay */}
            <AnimatePresence mode="wait">
              {preview && (
                <motion.div
                  key={preview.key + "-i"}
                  className="absolute bottom-0 left-0 right-0 p-10 pb-9 z-[6]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.18 } }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <p className="font-space text-[9px] font-semibold tracking-[0.4em] text-orange uppercase mb-2.5 flex items-center gap-2.5 before:content-[''] before:block before:w-3.5 before:h-px before:bg-orange before:shrink-0">
                    {preview.product.collection}
                  </p>
                  <h2 className="font-space text-[clamp(32px,4vw,58px)] font-bold tracking-[-0.03em] text-text leading-[0.95] mb-3.5">
                    {preview.product.name}
                  </h2>
                  <p className="font-inter text-xs font-light text-[rgba(240,240,240,0.4)] flex items-center gap-3">
                    <span>${preview.product.price}</span>
                    <span aria-hidden className="inline-block w-px h-[9px] bg-border-bright shrink-0" />
                    <span>{preview.color.name}</span>
                    <span aria-hidden className="inline-block w-px h-[9px] bg-border-bright shrink-0" />
                    <span>Size {preview.size.label}</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>

          {/* ── Right: cart panel ────────────────────────── */}
          <section className="bg-black min-h-[calc(100vh-72px-38px)] flex flex-col">

            {/* Header */}
            <div className="px-11 pt-11 pb-6 border-b border-border flex items-end justify-between gap-4">
              <div>
                <p className="font-space text-[9px] font-semibold tracking-[0.42em] uppercase text-orange mb-2">
                  Your Selection
                </p>
                <h1 className="font-space text-[clamp(44px,5.5vw,76px)] font-bold tracking-[-0.04em] text-text leading-[0.9]">
                  Cart
                </h1>
              </div>
              <div className="flex flex-col items-end gap-2 pb-1.5 shrink-0">
                <span className="font-space text-[10px] font-medium tracking-[0.28em] uppercase text-muted">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
                <button
                  className="bg-transparent border-none font-space text-[9px] font-semibold tracking-[0.22em] uppercase text-muted cursor-none p-0 transition-colors duration-200 hover:text-orange"
                  onClick={clearCart}
                >
                  Clear all
                </button>
              </div>
            </div>

            {/* Shipping bar */}
            <div className="px-11 py-4 border-b border-border bg-surface">
              <div className="h-px bg-[rgba(255,77,0,0.12)] mb-2.5 relative overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-orange"
                  animate={{ width: `${shipPct}%` }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />
              </div>
              <p className="font-inter text-[11px] font-light text-muted">
                {remaining > 0 ? (
                  <><strong className="text-text font-semibold">${remaining}</strong> away from free shipping</>
                ) : (
                  <span className="text-orange font-semibold font-space tracking-[0.04em]">✓ Free shipping unlocked</span>
                )}
              </p>
            </div>

            {/* Items */}
            <div className="flex-1 px-11">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItemCard
                    key={item.key}
                    item={item}
                    onFocus={() => setHovered(item.key)}
                    onBlur={() => setHovered(null)}
                    onRemove={() => removeItem(item.key)}
                    onQty={(q) => updateQty(item.key, q)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Order summary */}
            <div className="px-11 pt-7 pb-11 border-t border-border bg-surface">
              <div className="flex items-center justify-between py-2.5 border-b border-border">
                <span className="font-inter text-xs font-light text-muted tracking-[0.05em]">Subtotal</span>
                <span className="font-space text-xs font-medium text-text tracking-[0.06em]">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-2.5 border-b border-border">
                <span className="font-inter text-xs font-light text-muted tracking-[0.05em]">Shipping</span>
                <span
                  className="font-space text-xs font-medium tracking-[0.06em]"
                  style={{ color: shipping === 0 ? "var(--orange)" : "var(--text)" }}
                >
                  {shipping === 0 ? "Free" : `$${shipping}`}
                </span>
              </div>

              <div className="flex items-center justify-between py-[22px]">
                <span className="font-space text-[10px] font-semibold tracking-[0.38em] uppercase text-muted">Total</span>
                <motion.span
                  key={grandTotal}
                  className="font-space text-[36px] font-bold tracking-[-0.03em] text-text leading-none inline-block"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28 }}
                >
                  ${grandTotal.toLocaleString()}
                </motion.span>
              </div>

              <button
                className="w-full bg-orange border-none text-black font-space text-[10px] font-bold tracking-[0.32em] uppercase py-5 px-6 cursor-none flex items-center justify-center gap-4 transition-colors duration-300 hover:bg-text"
                type="button"
              >
                Proceed to checkout
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M1 7.5h13M8.5 2l5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <Link
                href="/shop"
                className="block text-center font-space text-[9px] font-semibold tracking-[0.22em] uppercase text-muted no-underline mt-[18px] transition-colors duration-200 hover:text-text"
              >
                ← Continue shopping
              </Link>
            </div>

          </section>
        </div>
      </main>
    </>
  );
}
