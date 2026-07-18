"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { adminApi, AdminProduct, Paginated } from "@/lib/admin-api";

export default function ProductsPage() {
  const [data, setData]     = useState<Paginated<AdminProduct> | null>(null);
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState("");
  const [error, setError]   = useState("");

  const load = useCallback(() => {
    setError("");
    adminApi.products({ page, search: search || undefined }).then(setData).catch((e) => setError(e.message));
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This can be undone from the database.`)) return;
    try {
      await adminApi.deleteProduct(id);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Products</h1>
          <p className="adm-page-sub">{data ? `${data.total} total` : "Loading…"}</p>
        </div>
        <Link href="/admin/products/new" className="adm-btn-primary">+ New Product</Link>
      </div>

      <div className="adm-filters">
        <input
          className="adm-input"
          placeholder="Search products…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {error && <p className="adm-error">{error}</p>}

      {!data ? (
        <div className="adm-loading" />
      ) : (
        <>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th style={{ width: 52 }}></th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.cover_image ? (
                        <div className="adm-thumb">
                          <Image src={p.cover_image} alt={p.name} fill className="object-cover" sizes="40px" />
                        </div>
                      ) : (
                        <div className="adm-thumb adm-thumb-empty" />
                      )}
                    </td>
                    <td>
                      <div className="adm-item-name">{p.name}</div>
                      {p.sku && <div className="adm-muted adm-mono" style={{ fontSize: 11 }}>{p.sku}</div>}
                    </td>
                    <td className="adm-muted">{p.category?.name ?? "—"}</td>
                    <td className="adm-mono">{parseFloat(p.price).toFixed(2)} MAD</td>
                    <td>
                      <span className={`adm-badge ${p.stock === 0 ? "adm-badge-danger" : p.stock < 5 ? "adm-badge-warning" : "adm-badge-muted"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      <span className={`adm-badge ${p.is_active ? "adm-badge-success" : "adm-badge-muted"}`}>
                        {p.is_active ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td>
                      <div className="adm-row-actions">
                        <Link href={`/admin/products/${p.id}`} className="adm-row-link">Edit</Link>
                        <button
                          className="adm-row-link adm-danger"
                          onClick={() => handleDelete(p.id, p.name)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.last_page > 1 && (
            <div className="adm-pagination">
              <button className="adm-btn-ghost" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
              <span className="adm-muted">Page {data.current_page} of {data.last_page}</span>
              <button className="adm-btn-ghost" disabled={page === data.last_page} onClick={() => setPage((p) => p + 1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
