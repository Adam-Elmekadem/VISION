"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi, AdminProduct, AdminCategory, AdminColor, AdminSize } from "@/lib/admin-api";

interface Props { initial?: AdminProduct; }

const COLLECTIONS = ["", "eclipse", "static", "orbit"];
const INP = "bg-surface border border-border text-text font-space text-[12px] px-3 py-2 outline-none focus:border-orange transition-colors w-full";
const LBL = "block font-space text-[10px] font-semibold tracking-[0.16em] uppercase text-muted mb-1.5";
const CARD_TITLE = "font-space text-[11px] font-bold tracking-[0.22em] uppercase text-muted mb-4";

function FG({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col mb-4 last:mb-0">{children}</div>;
}
function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <label className="flex items-center justify-between py-2 cursor-pointer">
      <span className={LBL} style={{ margin: 0, cursor: "pointer" }}>{label}</span>
      <button
        type="button" role="switch" aria-checked={on} onClick={onToggle}
        className={`relative inline-flex w-9 h-5 rounded-full border transition-colors shrink-0 ${on ? "bg-orange border-orange" : "bg-transparent border-border"}`}
      >
        <span className={`absolute top-[3px] left-[3px] w-[14px] h-[14px] rounded-full transition-transform ${on ? "translate-x-4 bg-[#0d0d0d]" : "translate-x-0 bg-white/40"}`} />
      </button>
    </label>
  );
}

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
  const [selectedSizes,  setSelectedSizes]  = useState<number[]>(initial?.sizes?.map((s) => s.id) ?? []);

  useEffect(() => {
    Promise.all([adminApi.categories(), adminApi.colors(), adminApi.sizes()])
      .then(([cats, cols, szs]) => { setCategories(cats); setColors(cols); setSizes(szs); });
  }, []);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));
  const toggle = (key: string) => () => setForm((f) => ({ ...f, [key]: !f[key as keyof typeof f] }));
  const toggleColor = (id: number) => setSelectedColors((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const toggleSize  = (id: number) => setSelectedSizes((p)  => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const payload = {
        ...form,
        price:         parseFloat(form.price),
        compare_price: form.compare_price ? parseFloat(form.compare_price) : undefined,
        stock:         parseInt(form.stock, 10),
        category_id:   form.category_id ? parseInt(form.category_id, 10) : undefined,
        images:        form.images.split("\n").map((u) => u.trim()).filter(Boolean),
        color_ids:     selectedColors,
        size_ids:      selectedSizes,
      };
      if (initial) { await adminApi.updateProduct(initial.id, payload); }
      else         { await adminApi.createProduct(payload); }
      router.push("/admin/products");
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Save failed"); }
    finally { setSaving(false); }
  };

  const pillBase = "flex items-center gap-1.5 px-2.5 py-1.5 border font-space text-[10px] font-semibold tracking-[0.08em] cursor-pointer transition-colors bg-transparent";

  return (
    <form className="grid grid-cols-[1fr_270px] gap-5 items-start" onSubmit={submit}>
      {error && <p className="col-span-full px-4 py-3 bg-red-500/10 border border-red-500/30 text-[#f87171] font-space text-xs">{error}</p>}

      {/* Left */}
      <div className="flex flex-col gap-5">
        <div className="bg-surface border border-border p-6">
          <h2 className={CARD_TITLE}>Basic Info</h2>
          <FG><label className={LBL}>Name *</label><input className={INP} required value={form.name} onChange={set("name")} /></FG>
          <div className="grid grid-cols-2 gap-4">
            <FG><label className={LBL}>Price (MAD) *</label><input className={INP} type="number" min="0" step="0.01" required value={form.price} onChange={set("price")} /></FG>
            <FG><label className={LBL}>Compare Price</label><input className={INP} type="number" min="0" step="0.01" value={form.compare_price} onChange={set("compare_price")} /></FG>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FG><label className={LBL}>SKU</label><input className={INP} value={form.sku} onChange={set("sku")} /></FG>
            <FG><label className={LBL}>Stock *</label><input className={INP} type="number" min="0" required value={form.stock} onChange={set("stock")} /></FG>
          </div>
          <FG><label className={LBL}>Short Description</label><input className={INP} value={form.short_description} onChange={set("short_description")} /></FG>
          <FG><label className={LBL}>Description</label><textarea className={`${INP} resize-y`} rows={5} value={form.description} onChange={set("description")} /></FG>
        </div>

        <div className="bg-surface border border-border p-6">
          <h2 className={CARD_TITLE}>Images</h2>
          <FG><label className={LBL}>Cover Image URL</label><input className={INP} value={form.cover_image} onChange={set("cover_image")} placeholder="https://res.cloudinary.com/…" /></FG>
          <FG><label className={LBL}>Gallery URLs (one per line)</label><textarea className={`${INP} resize-y`} rows={5} value={form.images} onChange={set("images")} placeholder={"https://res.cloudinary.com/…\nhttps://res.cloudinary.com/…"} /></FG>
        </div>

        <div className="bg-surface border border-border p-6">
          <h2 className={CARD_TITLE}>SEO</h2>
          <FG><label className={LBL}>Meta Title</label><input className={INP} value={form.meta_title} onChange={set("meta_title")} /></FG>
          <FG><label className={LBL}>Meta Description</label><textarea className={`${INP} resize-y`} rows={3} value={form.meta_description} onChange={set("meta_description")} /></FG>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="flex flex-col gap-5">
        <div className="bg-surface border border-border p-5">
          <h2 className={CARD_TITLE}>Status</h2>
          {(["is_active","is_featured","is_new","is_limited"] as const).map((key) => (
            <Toggle key={key} on={form[key] as boolean} onToggle={toggle(key)} label={key.replace("is_","").replace("_"," ")} />
          ))}
        </div>

        <div className="bg-surface border border-border p-5">
          <h2 className={CARD_TITLE}>Organisation</h2>
          <FG>
            <label className={LBL}>Category</label>
            <select className={INP} value={form.category_id} onChange={set("category_id")}>
              <option value="">None</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FG>
          <FG>
            <label className={LBL}>Collection</label>
            <select className={INP} value={form.collection_slug} onChange={set("collection_slug")}>
              {COLLECTIONS.map((c) => <option key={c} value={c}>{c || "None"}</option>)}
            </select>
          </FG>
        </div>

        <div className="bg-surface border border-border p-5">
          <h2 className={CARD_TITLE}>Colors</h2>
          <div className="flex flex-wrap gap-1.5">
            {colors.map((c) => (
              <button
                key={c.id} type="button" onClick={() => toggleColor(c.id)}
                className={`${pillBase} ${selectedColors.includes(c.id) ? "border-orange text-orange" : "border-border text-muted hover:border-text hover:text-text"}`}
              >
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: c.hex_code }} />
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border p-5">
          <h2 className={CARD_TITLE}>Sizes</h2>
          <div className="flex flex-wrap gap-1.5">
            {sizes.map((s) => (
              <button
                key={s.id} type="button" onClick={() => toggleSize(s.id)}
                className={`${pillBase} ${selectedSizes.includes(s.id) ? "border-orange text-orange" : "border-border text-muted hover:border-text hover:text-text"}`}
              >
                {s.code}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit" disabled={saving}
          className="w-full bg-orange text-[#0d0d0d] font-space text-[10px] font-bold tracking-[0.2em] uppercase py-3 border-none cursor-pointer hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {saving ? "Saving…" : initial ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
