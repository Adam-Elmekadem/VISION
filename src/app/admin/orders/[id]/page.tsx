"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { adminApi, AdminOrder } from "@/lib/admin-api";

const S_BADGE: Record<string, string> = {
  pending:"bg-[rgba(245,158,11,0.15)] text-[#f59e0b]",confirmed:"bg-[rgba(59,130,246,0.12)] text-[#60a5fa]",
  processing:"bg-[rgba(59,130,246,0.12)] text-[#60a5fa]",shipped:"bg-[rgba(34,197,94,0.12)] text-[#4ade80]",
  delivered:"bg-[rgba(34,197,94,0.12)] text-[#4ade80]",cancelled:"bg-[rgba(239,68,68,0.12)] text-[#f87171]",refunded:"bg-[rgba(239,68,68,0.12)] text-[#f87171]",
};
const P_BADGE: Record<string,string> = {pending:"bg-[rgba(245,158,11,0.15)] text-[#f59e0b]",paid:"bg-[rgba(34,197,94,0.12)] text-[#4ade80]",failed:"bg-[rgba(239,68,68,0.12)] text-[#f87171]",refunded:"bg-[rgba(239,68,68,0.12)] text-[#f87171]"};
function Badge({label,cls}:{label:string;cls:string}){return <span className={`inline-block px-2 py-0.5 font-space text-[9px] font-semibold tracking-[0.12em] uppercase rounded-sm ${cls}`}>{label}</span>;}

const ORDER_STATUSES   = ["pending","confirmed","processing","shipped","delivered","cancelled","refunded"];
const PAYMENT_STATUSES = ["pending","paid","failed","refunded"];
const TH = "px-3.5 py-2.5 text-left text-[9px] font-semibold tracking-[0.28em] uppercase text-muted border-b border-border";
const TD = "px-3.5 py-3 border-b border-border text-text align-middle";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder]   = useState<AdminOrder | null>(null);
  const [error, setError]   = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm]     = useState({ status: "", payment_status: "", notes: "" });

  useEffect(() => {
    adminApi.order(Number(id)).then((o) => { setOrder(o); setForm({ status: o.status, payment_status: o.payment_status, notes: o.notes ?? "" }); }).catch((e) => setError(e.message));
  }, [id]);

  const save = async () => {
    if (!order) return;
    setSaving(true);
    try { const u = await adminApi.updateOrder(order.id, form); setOrder(u); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Save failed"); }
    finally { setSaving(false); }
  };

  if (error) return <div className="p-10"><p className="px-4 py-3 bg-red-500/10 border border-red-500/30 text-[#f87171] font-space text-xs">{error}</p></div>;
  if (!order) return <div className="flex justify-center py-16"><div className="w-7 h-7 rounded-full border-2 border-border border-t-orange animate-spin" /></div>;

  const inp = "bg-surface border border-border text-text font-space text-[12px] px-3 py-2 outline-none focus:border-orange transition-colors w-full";
  const lbl = "block font-space text-[10px] font-semibold tracking-[0.16em] uppercase text-muted mb-1.5";

  return (
    <div className="p-10 pb-16 max-w-[1300px]">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <Link href="/admin/orders" className="font-space text-[10px] font-semibold tracking-[0.14em] uppercase text-muted no-underline hover:text-orange transition-colors block mb-2">← Orders</Link>
          <h1 className="font-space text-[22px] font-bold tracking-[-0.02em] text-text m-0 leading-none">{order.order_number}</h1>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Badge label={order.status} cls={S_BADGE[order.status]??"bg-white/[0.06] text-muted"} />
          <Badge label={order.payment_status} cls={P_BADGE[order.payment_status]??"bg-white/[0.06] text-muted"} />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-6 items-start">
        {/* Left */}
        <div className="flex flex-col gap-5">
          {/* Items */}
          <div className="bg-surface border border-border p-6">
            <p className="font-space text-[11px] font-bold tracking-[0.22em] uppercase text-muted mb-4">Items</p>
            <div className="border border-border overflow-x-auto">
              <table className="w-full border-collapse font-space text-[12px]">
                <thead>
                  <tr>{["Product","Color","Size","Qty","Unit","Total"].map((h)=><th key={h} className={TH}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {order.items.map((item)=>(
                    <tr key={item.id} className="hover:[&>td]:bg-white/[0.02]">
                      <td className={TD}>
                        <div className="font-semibold">{item.product_name}</div>
                        {item.product_sku && <div className="text-muted font-mono text-[11px]">{item.product_sku}</div>}
                      </td>
                      <td className={`${TD} text-muted`}>{item.color??"—"}</td>
                      <td className={`${TD} text-muted`}>{item.size??"—"}</td>
                      <td className={TD}>{item.quantity}</td>
                      <td className={`${TD} font-mono`}>{parseFloat(item.unit_price).toFixed(2)}</td>
                      <td className={`${TD} font-mono`}>{parseFloat(item.total_price).toFixed(2)} MAD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col items-end gap-1.5 pt-3 border-t border-border mt-1">
              <div className="flex gap-10 font-space text-[12px] text-muted"><span>Subtotal</span><span>{parseFloat(order.subtotal).toFixed(2)} MAD</span></div>
              <div className="flex gap-10 font-space text-[12px] text-muted"><span>Shipping</span><span>{parseFloat(order.shipping_cost).toFixed(2)} MAD</span></div>
              <div className="flex gap-10 font-space text-[14px] font-bold text-text pt-1.5 border-t border-border"><span>Total</span><span>{parseFloat(order.total).toFixed(2)} MAD</span></div>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-surface border border-border p-6">
            <p className="font-space text-[11px] font-bold tracking-[0.22em] uppercase text-muted mb-4">Customer</p>
            <dl className="grid grid-cols-[110px_1fr] gap-x-4 gap-y-2 font-space text-[12px]">
              {[["Name",order.customer_name],["Email",order.customer_email],order.customer_phone?["Phone",order.customer_phone]:null,order.city?["City",`${order.city}, ${order.country}`]:null,["Payment",order.payment_method],["Placed",new Date(order.created_at).toLocaleString()]].filter(Boolean).map((row)=>(
                <>
                  <dt key={`dt-${row![0]}`} className="text-muted text-[10px] tracking-[0.1em] uppercase self-center">{row![0]}</dt>
                  <dd key={`dd-${row![0]}`} className="text-text m-0">{row![1]}</dd>
                </>
              ))}
            </dl>
          </div>
        </div>

        {/* Right — update form */}
        <div className="bg-surface border border-border p-6 flex flex-col gap-4">
          <p className="font-space text-[11px] font-bold tracking-[0.22em] uppercase text-muted mb-0">Update Order</p>
          <div>
            <label className={lbl}>Order Status</label>
            <select className={inp} value={form.status} onChange={(e)=>setForm((f)=>({...f,status:e.target.value}))}>
              {ORDER_STATUSES.map((s)=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>Payment Status</label>
            <select className={inp} value={form.payment_status} onChange={(e)=>setForm((f)=>({...f,payment_status:e.target.value}))}>
              {PAYMENT_STATUSES.map((s)=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>Notes</label>
            <textarea className={`${inp} resize-y`} rows={4} value={form.notes} onChange={(e)=>setForm((f)=>({...f,notes:e.target.value}))} placeholder="Internal notes…" />
          </div>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="w-full bg-orange text-[#0d0d0d] font-space text-[10px] font-bold tracking-[0.2em] uppercase py-2.5 border-none cursor-pointer hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
