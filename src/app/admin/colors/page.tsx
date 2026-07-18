"use client";
import { useEffect, useState } from "react";
import { adminApi, AdminColor } from "@/lib/admin-api";

type FormState = { name: string; hex_code: string; is_active: boolean };
const BLANK: FormState = { name: "", hex_code: "#000000", is_active: true };

export default function ColorsPage() {
  const [colors, setColors]   = useState<AdminColor[]>([]);
  const [error, setError]     = useState("");
  const [editing, setEditing] = useState<AdminColor | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm]       = useState<FormState>(BLANK);
  const [saving, setSaving]   = useState(false);

  const load = () => adminApi.colors().then(setColors).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const openEdit = (c: AdminColor) => { setEditing(c); setCreating(false); setForm({ name: c.name, hex_code: c.hex_code, is_active: c.is_active }); };
  const openCreate = () => { setEditing(null); setCreating(true); setForm(BLANK); };
  const close = () => { setEditing(null); setCreating(false); };
  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    setSaving(true); setError("");
    try {
      if (editing) { await adminApi.updateColor(editing.id, form); }
      else { await adminApi.createColor({ ...form, is_active: form.is_active }); }
      close(); load();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Save failed"); }
    finally { setSaving(false); }
  };

  const del = async (id: number, name: string) => {
    if (!confirm(`Delete color "${name}"?`)) return;
    try { await adminApi.deleteColor(id); load(); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Delete failed"); }
  };

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div><h1 className="adm-page-title">Colors</h1><p className="adm-page-sub">{colors.length} colors</p></div>
        <button className="adm-btn-primary" onClick={openCreate} type="button">+ New Color</button>
      </div>
      {error && <p className="adm-error">{error}</p>}
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead><tr><th>Swatch</th><th>Name</th><th>Hex</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {colors.map((c) => (
              <tr key={c.id}>
                <td><span className="adm-color-swatch" style={{ background: c.hex_code }} /></td>
                <td>{c.name}</td>
                <td className="adm-mono adm-muted">{c.hex_code}</td>
                <td><span className={`adm-badge ${c.is_active ? "adm-badge-success" : "adm-badge-muted"}`}>{c.is_active ? "Active" : "Inactive"}</span></td>
                <td>
                  <div className="adm-row-actions">
                    <button className="adm-row-link" onClick={() => openEdit(c)} type="button">Edit</button>
                    <button className="adm-row-link adm-danger" onClick={() => del(c.id, c.name)} type="button">Delete</button>
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
            <h2 className="adm-card-title">{editing ? `Edit: ${editing.name}` : "New Color"}</h2>
            <div className="adm-form-group"><label className="adm-label">Name *</label><input className="adm-input adm-input-full" required value={form.name} onChange={set("name")} /></div>
            <div className="adm-form-group">
              <label className="adm-label">Hex Code *</label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input type="color" value={form.hex_code} onChange={set("hex_code")} style={{ width: 42, height: 36, padding: 2, border: "1px solid var(--border)", background: "transparent", cursor: "pointer" }} />
                <input className="adm-input adm-input-full" value={form.hex_code} onChange={set("hex_code")} placeholder="#FF0000" maxLength={7} />
              </div>
            </div>
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
