"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { adminApi, AdminOrderRow, Paginated } from "@/lib/admin-api";

const S_BADGE: Record<string, string> = {
  pending:"bg-[rgba(245,158,11,0.15)] text-[#f59e0b]",
  confirmed:"bg-[rgba(59,130,246,0.12)] text-[#60a5fa]",
  processing:"bg-[rgba(59,130,246,0.12)] text-[#60a5fa]",
  shipped:"bg-[rgba(34,197,94,0.12)] text-[#4ade80]",
  delivered:"bg-[rgba(34,197,94,0.12)] text-[#4ade80]",
  cancelled:"bg-[rgba(239,68,68,0.12)] text-[#f87171]",
  refunded:"bg-[rgba(239,68,68,0.12)] text-[#f87171]",
};
const P_BADGE: Record<string, string> = {
  pending:"bg-[rgba(245,158,11,0.15)] text-[#f59e0b]",
  paid:"bg-[rgba(34,197,94,0.12)] text-[#4ade80]",
  failed:"bg-[rgba(239,68,68,0.12)] text-[#f87171]",
  refunded:"bg-[rgba(239,68,68,0.12)] text-[#f87171]",
};
function Badge({ label, cls }: { label: string; cls: string }) {
  return <span className={`inline-block px-2 py-0.5 font-space text-[9px] font-semibold tracking-[0.12em] uppercase rounded-sm ${cls}`}>{label}</span>;
}
const ALL_STATUSES = ["pending","confirmed","processing","shipped","delivered","cancelled","refunded"];

const TH = "px-3.5 py-2.5 text-left text-[9px] font-semibold tracking-[0.28em] uppercase text-muted border-b border-border whitespace-nowrap";
const TD = "px-3.5 py-3 border-b border-border text-text align-middle";

export default function OrdersPage() {
  const [data, setData]     = useState<Paginated<AdminOrderRow> | null>(null);
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError]   = useState("");

  const load = useCallback(() => {
    setError("");
    adminApi.orders({ page, search: search || undefined, status: status || undefined }).then(setData).catch((e) => setError(e.message));
  }, [page, search, status]);
  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-10 pb-16 max-w-[1300px]">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-space text-[22px] font-bold tracking-[-0.02em] text-text m-0 leading-none">Orders</h1>
          <p className="font-space text-[11px] text-muted mt-1.5">{data ? `${data.total} total` : "Loading…"}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2.5 mb-5 flex-wrap">
        <input
          className="bg-surface border border-border text-text font-space text-[12px] px-3 py-2 outline-none focus:border-orange transition-colors min-w-[240px]"
          placeholder="Search order #, name, email…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          className="bg-surface border border-border text-text font-space text-[12px] px-3 py-2 outline-none focus:border-orange transition-colors min-w-[160px]"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
        >
          <option value="">All statuses</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
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
                  {["Order #","Customer","Total","Status","Payment","Date",""].map((h) => <th key={h} className={TH}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.data.map((o) => (
                  <tr key={o.id} className="hover:[&>td]:bg-white/[0.02]">
                    <td className={`${TD} font-mono`}>{o.order_number}</td>
                    <td className={TD}>{o.customer_name}</td>
                    <td className={`${TD} font-mono`}>{parseFloat(o.total).toFixed(2)} MAD</td>
                    <td className={TD}><Badge label={o.status} cls={S_BADGE[o.status] ?? "bg-white/[0.06] text-muted"} /></td>
                    <td className={TD}><Badge label={o.payment_status} cls={P_BADGE[o.payment_status] ?? "bg-white/[0.06] text-muted"} /></td>
                    <td className={`${TD} text-muted`}>{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className={TD}>
                      <Link href={`/admin/orders/${o.id}`} className="font-space text-[10px] font-semibold tracking-[0.1em] uppercase text-orange no-underline hover:opacity-70">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.last_page > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button className="font-space text-[10px] font-semibold tracking-[0.14em] uppercase border border-border px-4 py-2 text-text disabled:opacity-40 hover:border-orange hover:text-orange transition-colors" disabled={page===1} onClick={() => setPage((p)=>p-1)}>← Prev</button>
              <span className="font-space text-[11px] text-muted">Page {data.current_page} of {data.last_page}</span>
              <button className="font-space text-[10px] font-semibold tracking-[0.14em] uppercase border border-border px-4 py-2 text-text disabled:opacity-40 hover:border-orange hover:text-orange transition-colors" disabled={page===data.last_page} onClick={() => setPage((p)=>p+1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
