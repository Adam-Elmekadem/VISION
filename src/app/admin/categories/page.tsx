"use client";
import { useEffect, useState } from "react";
import { adminApi, AdminCategory } from "@/lib/admin-api";

type FormState = { name: string; description: string; image_url: string; sort_order: string; is_active: boolean };
const BLANK: FormState = { name: "", description: "", image_url: "", sort_order: "0", is_active: true };

export default function CategoriesPage() {
  const [cats, setCats]       = useState<AdminCategory[]>([]);
  const [error, setError]     = useState("");
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm]       = useState<FormState>(BLANK);
  const [saving, setSaving]   = useState(false);

  const load = () => adminApi.categories().then(setCats).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const openEdit = (c: AdminCategory) => { setEditing(c); setCreating(false); setForm({ name: c.name, description: c.description ?? "", image_url: c.image_url ?? "", sort_order: String(c.sort_order), is_active: c.is_active }); };
  const openCreate = () => { setEditing(null); setCreating(true); setForm(BLANK); };
  const close = () => { setEditing(null); setCreating(false); };

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, sort_order: parseInt(form.sort_order, 10) };
      if (editing) {
        await adminApi.updateCategory(editing.id, payload);
      } else {
        await adminApi.createCategory(payload);
      }
      close();
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await adminApi.deleteCategory(id); load(); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Delete failed"); }
  };

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Categories</h1>
          <p className="adm-page-sub">{cats.length} categories</p>
        </div>
        <button className="adm-btn-primary" onClick={openCreate} type="button">+ New Category</button>
      </div>

      {error && <p className="adm-error">{error}</p>}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr><th>Name</th><th>Slug</th><th>Products</th><th>Order</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c.id}>
                <td className="adm-item-name">{c.name}</td>
                <td className="adm-mono adm-muted">{c.slug}</td>
                <td>{c.products_count ?? 0}</td>
                <td>{c.sort_order}</td>
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

      {/* Inline form panel */}
      {(editing || creating) && (
        <div className="adm-drawer-backdrop" onClick={close}>
          <div className="adm-drawer" onClick={(e) => e.stopPropagation()}>
            <h2 className="adm-card-title">{editing ? `Edit: ${editing.name}` : "New Category"}</h2>
            <div className="adm-form-group"><label className="adm-label">Name *</label><input className="adm-input adm-input-full" required value={form.name} onChange={set("name")} /></div>
            <div className="adm-form-group"><label className="adm-label">Description</label><textarea className="adm-textarea" rows={3} value={form.description} onChange={set("description")} /></div>
            <div className="adm-form-group"><label className="adm-label">Image URL</label><input className="adm-input adm-input-full" value={form.image_url} onChange={set("image_url")} /></div>
            <div className="adm-form-row">
              <div className="adm-form-group"><label className="adm-label">Sort Order</label><input className="adm-input adm-input-full" type="number" value={form.sort_order} onChange={set("sort_order")} /></div>
              <label className="adm-toggle-row" style={{ paddingTop: 22 }}>
                <span className="adm-label" style={{ margin: 0 }}>Active</span>
                <button type="button" role="switch" aria-checked={form.is_active} className={`adm-toggle ${form.is_active ? "on" : ""}`} onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))} />
              </label>
            </div>
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
