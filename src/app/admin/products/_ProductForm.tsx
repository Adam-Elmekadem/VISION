"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi, AdminProduct, AdminCategory, AdminColor, AdminSize } from "@/lib/admin-api";

interface Props {
  initial?: AdminProduct;
}

const COLLECTIONS = ["", "eclipse", "static", "orbit"];

export default function ProductForm({ initial }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [colors, setColors]         = useState<AdminColor[]>([]);
  const [sizes, setSizes]           = useState<AdminSize[]>([]);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState("");

  const [form, setForm] = useState({
    name:              initial?.name ?? "",
    short_description: initial?.short_description ?? "",
    description:       initial?.description ?? "",
    price:             initial ? String(parseFloat(initial.price)) : "",
    compare_price:     initial?.compare_price ? String(parseFloat(initial.compare_price)) : "",
    sku:               initial?.sku ?? "",
    stock:             initial ? String(initial.stock) : "0",
    category_id:       initial?.category_id ? String(initial.category_id) : "",
    collection_slug:   initial?.collection_slug ?? "",
    is_active:         initial?.is_active ?? true,
    is_featured:       initial?.is_featured ?? false,
    is_new:            initial?.is_new ?? false,
    is_limited:        initial?.is_limited ?? false,
    cover_image:       initial?.cover_image ?? "",
    images:            (initial?.images ?? []).join("\n"),
    meta_title:        initial?.meta_title ?? "",
    meta_description:  initial?.meta_description ?? "",
  });
  const [selectedColors, setSelectedColors] = useState<number[]>(initial?.colors?.map((c) => c.id) ?? []);
  const [selectedSizes, setSelectedSizes]   = useState<number[]>(initial?.sizes?.map((s) => s.id) ?? []);

  useEffect(() => {
    Promise.all([adminApi.categories(), adminApi.colors(), adminApi.sizes()])
      .then(([cats, cols, szs]) => { setCategories(cats); setColors(cols); setSizes(szs); });
  }, []);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));
  const toggle = (key: string) => () => setForm((f) => ({ ...f, [key]: !f[key as keyof typeof f] }));

  const toggleColor = (id: number) =>
    setSelectedColors((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const toggleSize = (id: number) =>
    setSelectedSizes((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        price:       parseFloat(form.price),
        compare_price: form.compare_price ? parseFloat(form.compare_price) : undefined,
        stock:       parseInt(form.stock, 10),
        category_id: form.category_id ? parseInt(form.category_id, 10) : undefined,
        images:      form.images.split("\n").map((u) => u.trim()).filter(Boolean),
        color_ids:   selectedColors,
        size_ids:    selectedSizes,
      };
      if (initial) {
        await adminApi.updateProduct(initial.id, payload);
      } else {
        await adminApi.createProduct(payload);
      }
      router.push("/admin/products");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="adm-two-col" onSubmit={submit}>
      {error && <p className="adm-error" style={{ gridColumn: "1 / -1" }}>{error}</p>}

      {/* Left — main fields */}
      <div className="adm-col-main">
        <div className="adm-card">
          <h2 className="adm-card-title">Basic Info</h2>
          <div className="adm-form-group">
            <label className="adm-label">Name *</label>
            <input className="adm-input adm-input-full" required value={form.name} onChange={set("name")} />
          </div>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label className="adm-label">Price (MAD) *</label>
              <input className="adm-input adm-input-full" type="number" min="0" step="0.01" required value={form.price} onChange={set("price")} />
            </div>
            <div className="adm-form-group">
              <label className="adm-label">Compare Price</label>
              <input className="adm-input adm-input-full" type="number" min="0" step="0.01" value={form.compare_price} onChange={set("compare_price")} />
            </div>
          </div>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label className="adm-label">SKU</label>
              <input className="adm-input adm-input-full" value={form.sku} onChange={set("sku")} />
            </div>
            <div className="adm-form-group">
              <label className="adm-label">Stock *</label>
              <input className="adm-input adm-input-full" type="number" min="0" required value={form.stock} onChange={set("stock")} />
            </div>
          </div>
          <div className="adm-form-group">
            <label className="adm-label">Short Description</label>
            <input className="adm-input adm-input-full" value={form.short_description} onChange={set("short_description")} />
          </div>
          <div className="adm-form-group">
            <label className="adm-label">Description</label>
            <textarea className="adm-textarea" rows={5} value={form.description} onChange={set("description")} />
          </div>
        </div>

        <div className="adm-card">
          <h2 className="adm-card-title">Images</h2>
          <div className="adm-form-group">
            <label className="adm-label">Cover Image URL</label>
            <input className="adm-input adm-input-full" value={form.cover_image} onChange={set("cover_image")} placeholder="https://res.cloudinary.com/…" />
          </div>
          <div className="adm-form-group">
            <label className="adm-label">Gallery Image URLs (one per line, max 5)</label>
            <textarea className="adm-textarea" rows={5} value={form.images} onChange={set("images")} placeholder={"https://res.cloudinary.com/…\nhttps://res.cloudinary.com/…"} />
          </div>
        </div>

        <div className="adm-card">
          <h2 className="adm-card-title">SEO</h2>
          <div className="adm-form-group">
            <label className="adm-label">Meta Title</label>
            <input className="adm-input adm-input-full" value={form.meta_title} onChange={set("meta_title")} />
          </div>
          <div className="adm-form-group">
            <label className="adm-label">Meta Description</label>
            <textarea className="adm-textarea" rows={3} value={form.meta_description} onChange={set("meta_description")} />
          </div>
        </div>
      </div>

      {/* Right — sidebar fields */}
      <div className="adm-col-side">
        <div className="adm-card">
          <h2 className="adm-card-title">Status</h2>
          {(["is_active","is_featured","is_new","is_limited"] as const).map((key) => (
            <label key={key} className="adm-toggle-row">
              <span className="adm-label" style={{ margin: 0 }}>{key.replace("is_", "").replace("_", " ")}</span>
              <button
                type="button"
                role="switch"
                aria-checked={form[key] as boolean}
                className={`adm-toggle ${form[key] ? "on" : ""}`}
                onClick={toggle(key)}
              />
            </label>
          ))}
        </div>

        <div className="adm-card">
          <h2 className="adm-card-title">Organisation</h2>
          <div className="adm-form-group">
            <label className="adm-label">Category</label>
            <select className="adm-select adm-select-full" value={form.category_id} onChange={set("category_id")}>
              <option value="">None</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="adm-form-group">
            <label className="adm-label">Collection</label>
            <select className="adm-select adm-select-full" value={form.collection_slug} onChange={set("collection_slug")}>
              {COLLECTIONS.map((c) => <option key={c} value={c}>{c || "None"}</option>)}
            </select>
          </div>
        </div>

        <div className="adm-card">
          <h2 className="adm-card-title">Colors</h2>
          <div className="adm-pill-grid">
            {colors.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`adm-pill ${selectedColors.includes(c.id) ? "active" : ""}`}
                onClick={() => toggleColor(c.id)}
              >
                <span className="adm-color-dot" style={{ background: c.hex_code }} />
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="adm-card">
          <h2 className="adm-card-title">Sizes</h2>
          <div className="adm-pill-grid">
            {sizes.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`adm-pill ${selectedSizes.includes(s.id) ? "active" : ""}`}
                onClick={() => toggleSize(s.id)}
              >
                {s.code}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="adm-btn-primary adm-btn-full" disabled={saving}>
          {saving ? "Saving…" : initial ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
