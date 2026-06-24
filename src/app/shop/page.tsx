"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useSearch } from "@/hooks/useSearch";
import { products, type Product } from "@/lib/products";
import Navbar from "@/components/Navbar";

// ─── Filter config ────────────────────────────────────────────────────────────
const CATEGORIES  = ["all", "eyeglasses", "sunglasses"] as const;
const MATERIALS   = ["all", "titanium", "acetate", "stainless-steel", "carbon-fiber", "bio-nylon"] as const;
const SORT_OPTIONS = [
  { label: "Newest",       value: "new"   },
  { label: "Price: Low",   value: "asc"   },
  { label: "Price: High",  value: "desc"  },
  { label: "Bestsellers",  value: "best"  },
] as const;

type Category = typeof CATEGORIES[number];
type Material = typeof MATERIALS[number];
type Sort     = typeof SORT_OPTIONS[number]["value"];

// ─── Product card ─────────────────────────────────────────────────────────────
function ShopCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link href={`/product/${product.slug}`} className="shop-card" aria-label={product.name}>
        <div className="shop-card-img">
          <Image
            src={product.coverImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1400px) 33vw, 25vw"
            className="object-cover"
          />
          {/* Badges */}
          <div className="shop-card-badges">
            {product.isNew      && <span className="badge badge-new">New</span>}
            {product.isLimited  && <span className="badge badge-ltd">Limited</span>}
            {product.isBestseller && <span className="badge badge-best">Best</span>}
          </div>
          {/* Stock warning */}
          {product.stock <= 6 && (
            <span className="shop-card-stock">Only {product.stock} left</span>
          )}
        </div>
        <div className="shop-card-info">
          <div>
            <span className="shop-card-collection">{product.collection}</span>
            <h3 className="shop-card-name">{product.name}</h3>
          </div>
          <div className="shop-card-bottom">
            <span className="shop-card-price">${product.price}</span>
            <div className="shop-card-colors">
              {product.colors.slice(0, 3).map((c) => (
                <span
                  key={c.name}
                  className="color-dot"
                  style={{ background: c.hex }}
                  title={c.name}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="color-dot-more">+{product.colors.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ShopPage() {
  const [category, setCategory] = useState<Category>("all");
  const [material, setMaterial] = useState<Material>("all");
  const [sort, setSort]         = useState<Sort>("new");
  const { query, setQuery, results } = useSearch();

  const filtered = useMemo(() => {
    let list = query.trim() ? results : [...products];

    if (category !== "all") list = list.filter((p) => p.category === category);
    if (material !== "all") list = list.filter((p) => p.material === material);

    switch (sort) {
      case "asc":  list = [...list].sort((a, b) => a.price - b.price); break;
      case "desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "best": list = [...list].sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller)); break;
      case "new":  list = [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew)); break;
    }

    return list;
  }, [category, material, sort, results, query]);

  return (
    <>
      <Navbar />
      <div className="shop-page">

        {/* ── Page header ─────────────────────────────────────────── */}
        <div className="shop-header">
          <div className="section-wrap">
            <motion.p
              className="section-label"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              All Frames
            </motion.p>
            <div className="shop-header-inner">
              <motion.h1
                className="shop-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                Shop
              </motion.h1>
              <motion.span
                className="shop-count-tag"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {products.length} Frames Available
              </motion.span>
            </div>
          </div>
        </div>

        {/* ── Filter bar ──────────────────────────────────────────── */}
        <div className="shop-filterbar">
          <div className="section-wrap shop-filterbar-inner">

            {/* Search */}
            <div className="filter-search-wrap">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M9 9L13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <input
                type="search"
                className="filter-search"
                placeholder="Search frames..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search products"
              />
            </div>

            {/* Category pills */}
            <div className="filter-group" role="group" aria-label="Category filter">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`filter-pill ${category === c ? "active" : ""}`}
                >
                  {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>

            {/* Material select */}
            <select
              className="filter-select"
              value={material}
              onChange={(e) => setMaterial(e.target.value as Material)}
              aria-label="Filter by material"
            >
              {MATERIALS.map((m) => (
                <option key={m} value={m}>
                  {m === "all" ? "All Materials" : m.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>

            {/* Sort select */}
            <select
              className="filter-select"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Count */}
            <span className="filter-count">
              {filtered.length} frame{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* ── Product grid ────────────────────────────────────────── */}
        <div className="section-wrap" style={{ paddingTop: 48, paddingBottom: 120 }}>
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <motion.div layout className="shop-grid">
                {filtered.map((product, i) => (
                  <ShopCard key={product.id} product={product} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="shop-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="shop-empty-title">No frames found.</p>
                <p className="shop-empty-sub">Try adjusting your filters or search term.</p>
                <button
                  className="btn-ghost"
                  onClick={() => { setCategory("all"); setMaterial("all"); setQuery(""); }}
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
