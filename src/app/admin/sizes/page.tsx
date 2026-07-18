"use client";
import { useEffect, useState } from "react";
import { adminApi, AdminSize } from "@/lib/admin-api";

type FormState = { name: string; code: string; sort_order: string; is_active: boolean };
const BLANK: FormState = { name: "", code: "", sort_order: "0", is_active: true };

const TH = "px-3.5 py-2.5 text-left text-[9px] font-semibold tracking-[0.28em] uppercase text-muted border-b border-border whitespace-nowrap";
const TD = "px-3.5 py-3 border-b border-border text-text align-middle";
const INP = "bg-surface border border-border text-text font-space text-[12px] px-3 py-2 outline-none focus:border-orange transition-colors w-full";
const LBL = "block font-space text-[10px] font-semibold tracking-[0.16em] uppercase text-muted mb-1.5";
function FG({ children }: { children: React.ReactNode }) { return <div className="flex flex-col mb-4 last:mb-0">{children}</div>; }

export default function SizesPage() {
  const [sizes, setSizes]       = useState<AdminSize[]>([]);
  const [error, setError]       = useState("");
  const [editing, setEditing]   = useState<AdminSize | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm]         = useState<FormState>(BLANK);
  const [saving, setSaving]     = useState(false);

  const load = () => adminApi.sizes().then(setSizes).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const openEdit   = (s: AdminSize) => { setEditing(s); setCreating(false); setForm({ name: s.name, code: s.code, sort_order: String(s.sort_order), is_active: s.is_active }); };
  const openCreate = () => { setEditing(null); setCreating(true); setForm(BLANK); };
  const close      = () => { setEditing(null); setCreating(false); };
  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    setSaving(true); setError("");
    try {
      const payload = { ...form, sort_order: parseInt(form.sort_order, 10) };
      if (editing) { await adminApi.updateSize(editing.id, payload); }
      else { await adminApi.createSize(payload); }
      close(); load();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Save failed"); }
    finally { setSaving(false); }
  };

  const del = async (id: number, name: string) => {
    if (!confirm(`Delete size "${name}"?`)) return;
    try { await adminApi.deleteSize(id); load(); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Delete failed"); }
  };

  return (
    <div className="p-10 pb-16 max-w-[1300px]">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-space text-[22px] font-bold tracking-[-0.02em] text-text m-0 leading-none">Sizes</h1>
          <p className="font-space text-[11px] text-muted mt-1.5">{sizes.length} sizes</p>
        </div>
        <button className="bg-orange text-[#0d0d0d] font-space text-[10px] font-bold tracking-[0.2em] uppercase py-2 px-5 border-none cursor-pointer hover:opacity-85 transition-opacity" onClick={openCreate} type="button">+ New Size</button>
      </div>

      {error && <p className="px-4 py-3 bg-red-500/10 border border-red-500/30 text-[#f87171] font-space text-xs mb-5">{error}</p>}

      <div className="border border-border overflow-x-auto">
        <table className="w-full border-collapse font-space text-[12px]">
          <thead>
            <tr>{["Name","Code","Order","Status",""].map((h) => <th key={h} className={TH}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {sizes.map((s) => (
              <tr key={s.id} className="hover:[&>td]:bg-white/[0.02]">
                <td className={`${TD} font-semibold`}>{s.name}</td>
                <td className={`${TD} font-mono`}>{s.code}</td>
                <td className={TD}>{s.sort_order}</td>
                <td className={TD}>
                  <span className={`inline-block px-2 py-0.5 font-space text-[9px] font-semibold tracking-[0.12em] uppercase rounded-sm ${s.is_active ? "bg-[rgba(34,197,94,0.12)] text-[#4ade80]" : "bg-white/[0.06] text-muted"}`}>
                    {s.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className={TD}>
                  <div className="flex items-center gap-3">
                    <button className="font-space text-[10px] font-semibold tracking-[0.1em] uppercase text-orange bg-transparent border-none cursor-pointer p-0 hover:opacity-70" onClick={() => openEdit(s)} type="button">Edit</button>
                    <button className="font-space text-[10px] font-semibold tracking-[0.1em] uppercase text-[#f87171] bg-transparent border-none cursor-pointer p-0 hover:opacity-70" onClick={() => del(s.id, s.name)} type="button">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(editing || creating) && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex justify-end" onClick={close}>
          <div className="w-[400px] bg-surface border-l border-border flex flex-col p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-space text-[13px] font-bold tracking-[0.1em] text-text mb-6">{editing ? `Edit: ${editing.name}` : "New Size"}</h2>
            <FG><label className={LBL}>Name *</label><input className={INP} required value={form.name} onChange={set("name")} /></FG>
            <FG><label className={LBL}>Code *</label><input className={INP} required value={form.code} onChange={set("code")} placeholder="XL" /></FG>
            <FG><label className={LBL}>Sort Order</label><input className={INP} type="number" value={form.sort_order} onChange={set("sort_order")} /></FG>
            <label className="flex items-center justify-between py-2 cursor-pointer mb-4">
              <span className={LBL} style={{ margin: 0, cursor: "pointer" }}>Active</span>
              <button type="button" role="switch" aria-checked={form.is_active} onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                className={`relative inline-flex w-9 h-5 rounded-full border transition-colors shrink-0 ${form.is_active ? "bg-orange border-orange" : "bg-transparent border-border"}`}
              >
                <span className={`absolute top-[3px] left-[3px] w-[14px] h-[14px] rounded-full transition-transform ${form.is_active ? "translate-x-4 bg-[#0d0d0d]" : "translate-x-0 bg-white/40"}`} />
              </button>
            </label>
            <div className="flex gap-2 mt-auto pt-4 border-t border-border">
              <button className="flex-1 font-space text-[10px] font-semibold tracking-[0.14em] uppercase border border-border py-2.5 text-text bg-transparent cursor-pointer hover:border-orange hover:text-orange transition-colors" onClick={close} type="button">Cancel</button>
              <button className="flex-1 bg-orange text-[#0d0d0d] font-space text-[10px] font-bold tracking-[0.2em] uppercase py-2.5 border-none cursor-pointer hover:opacity-85 disabled:opacity-50 transition-opacity" onClick={save} disabled={saving} type="button">{saving ? "Saving…" : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
