"use client";
import { useEffect, useState } from "react";
import { adminApi, AdminSize } from "@/lib/admin-api";

type FormState = { name: string; code: string; sort_order: string; is_active: boolean };
const BLANK: FormState = { name: "", code: "", sort_order: "0", is_active: true };

export default function SizesPage() {
  const [sizes, setSizes]     = useState<AdminSize[]>([]);
  const [error, setError]     = useState("");
  const [editing, setEditing] = useState<AdminSize | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm]       = useState<FormState>(BLANK);
  const [saving, setSaving]   = useState(false);

  const load = () => adminApi.sizes().then(setSizes).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const openEdit = (s: AdminSize) => { setEditing(s); setCreating(false); setForm({ name: s.name, code: s.code, sort_order: String(s.sort_order), is_active: s.is_active }); };
  const openCreate = () => { setEditing(null); setCreating(true); setForm(BLANK); };
  const close = () => { setEditing(null); setCreating(false); };
  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    setSaving(true); setError("");
    try {
      const payload = { ...form, sort_order: parseInt(form.sort_order, 10) };
      if (editing) { await adminApi.updateSize(editing.id, payload); }
      else { await adminApi.createSize({ ...payload }); }
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
    <div className="adm-page">
      <div className="adm-page-header">
        <div><h1 className="adm-page-title">Sizes</h1><p className="adm-page-sub">{sizes.length} sizes</p></div>
        <button className="adm-btn-primary" onClick={openCreate} type="button">+ New Size</button>
      </div>
      {error && <p className="adm-error">{error}</p>}
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead><tr><th>Name</th><th>Code</th><th>Order</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {sizes.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td className="adm-mono">{s.code}</td>
                <td>{s.sort_order}</td>
                <td><span className={`adm-badge ${s.is_active ? "adm-badge-success" : "adm-badge-muted"}`}>{s.is_active ? "Active" : "Inactive"}</span></td>
                <td>
                  <div className="adm-row-actions">
                    <button className="adm-row-link" onClick={() => openEdit(s)} type="button">Edit</button>
                    <button className="adm-row-link adm-danger" onClick={() => del(s.id, s.name)} type="button">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(editing || creating) && (
        <div className="adm-drawer-backdrop" onClick={close}>
          <div className="adm-drawer" onClick={(e) => e.stopPropagation()}>
            <h2 className="adm-card-title">{editing ? `Edit: ${editing.name}` : "New Size"}</h2>
            <div className="adm-form-group"><label className="adm-label">Name *</label><input className="adm-input adm-input-full" required value={form.name} onChange={set("name")} /></div>
            <div className="adm-form-group"><label className="adm-label">Code *</label><input className="adm-input adm-input-full" required value={form.code} onChange={set("code")} placeholder="XL" /></div>
            <div className="adm-form-group"><label className="adm-label">Sort Order</label><input className="adm-input adm-input-full" type="number" value={form.sort_order} onChange={set("sort_order")} /></div>
            <label className="adm-toggle-row">
              <span className="adm-label" style={{ margin: 0 }}>Active</span>
              <button type="button" role="switch" aria-checked={form.is_active} className={`adm-toggle ${form.is_active ? "on" : ""}`} onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))} />
            </label>
            <div className="adm-drawer-actions">
              <button className="adm-btn-ghost" onClick={close} type="button">Cancel</button>
              <button className="adm-btn-primary" onClick={save} disabled={saving} type="button">{saving ? "Saving…" : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
