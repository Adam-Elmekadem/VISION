"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { adminApi, AdminProduct } from "@/lib/admin-api";
import ProductForm from "../_ProductForm";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [error, setError]     = useState("");

  useEffect(() => {
    adminApi.product(Number(id)).then(setProduct).catch((e) => setError(e.message));
  }, [id]);

  if (error) return (
    <div className="p-10"><p className="px-4 py-3 bg-red-500/10 border border-red-500/30 text-[#f87171] font-space text-xs">{error}</p></div>
  );
  if (!product) return (
    <div className="flex justify-center py-16"><div className="w-7 h-7 rounded-full border-2 border-border border-t-orange animate-spin" /></div>
  );

  return (
    <div className="p-10 pb-16 max-w-[1300px]">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <Link href="/admin/products" className="font-space text-[10px] font-semibold tracking-[0.14em] uppercase text-muted no-underline hover:text-orange transition-colors block mb-2">← Products</Link>
          <h1 className="font-space text-[22px] font-bold tracking-[-0.02em] text-text m-0 leading-none">{product.name}</h1>
        </div>
        <Link href={`/product/${product.slug}`} target="_blank" className="font-space text-[10px] font-semibold tracking-[0.14em] uppercase border border-border px-4 py-2 text-text no-underline hover:border-orange hover:text-orange transition-colors">
          View on site ↗
        </Link>
      </div>
      <ProductForm initial={product} />
    </div>
  );
}
