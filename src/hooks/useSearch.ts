"use client";

import { useMemo, useState, useTransition } from "react";
import Fuse from "fuse.js";
import { products, type Product } from "@/lib/products";

const fuse = new Fuse(products, {
  keys: [
    { name: "name",        weight: 0.4 },
    { name: "tags",        weight: 0.25 },
    { name: "collection",  weight: 0.15 },
    { name: "description", weight: 0.1 },
    { name: "material",    weight: 0.1 },
  ],
  threshold: 0.35,   // 0 = exact, 1 = match anything
  includeScore: true,
  minMatchCharLength: 2,
});

export function useSearch() {
  const [query, setQuery]       = useState("");
  const [isPending, startTransition] = useTransition();

  const results: Product[] = useMemo(() => {
    if (!query.trim()) return products;
    return fuse.search(query).map((r) => r.item);
  }, [query]);

  const handleQuery = (value: string) => {
    startTransition(() => setQuery(value));
  };

  return { query, setQuery: handleQuery, results, isPending };
}
