"use client";
import Link from "next/link";
import ProductForm from "../_ProductForm";

export default function NewProductPage() {
  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <Link href="/admin/products" className="adm-back">← Products</Link>
          <h1 className="adm-page-title">New Product</h1>
        </div>
      </div>
      <ProductForm />
    </div>
  );
}
