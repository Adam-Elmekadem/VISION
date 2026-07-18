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

  if (error) return <div className="adm-page"><p className="adm-error">{error}</p></div>;
  if (!product) return <div className="adm-page"><div className="adm-loading" /></div>;

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <Link href="/admin/products" className="adm-back">← Products</Link>
          <h1 className="adm-page-title">{product.name}</h1>
        </div>
        <Link href={`/product/${product.slug}`} target="_blank" className="adm-btn-ghost" style={{ fontSize: 11 }}>
          View on site ↗
        </Link>
      </div>
      <ProductForm initial={product} />
    </div>
  );
}
