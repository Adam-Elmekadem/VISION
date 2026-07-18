"use client";
import Link from "next/link";
import ProductForm from "../_ProductForm";

export default function NewProductPage() {
  return (
    <div className="p-10 pb-16 max-w-[1300px]">
      <div className="mb-8">
        <Link href="/admin/products" className="font-space text-[10px] font-semibold tracking-[0.14em] uppercase text-muted no-underline hover:text-orange transition-colors block mb-2">← Products</Link>
        <h1 className="font-space text-[22px] font-bold tracking-[-0.02em] text-text m-0 leading-none">New Product</h1>
      </div>
      <ProductForm />
    </div>
  );
}
