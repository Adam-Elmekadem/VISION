"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi, AdminStats } from "@/lib/admin-api";

const STATUS_BADGE: Record<string, string> = {
  pending:   "bg-[rgba(245,158,11,0.15)] text-[#f59e0b]",
  confirmed: "bg-[rgba(59,130,246,0.12)] text-[#60a5fa]",
  processing:"bg-[rgba(59,130,246,0.12)] text-[#60a5fa]",
  shipped:   "bg-[rgba(34,197,94,0.12)] text-[#4ade80]",
  delivered: "bg-[rgba(34,197,94,0.12)] text-[#4ade80]",
  cancelled: "bg-[rgba(239,68,68,0.12)] text-[#f87171]",
  refunded:  "bg-[rgba(239,68,68,0.12)] text-[#f87171]",
};

function Badge({ label, cls }: { label: string; cls: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 font-space text-[9px] font-semibold tracking-[0.12em] uppercase rounded-sm ${cls}`}>
      {label}
    </span>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.stats().then(setStats).catch((e) => setError(e.message));
  }, []);

  if (error) return (
    <div className="p-10">
      <p className="px-4 py-3 bg-red-500/10 border border-red-500/30 text-[#f87171] font-space text-xs">{error}</p>
    </div>
  );
  if (!stats) return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="w-7 h-7 rounded-full border-2 border-border border-t-orange animate-spin" />
    </div>
  );

  const cards = [
    { label: "Total Orders",   value: stats.total_orders },
    { label: "Revenue",        value: `${stats.total_revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })} MAD` },
    { label: "Pending Orders", value: stats.pending_orders },
    { label: "Products",       value: stats.total_products },
    { label: "Low Stock",      value: stats.low_stock },
  ];

  return (
    <div className="p-10 pb-16 max-w-[1300px]">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-space text-[22px] font-bold tracking-[-0.02em] text-text m-0 leading-none">Dashboard</h1>
        <p className="font-space text-[11px] text-muted tracking-[0.04em] mt-1.5">Overview of your store performance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-5 gap-3 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="bg-surface border border-border p-5">
            <p className="font-space text-[9px] font-semibold tracking-[0.3em] uppercase text-muted mb-2.5">{c.label}</p>
            <p className="font-space text-2xl font-bold tracking-[-0.03em] text-text leading-none">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-space text-sm font-bold text-text tracking-[-0.01em]">Recent Orders</h2>
          <Link href="/admin/orders" className="font-space text-[10px] font-semibold tracking-[0.12em] text-orange uppercase hover:opacity-70 transition-opacity no-underline">
            View all →
          </Link>
        </div>
        <div className="border border-border overflow-x-auto">
          <table className="w-full border-collapse font-space text-[12px]">
            <thead>
              <tr>
                {["Order", "Customer", "Total", "Status", "Date", ""].map((h) => (
                  <th key={h} className="px-3.5 py-2.5 text-left text-[9px] font-semibold tracking-[0.28em] uppercase text-muted border-b border-border whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recent_orders.map((o) => (
                <tr key={o.id} className="hover:[&>td]:bg-white/[0.02]">
                  <td className="px-3.5 py-3 border-b border-border text-text font-mono">{o.order_number}</td>
                  <td className="px-3.5 py-3 border-b border-border text-text">{o.customer_name}</td>
                  <td className="px-3.5 py-3 border-b border-border text-text font-mono">{parseFloat(o.total).toFixed(2)} MAD</td>
                  <td className="px-3.5 py-3 border-b border-border">
                    <Badge label={o.status} cls={STATUS_BADGE[o.status] ?? "bg-white/[0.06] text-muted"} />
                  </td>
                  <td className="px-3.5 py-3 border-b border-border text-muted">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-3.5 py-3 border-b border-border">
                    <Link href={`/admin/orders/${o.id}`} className="font-space text-[10px] font-semibold tracking-[0.1em] uppercase text-orange no-underline hover:opacity-70">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
