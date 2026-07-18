"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { adminApi, AdminProduct, Paginated } from "@/lib/admin-api";

function Badge({ label, cls }: { label: string; cls: string }) {
  return <span className={`inline-block px-2 py-0.5 font-space text-[9px] font-semibold tracking-[0.12em] uppercase rounded-sm ${cls}`}>{label}</span>;
}

const TH = "px-3.5 py-2.5 text-left text-[9px] font-semibold tracking-[0.28em] uppercase text-muted border-b border-border whitespace-nowrap";
const TD = "px-3.5 py-3 border-b border-border text-text align-middle";

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
    if (!confirm(`Delete "${name}"?`)) return;
    try { await adminApi.deleteProduct(id); load(); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Delete failed"); }
  };

  return (
    <div className="p-10 pb-16 max-w-[1300px]">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-space text-[22px] font-bold tracking-[-0.02em] text-text m-0 leading-none">Products</h1>
          <p className="font-space text-[11px] text-muted mt-1.5">{data ? `${data.total} total` : "Loading…"}</p>
        </div>
        <Link href="/admin/products/new" className="bg-orange text-[#0d0d0d] font-space text-[10px] font-bold tracking-[0.2em] uppercase py-2 px-5 no-underline hover:opacity-85 transition-opacity">
          + New Product
        </Link>
      </div>

      <div className="flex gap-2.5 mb-5">
        <input
          className="bg-surface border border-border text-text font-space text-[12px] px-3 py-2 outline-none focus:border-orange transition-colors min-w-[280px]"
          placeholder="Search products…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {error && <p className="px-4 py-3 bg-red-500/10 border border-red-500/30 text-[#f87171] font-space text-xs mb-5">{error}</p>}

      {!data ? (
        <div className="flex justify-center py-16"><div className="w-7 h-7 rounded-full border-2 border-border border-t-orange animate-spin" /></div>
      ) : (
        <>
          <div className="border border-border overflow-x-auto">
            <table className="w-full border-collapse font-space text-[12px]">
              <thead>
                <tr>
                  {["","Name","Category","Price","Stock","Status",""].map((h, i) => (
                    <th key={i} className={`${TH}${i === 0 ? " w-14" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.data.map((p) => (
                  <tr key={p.id} className="hover:[&>td]:bg-white/[0.02]">
                    <td className={TD}>
                      <div className="relative w-10 h-10 bg-white/[0.06] overflow-hidden shrink-0">
                        {p.cover_image && (
                          <Image src={p.cover_image} alt={p.name} fill className="object-cover" sizes="40px" />
                        )}
                      </div>
                    </td>
                    <td className={TD}>
                      <div className="font-semibold text-text">{p.name}</div>
                      {p.sku && <div className="text-muted font-mono text-[11px]">{p.sku}</div>}
                    </td>
                    <td className={`${TD} text-muted`}>{p.category?.name ?? "—"}</td>
                    <td className={`${TD} font-mono`}>{parseFloat(p.price).toFixed(2)} MAD</td>
                    <td className={TD}>
                      <Badge
                        label={String(p.stock)}
                        cls={p.stock === 0 ? "bg-[rgba(239,68,68,0.12)] text-[#f87171]" : p.stock < 5 ? "bg-[rgba(245,158,11,0.15)] text-[#f59e0b]" : "bg-white/[0.06] text-muted"}
                      />
                    </td>
                    <td className={TD}>
                      <Badge label={p.is_active ? "Active" : "Draft"} cls={p.is_active ? "bg-[rgba(34,197,94,0.12)] text-[#4ade80]" : "bg-white/[0.06] text-muted"} />
                    </td>
                    <td className={TD}>
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/products/${p.id}`} className="font-space text-[10px] font-semibold tracking-[0.1em] uppercase text-orange no-underline hover:opacity-70">Edit</Link>
                        <button
                          type="button"
                          className="font-space text-[10px] font-semibold tracking-[0.1em] uppercase text-[#f87171] bg-transparent border-none cursor-pointer p-0 hover:opacity-70"
                          onClick={() => handleDelete(p.id, p.name)}
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
            <div className="flex items-center justify-center gap-4 mt-6">
              <button className="font-space text-[10px] font-semibold tracking-[0.14em] uppercase border border-border px-4 py-2 text-text bg-transparent cursor-pointer disabled:opacity-40 hover:border-orange hover:text-orange transition-colors" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
              <span className="font-space text-[11px] text-muted">Page {data.current_page} of {data.last_page}</span>
              <button className="font-space text-[10px] font-semibold tracking-[0.14em] uppercase border border-border px-4 py-2 text-text bg-transparent cursor-pointer disabled:opacity-40 hover:border-orange hover:text-orange transition-colors" disabled={page === data.last_page} onClick={() => setPage((p) => p + 1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
