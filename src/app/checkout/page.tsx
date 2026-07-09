"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useCart } from "@/store/cart";
import Navbar from "@/components/Navbar";

// ── Stripe setup ────────────────────────────────────────────────────────────
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "pk_test_placeholder"
);

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// ── Stripe element appearance ────────────────────────────────────────────────
const STRIPE_STYLE = {
  base: {
    color: "#f0f0f0",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "14px",
    fontWeight: "400",
    letterSpacing: "0.02em",
    "::placeholder": { color: "#555555" },
  },
  invalid: { color: "#ff4d00" },
};

// ── Success screen ───────────────────────────────────────────────────────────
function SuccessScreen({ orderNumber }: { orderNumber: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(".ck-success-line", { yPercent: 110, duration: 1.1, stagger: 0.1, ease: "power4.out", delay: 0.1 });
    gsap.from(".ck-success-body", { opacity: 0, y: 18, duration: 0.8, ease: "power3.out", delay: 0.6 });
  }, { scope: ref });

  return (
    <div ref={ref} className="min-h-screen bg-black flex items-center justify-center pt-[72px] px-8">
      <div className="text-center max-w-[520px]">
        <div className="w-14 h-14 rounded-full border border-orange flex items-center justify-center mx-auto mb-10">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 11l5 5 9-9" stroke="#ff4d00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="overflow-hidden mb-1">
          <h1 className="ck-success-line font-space text-[clamp(52px,8vw,96px)] font-bold tracking-[-0.05em] text-text leading-[0.88]">
            Order
          </h1>
        </div>
        <div className="overflow-hidden mb-8">
          <h1 className="ck-success-line font-space text-[clamp(52px,8vw,96px)] font-bold tracking-[-0.05em] text-orange leading-[0.88]">
            Confirmed.
          </h1>
        </div>
        <div className="ck-success-body flex flex-col gap-4">
          <p className="font-inter text-[15px] font-light text-muted leading-[1.75]">
            Your order <span className="text-text font-semibold">#{orderNumber}</span> has been placed.
            You'll receive a confirmation email shortly, and we'll notify you when it ships.
          </p>
          <p className="font-space text-[9px] font-semibold tracking-[0.4em] uppercase text-orange">
            Thank you for choosing VISION
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Link href="/shop" className="inline-flex items-center gap-3 bg-orange text-[#0d0d0d] px-8 py-[15px] font-space text-[10px] font-bold tracking-[0.28em] uppercase cursor-none">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Inner form (needs Stripe context) ───────────────────────────────────────
function CheckoutForm() {
  const stripe   = useStripe();
  const elements = useElements();
  const router   = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const formRef  = useRef<HTMLFormElement>(null);

  const [step, setStep]           = useState<"form" | "success">("form");
  const [orderNumber, setOrderNum] = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const [fields, setFields] = useState({
    name:        "",
    email:       "",
    phone:       "",
    address:     "",
    city:        "",
    country:     "MA",
    postal_code: "",
  });

  const subtotal = totalPrice();
  const shipping = subtotal >= 300 ? 0 : 30;
  const total    = subtotal + shipping;

  const set = (k: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFields((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || items.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Create payment intent from Laravel backend
      const intentRes = await fetch(`${API_BASE}/checkout/intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      if (!intentRes.ok) throw new Error("Could not initialize payment. Please try again.");
      const { client_secret: clientSecret, payment_intent_id: paymentIntentId } = await intentRes.json();

      // 2. Confirm card payment with Stripe
      const cardEl = elements.getElement(CardNumberElement);
      if (!cardEl) throw new Error("Card element missing");

      const { error: stripeErr } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardEl,
          billing_details: { name: fields.name, email: fields.email, phone: fields.phone },
        },
      });

      if (stripeErr) throw new Error(stripeErr.message ?? "Payment failed");

      // 3. Create order in Laravel backend
      const orderRes = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...fields,
          address: { line1: fields.address, city: fields.city, country: fields.country, postal_code: fields.postal_code },
          payment_intent_id: paymentIntentId,
          items: items.map((i) => ({
            product_id:   i.product.id,
            name:         i.product.name,
            sku:          i.product.slug,
            price:        i.product.price,
            quantity:     i.quantity,
            color:        i.color.name,
            size:         i.size.label,
            image:        i.product.coverImage,
          })),
        }),
      });

      if (!orderRes.ok) throw new Error("Could not place order. Please contact support.");
      const { order_number } = await orderRes.json();

      clearCart();
      setOrderNum(order_number);
      setStep("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") return <SuccessScreen orderNumber={orderNumber} />;

  const inputCls =
    "w-full bg-surface border border-border px-4 py-[13px] font-inter text-[13px] text-text placeholder:text-muted focus:outline-none focus:border-orange transition-colors duration-200";
  const labelCls =
    "block font-space text-[9px] font-semibold tracking-[0.35em] uppercase text-muted mb-2";
  const stripeWrapCls =
    "w-full bg-surface border border-border px-4 py-[14px] focus-within:border-orange transition-colors duration-200";

  return (
    <div className="min-h-screen bg-black pt-[72px]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-14 lg:py-20">

        {/* Page title */}
        <div className="mb-12 border-b border-border pb-8">
          <p className="font-space text-[9px] font-semibold tracking-[0.45em] uppercase text-orange mb-3 flex items-center gap-3">
            <span className="block w-6 h-px bg-orange" />
            Secure Checkout
          </p>
          <h1 className="font-space text-[clamp(36px,5vw,68px)] font-bold tracking-[-0.04em] text-text leading-[0.92]">
            Complete Your Order
          </h1>
        </div>

        {/* Empty cart guard */}
        {items.length === 0 && (
          <div className="text-center py-20">
            <p className="font-space text-[12px] font-semibold tracking-[0.35em] uppercase text-muted mb-6">
              Your cart is empty
            </p>
            <Link href="/shop" className="bg-orange text-[#0d0d0d] px-8 py-[14px] font-space text-[10px] font-bold tracking-[0.28em] uppercase cursor-none">
              Shop Now
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-start">

            {/* ── LEFT: form ──────────────────────────────────────────── */}
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-10">

              {/* Contact */}
              <fieldset className="border border-border p-6 lg:p-8">
                <legend className="font-space text-[10px] font-bold tracking-[0.32em] uppercase text-text px-2 mb-0">
                  Contact Information
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div>
                    <label className={labelCls}>Full Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Adam El Mekadem"
                      value={fields.name}
                      onChange={set("name")}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input
                      required
                      type="email"
                      placeholder="you@example.com"
                      value={fields.email}
                      onChange={set("email")}
                      className={inputCls}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Phone (optional)</label>
                    <input
                      type="tel"
                      placeholder="+212 6 00 00 00 00"
                      value={fields.phone}
                      onChange={set("phone")}
                      className={inputCls}
                    />
                  </div>
                </div>
              </fieldset>

              {/* Shipping */}
              <fieldset className="border border-border p-6 lg:p-8">
                <legend className="font-space text-[10px] font-bold tracking-[0.32em] uppercase text-text px-2 mb-0">
                  Shipping Address
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Street Address</label>
                    <input
                      required
                      type="text"
                      placeholder="123 Rue Mohammed V"
                      value={fields.address}
                      onChange={set("address")}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>City</label>
                    <input
                      required
                      type="text"
                      placeholder="Casablanca"
                      value={fields.city}
                      onChange={set("city")}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Postal Code</label>
                    <input
                      type="text"
                      placeholder="20000"
                      value={fields.postal_code}
                      onChange={set("postal_code")}
                      className={inputCls}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Country</label>
                    <select value={fields.country} onChange={set("country")} className={inputCls + " cursor-none"}>
                      <option value="MA">Morocco</option>
                      <option value="FR">France</option>
                      <option value="DE">Germany</option>
                      <option value="AE">UAE</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </fieldset>

              {/* Payment */}
              <fieldset className="border border-border p-6 lg:p-8">
                <legend className="font-space text-[10px] font-bold tracking-[0.32em] uppercase text-text px-2 mb-0">
                  Payment
                </legend>
                <div className="flex items-center gap-2 mt-6 mb-5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="#555" strokeWidth="1.1" />
                    <path d="M1 6h12" stroke="#555" strokeWidth="1.1" />
                  </svg>
                  <span className="font-space text-[9px] font-semibold tracking-[0.32em] uppercase text-muted">
                    Secured by Stripe
                  </span>
                  <span className="ml-auto font-space text-[9px] font-semibold tracking-[0.2em] uppercase text-[rgba(255,77,0,0.5)]">
                    Test: 4242 4242 4242 4242
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className={labelCls}>Card Number</label>
                    <div className={stripeWrapCls}>
                      <CardNumberElement options={{ style: STRIPE_STYLE, showIcon: true }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Expiry Date</label>
                      <div className={stripeWrapCls}>
                        <CardExpiryElement options={{ style: STRIPE_STYLE }} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>CVC</label>
                      <div className={stripeWrapCls}>
                        <CardCvcElement options={{ style: STRIPE_STYLE }} />
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Error */}
              {error && (
                <div className="border border-[rgba(255,77,0,0.4)] bg-[rgba(255,77,0,0.06)] px-5 py-4">
                  <p className="font-inter text-[13px] text-orange leading-[1.6]">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !stripe}
                className="relative group overflow-hidden bg-orange text-[#0d0d0d] px-10 py-[18px] font-space text-[11px] font-bold tracking-[0.28em] uppercase cursor-none flex items-center gap-3 self-start disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {loading ? (
                  <>
                    <span className="block w-4 h-4 rounded-full border-2 border-[#0d0d0d] border-t-transparent animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    Place Order — {total.toFixed(2)} MAD
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* ── RIGHT: order summary ─────────────────────────────────── */}
            <aside className="lg:sticky lg:top-24 flex flex-col gap-0 border border-border">
              <div className="px-6 py-5 border-b border-border">
                <p className="font-space text-[10px] font-bold tracking-[0.32em] uppercase text-text">
                  Order Summary
                </p>
              </div>

              {/* Items */}
              <div className="flex flex-col divide-y divide-border">
                {items.map((item) => (
                  <div key={item.key} className="flex items-center gap-4 px-6 py-4">
                    <div className="relative w-14 h-14 bg-surface flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.product.coverImage}
                        alt={item.product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange text-[#0d0d0d] rounded-full flex items-center justify-center font-space text-[9px] font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-space text-[12px] font-semibold text-text truncate">
                        {item.product.name}
                      </p>
                      <p className="font-space text-[9px] font-semibold tracking-[0.28em] uppercase text-muted mt-0.5">
                        {item.color.name} · {item.size.label}
                      </p>
                    </div>
                    <span className="font-space text-[13px] font-bold text-text flex-shrink-0">
                      {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="px-6 py-5 border-t border-border flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-inter text-[13px] text-muted">Subtotal</span>
                  <span className="font-space text-[13px] font-semibold text-text">{subtotal.toFixed(2)} MAD</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-inter text-[13px] text-muted">Shipping</span>
                  <span className="font-space text-[13px] font-semibold text-text">
                    {shipping === 0 ? (
                      <span className="text-orange">Free</span>
                    ) : (
                      `${shipping.toFixed(2)} MAD`
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="font-space text-[9px] tracking-[0.25em] uppercase text-muted">
                    Free shipping on orders over 300 MAD
                  </p>
                )}
              </div>
              <div className="px-6 py-5 border-t border-border flex items-center justify-between bg-surface">
                <span className="font-space text-[11px] font-bold tracking-[0.12em] uppercase text-text">Total</span>
                <span className="font-space text-[20px] font-bold tracking-[-0.03em] text-text">{total.toFixed(2)} MAD</span>
              </div>

              {/* Trust badges */}
              <div className="px-6 py-5 border-t border-border flex flex-col gap-3">
                {[
                  { icon: "🔒", label: "SSL encrypted checkout" },
                  { icon: "↩", label: "14-day returns" },
                  { icon: "📦", label: "Ships within 2–4 days" },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-3">
                    <span className="text-[13px]">{b.icon}</span>
                    <span className="font-space text-[9px] font-semibold tracking-[0.28em] uppercase text-muted">{b.label}</span>
                  </div>
                ))}
              </div>
            </aside>

          </div>
        )}
      </div>
    </div>
  );
}

// ── Page wrapper (provides Stripe context) ──────────────────────────────────
export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </>
  );
}
