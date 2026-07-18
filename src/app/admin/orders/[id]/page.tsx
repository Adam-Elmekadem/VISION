"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { adminApi, AdminOrder } from "@/lib/admin-api";

const ORDER_STATUSES   = ["pending","confirmed","processing","shipped","delivered","cancelled","refunded"];
const PAYMENT_STATUSES = ["pending","paid","failed","refunded"];

const STATUS_COLOR: Record<string, string> = {
  pending:"adm-badge-warning", confirmed:"adm-badge-info", processing:"adm-badge-info",
  shipped:"adm-badge-success", delivered:"adm-badge-success", cancelled:"adm-badge-danger", refunded:"adm-badge-danger",
};
const PAY_COLOR: Record<string, string> = {
  pending:"adm-badge-warning", paid:"adm-badge-success", failed:"adm-badge-danger", refunded:"adm-badge-danger",
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder]   = useState<AdminOrder | null>(null);
  const [error, setError]   = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm]     = useState({ status: "", payment_status: "", notes: "" });

  useEffect(() => {
    adminApi.order(Number(id))
      .then((o) => { setOrder(o); setForm({ status: o.status, payment_status: o.payment_status, notes: o.notes ?? "" }); })
      .catch((e) => setError(e.message));
  }, [id]);

  const save = async () => {
    if (!order) return;
    setSaving(true);
    try {
      const updated = await adminApi.updateOrder(order.id, form);
      setOrder(updated);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (error) return <div className="adm-page"><p className="adm-error">{error}</p></div>;
  if (!order) return <div className="adm-page"><div className="adm-loading" /></div>;

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <Link href="/admin/orders" className="adm-back">← Orders</Link>
          <h1 className="adm-page-title">{order.order_number}</h1>
        </div>
        <div className="adm-header-badges">
          <span className={`adm-badge ${STATUS_COLOR[order.status] ?? "adm-badge-muted"}`}>{order.status}</span>
          <span className={`adm-badge ${PAY_COLOR[order.payment_status] ?? "adm-badge-muted"}`}>{order.payment_status}</span>
        </div>
      </div>

      <div className="adm-two-col">
        {/* Left — order details */}
        <div className="adm-col-main">
          {/* Items */}
          <div className="adm-card">
            <h2 className="adm-card-title">Items</h2>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr><th>Product</th><th>Color</th><th>Size</th><th>Qty</th><th>Unit</th><th>Total</th></tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="adm-item-name">{item.product_name}</div>
                        {item.product_sku && <div className="adm-muted adm-mono" style={{ fontSize: 11 }}>{item.product_sku}</div>}
                      </td>
                      <td className="adm-muted">{item.color ?? "—"}</td>
                      <td className="adm-muted">{item.size ?? "—"}</td>
                      <td>{item.quantity}</td>
                      <td className="adm-mono">{parseFloat(item.unit_price).toFixed(2)}</td>
                      <td className="adm-mono">{parseFloat(item.total_price).toFixed(2)} MAD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="adm-totals">
              <div className="adm-total-row"><span>Subtotal</span><span>{parseFloat(order.subtotal).toFixed(2)} MAD</span></div>
              <div className="adm-total-row"><span>Shipping</span><span>{parseFloat(order.shipping_cost).toFixed(2)} MAD</span></div>
              <div className="adm-total-row adm-total-grand"><span>Total</span><span>{parseFloat(order.total).toFixed(2)} MAD</span></div>
            </div>
          </div>

          {/* Customer */}
          <div className="adm-card">
            <h2 className="adm-card-title">Customer</h2>
            <dl className="adm-dl">
              <dt>Name</dt><dd>{order.customer_name}</dd>
              <dt>Email</dt><dd>{order.customer_email}</dd>
              {order.customer_phone && <><dt>Phone</dt><dd>{order.customer_phone}</dd></>}
              {order.city && <><dt>City</dt><dd>{order.city}, {order.country}</dd></>}
              <dt>Payment</dt><dd>{order.payment_method}</dd>
              <dt>Placed</dt><dd>{new Date(order.created_at).toLocaleString()}</dd>
            </dl>
          </div>
        </div>

        {/* Right — update form */}
        <div className="adm-col-side">
          <div className="adm-card">
            <h2 className="adm-card-title">Update Order</h2>
            <div className="adm-form-group">
              <label className="adm-label">Order Status</label>
              <select
                className="adm-select adm-select-full"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="adm-form-group">
              <label className="adm-label">Payment Status</label>
              <select
                className="adm-select adm-select-full"
                value={form.payment_status}
                onChange={(e) => setForm((f) => ({ ...f, payment_status: e.target.value }))}
              >
                {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="adm-form-group">
              <label className="adm-label">Notes</label>
              <textarea
                className="adm-textarea"
                rows={4}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Internal notes…"
              />
            </div>
            <button
              className="adm-btn-primary adm-btn-full"
              onClick={save}
              disabled={saving}
              type="button"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
