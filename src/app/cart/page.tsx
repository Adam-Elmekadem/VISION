"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useCart, type CartItem } from "@/store/cart";
import Navbar from "@/components/Navbar";

const FREE_SHIPPING_AT = 300;

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <div className="cart-empty">
      <div className="cart-empty-rings" aria-hidden>
        <div className="cart-empty-ring cart-empty-ring-1" />
        <div className="cart-empty-ring cart-empty-ring-2" />
        <div className="cart-empty-ring cart-empty-ring-3" />
      </div>
      <div className="cart-empty-content">
        <p className="section-label">Your Selection</p>
        <h1 className="cart-empty-title">
          Nothing<br />here yet.
        </h1>
        <p className="cart-empty-sub">
          Your cart is empty. Explore the collection and find your frame.
        </p>
        <Link href="/shop" className="cart-empty-cta">
          Shop all frames
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.3"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <Link href="/collections" className="cart-empty-link">
          Browse Collections →
        </Link>
      </div>
    </div>
  );
}

// ─── Cart item row ────────────────────────────────────────────────────────────
function CartItemCard({
  item,
  onFocus,
  onBlur,
  onRemove,
  onQty,
}: {
  item: CartItem;
  onFocus: () => void;
  onBlur: () => void;
  onRemove: () => void;
  onQty: (q: number) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -48, transition: { duration: 0.28 } }}
      transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
      className="cart-item"
      onMouseEnter={onFocus}
      onMouseLeave={onBlur}
    >
      {/* Thumbnail */}
      <div className="cart-item-thumb">
        <Image
          src={item.color.frameImage || item.product.coverImage}
          alt={item.product.name}
          fill
          sizes="108px"
          className="object-cover"
        />
        <span
          className="cart-item-color-dot"
          style={{ background: item.color.hex }}
          title={item.color.name}
        />
      </div>

      {/* Info */}
      <div className="cart-item-body">
        <div className="cart-item-top">
          <div>
            <span className="cart-item-collection">{item.product.collection}</span>
            <h3 className="cart-item-name">{item.product.name}</h3>
          </div>
          <button className="cart-item-remove" onClick={onRemove} aria-label={`Remove ${item.product.name}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="cart-item-meta">
          <span>{item.color.name}</span>
          <span className="cart-item-sep" aria-hidden />
          <span>Size {item.size.label}</span>
          <span className="cart-item-sep" aria-hidden />
          <span style={{ textTransform: "capitalize" }}>{item.product.material.replace("-", " ")}</span>
        </div>

        <div className="cart-item-footer">
          <div className="cart-qty" role="group" aria-label="Quantity">
            <button className="cart-qty-btn" onClick={() => onQty(item.quantity - 1)} aria-label="Decrease">
              −
            </button>
            <span className="cart-qty-num">{String(item.quantity).padStart(2, "0")}</span>
            <button className="cart-qty-btn" onClick={() => onQty(item.quantity + 1)} aria-label="Increase">
              +
            </button>
          </div>
          <span className="cart-item-price">
            ${(item.product.price * item.quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
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

  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const preview = items.find((i) => i.key === focusedKey) ?? items[0] ?? null;

  const shipping     = subtotal >= FREE_SHIPPING_AT ? 0 : 25;
  const grandTotal   = subtotal + shipping;
  const shippingPct  = Math.min((subtotal / FREE_SHIPPING_AT) * 100, 100);
  const remaining    = Math.max(FREE_SHIPPING_AT - subtotal, 0);

  const tickerText =
    `VISION — YOUR SELECTION — ${totalItems} ${totalItems === 1 ? "ITEM" : "ITEMS"} ` +
    `— $${grandTotal.toLocaleString()} TOTAL — FREE SHIPPING OVER $${FREE_SHIPPING_AT} ` +
    `— SECURE CHECKOUT — PREMIUM PACKAGING — 30-DAY RETURNS — `;

  if (items.length === 0) return (
    <>
      <Navbar />
      <EmptyCart />
    </>
  );

  return (
    <>
      <Navbar />
      <main className="cart-page">

        {/* ── Ticker ──────────────────────────────────────────────── */}
        <div className="cart-ticker" aria-hidden>
          <div className="cart-ticker-track">
            <span className="cart-ticker-text">{tickerText}</span>
            <span className="cart-ticker-text">{tickerText}</span>
          </div>
        </div>

        <div className="cart-layout">

          {/* ── Left: Preview ──────────────────────────────────── */}
          <aside className="cart-preview" aria-hidden>
            {/* Image crossfade */}
            <AnimatePresence mode="wait">
              {preview && (
                <motion.div
                  key={preview.key}
                  className="cart-preview-img"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.22 } }}
                  transition={{ duration: 0.45 }}
                >
                  <Image
                    src={preview.color.frameImage || preview.product.coverImage}
                    alt={preview.product.name}
                    fill
                    sizes="55vw"
                    className="object-cover"
                    priority
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* CRT scan line */}
            <div className="cart-preview-scan" />

            {/* Grid overlay */}
            <div className="cart-preview-grid" />

            {/* Gradient */}
            <div className="cart-preview-gradient" />

            {/* Rotated watermark */}
            <div className="cart-preview-watermark" aria-hidden>SELECTION</div>

            {/* HUD top-left */}
            <div className="cart-preview-hud-tl">
              <span>{String(totalItems).padStart(2, "0")} ITEMS SELECTED</span>
            </div>

            {/* Product info */}
            <AnimatePresence mode="wait">
              {preview && (
                <motion.div
                  key={preview.key + "-info"}
                  className="cart-preview-info"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.38, delay: 0.12 }}
                >
                  <p className="cart-preview-collection">{preview.product.collection}</p>
                  <h2 className="cart-preview-name">{preview.product.name}</h2>
                  <div className="cart-preview-meta">
                    <span>${preview.product.price}</span>
                    <span className="cart-item-sep" aria-hidden />
                    <span>{preview.color.name}</span>
                    <span className="cart-item-sep" aria-hidden />
                    <span>Size {preview.size.label}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>

          {/* ── Right: Cart panel ──────────────────────────────── */}
          <section className="cart-panel">

            {/* Header */}
            <div className="cart-panel-head">
              <div>
                <p className="section-label">Your Selection</p>
                <h1 className="cart-panel-title">Cart</h1>
              </div>
              <div className="cart-panel-head-right">
                <span className="cart-panel-count">{totalItems} {totalItems === 1 ? "item" : "items"}</span>
                <button className="cart-clear-btn" onClick={clearCart}>Clear all</button>
              </div>
            </div>

            {/* Free shipping bar */}
            <div className="cart-ship-bar">
              <div className="cart-ship-track">
                <motion.div
                  className="cart-ship-fill"
                  animate={{ width: `${shippingPct}%` }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />
              </div>
              <p className="cart-ship-label">
                {remaining > 0
                  ? <><strong>${remaining}</strong> away from free shipping</>
                  : <><span className="cart-ship-unlocked">✓ Free shipping unlocked</span></>}
              </p>
            </div>

            {/* Items */}
            <div className="cart-items-wrap">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItemCard
                    key={item.key}
                    item={item}
                    onFocus={() => setFocusedKey(item.key)}
                    onBlur={() => setFocusedKey(null)}
                    onRemove={() => removeItem(item.key)}
                    onQty={(q) => updateQty(item.key, q)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <div className="cart-summary-rows">
                <div className="cart-summary-row">
                  <span className="cart-sum-label">Subtotal</span>
                  <span className="cart-sum-val">${subtotal.toLocaleString()}</span>
                </div>
                <div className="cart-summary-row">
                  <span className="cart-sum-label">Shipping</span>
                  <span className="cart-sum-val" style={{ color: shipping === 0 ? "var(--orange)" : undefined }}>
                    {shipping === 0 ? "Free" : `$${shipping}`}
                  </span>
                </div>
              </div>

              <div className="cart-total-row">
                <span className="cart-total-label">Total</span>
                <motion.span
                  key={grandTotal}
                  className="cart-total-price"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ${grandTotal.toLocaleString()}
                </motion.span>
              </div>

              <button className="cart-checkout-btn" type="button">
                Proceed to checkout
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 8h14M9 2l6 6-6 6" stroke="currentColor" strokeWidth="1.4"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <Link href="/shop" className="cart-continue">← Continue shopping</Link>
            </div>

          </section>
        </div>
      </main>
    </>
  );
}
