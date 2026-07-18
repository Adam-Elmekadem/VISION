"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi, AdminStats } from "@/lib/admin-api";

const STATUS_COLOR: Record<string, string> = {
  pending:    "adm-badge-warning",
  confirmed:  "adm-badge-info",
  processing: "adm-badge-info",
  shipped:    "adm-badge-success",
  delivered:  "adm-badge-success",
  cancelled:  "adm-badge-danger",
  refunded:   "adm-badge-danger",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.stats().then(setStats).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="adm-page"><p className="adm-error">{error}</p></div>;
  if (!stats) return <div className="adm-page"><div className="adm-loading" /></div>;

  const statCards = [
    { label: "Total Orders",    value: stats.total_orders,                     suffix: "" },
    { label: "Revenue",         value: `${stats.total_revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })} MAD`, suffix: "" },
    { label: "Pending Orders",  value: stats.pending_orders,                   suffix: "" },
    { label: "Products",        value: stats.total_products,                   suffix: "" },
    { label: "Low Stock",       value: stats.low_stock,                        suffix: "" },
  ];

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h1 className="adm-page-title">Dashboard</h1>
        <p className="adm-page-sub">Overview of your store performance</p>
      </div>

      {/* Stat cards */}
      <div className="adm-stat-grid">
        {statCards.map((s) => (
          <div key={s.label} className="adm-stat-card">
            <p className="adm-stat-label">{s.label}</p>
            <p className="adm-stat-value">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="adm-section">
        <div className="adm-section-header">
          <h2 className="adm-section-title">Recent Orders</h2>
          <Link href="/admin/orders" className="adm-link">View all →</Link>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_orders.map((o) => (
                <tr key={o.id}>
                  <td className="adm-mono">{o.order_number}</td>
                  <td>{o.customer_name}</td>
                  <td className="adm-mono">{parseFloat(o.total).toFixed(2)} MAD</td>
                  <td><span className={`adm-badge ${STATUS_COLOR[o.status] ?? "adm-badge-muted"}`}>{o.status}</span></td>
                  <td className="adm-muted">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td><Link href={`/admin/orders/${o.id}`} className="adm-row-link">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
