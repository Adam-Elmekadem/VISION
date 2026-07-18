"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { adminApi, AdminOrderRow, Paginated } from "@/lib/admin-api";

const STATUS_COLOR: Record<string, string> = {
  pending:    "adm-badge-warning",
  confirmed:  "adm-badge-info",
  processing: "adm-badge-info",
  shipped:    "adm-badge-success",
  delivered:  "adm-badge-success",
  cancelled:  "adm-badge-danger",
  refunded:   "adm-badge-danger",
};
const PAY_COLOR: Record<string, string> = {
  pending: "adm-badge-warning",
  paid:    "adm-badge-success",
  failed:  "adm-badge-danger",
  refunded:"adm-badge-danger",
};

const ALL_STATUSES = ["pending","confirmed","processing","shipped","delivered","cancelled","refunded"];

export default function OrdersPage() {
  const [data, setData]     = useState<Paginated<AdminOrderRow> | null>(null);
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError]   = useState("");

  const load = useCallback(() => {
    setError("");
    adminApi.orders({ page, search: search || undefined, status: status || undefined })
      .then(setData)
      .catch((e) => setError(e.message));
  }, [page, search, status]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h1 className="adm-page-title">Orders</h1>
        <p className="adm-page-sub">{data ? `${data.total} total` : "Loading…"}</p>
      </div>

      {/* Filters */}
      <div className="adm-filters">
        <input
          className="adm-input"
          placeholder="Search order #, name, email…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          className="adm-select"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
        >
          <option value="">All statuses</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
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
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((o) => (
                  <tr key={o.id}>
                    <td className="adm-mono">{o.order_number}</td>
                    <td>{o.customer_name}</td>
                    <td className="adm-mono">{parseFloat(o.total).toFixed(2)} MAD</td>
                    <td><span className={`adm-badge ${STATUS_COLOR[o.status] ?? "adm-badge-muted"}`}>{o.status}</span></td>
                    <td><span className={`adm-badge ${PAY_COLOR[o.payment_status] ?? "adm-badge-muted"}`}>{o.payment_status}</span></td>
                    <td className="adm-muted">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td><Link href={`/admin/orders/${o.id}`} className="adm-row-link">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
