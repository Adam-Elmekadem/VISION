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
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");
  const [coverUploading, setCoverUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [gallery, setGallery]         = useState<string[]>(initial?.images ?? []);
  const [dragOver, setDragOver]       = useState<"cover" | "gallery" | null>(null);

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
    meta_title:        initial?.meta_title ?? "",
    meta_description:  initial?.meta_description ?? "",
  });
  const [selectedColors, setSelectedColors] = useState<number[]>(initial?.colors?.map((c) => c.id) ?? []);
  const [selectedSizes,  setSelectedSizes]  = useState<number[]>(initial?.sizes?.map((s) => s.id) ?? []);

  const uploadCover = async (file: File) => {
    setCoverUploading(true);
    try { const url = await adminApi.uploadImage(file); setForm((f) => ({ ...f, cover_image: url })); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Upload failed"); }
    finally { setCoverUploading(false); }
  };

  const uploadGallery = async (files: FileList | File[]) => {
    const arr = Array.from(files).slice(0, 5 - gallery.length);
    if (!arr.length) return;
    setGalleryUploading(true);
    try {
      const urls = await Promise.all(arr.map((f) => adminApi.uploadImage(f)));
      setGallery((g) => [...g, ...urls].slice(0, 5));
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Upload failed"); }
    finally { setGalleryUploading(false); }
  };

  const onDrop = (zone: "cover" | "gallery") => (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(null);
    if (zone === "cover") { const f = e.dataTransfer.files[0]; if (f) uploadCover(f); }
    else { uploadGallery(e.dataTransfer.files); }
  };

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
        images:        gallery,
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

          {/* Cover image */}
          <div className="mb-5">
            <label className={LBL}>Cover Image</label>
            <div
              className={`relative border-2 border-dashed transition-colors ${dragOver === "cover" ? "border-orange bg-orange/5" : "border-border"} ${form.cover_image ? "" : "p-6 flex flex-col items-center justify-center gap-2 cursor-pointer"}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver("cover"); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={onDrop("cover")}
              onClick={() => { if (!form.cover_image) document.getElementById("cover-input")?.click(); }}
            >
              <input id="cover-input" type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCover(f); e.target.value = ""; }} />
              {coverUploading ? (
                <div className="flex flex-col items-center gap-2 py-6">
                  <div className="w-6 h-6 rounded-full border-2 border-border border-t-orange animate-spin" />
                  <span className="font-space text-[10px] text-muted">Uploading…</span>
                </div>
              ) : form.cover_image ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.cover_image} alt="Cover" className="w-full h-48 object-cover" />
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <button type="button" onClick={(e) => { e.stopPropagation(); document.getElementById("cover-input")?.click(); }}
                      className="bg-black/70 text-white font-space text-[9px] font-bold tracking-[0.1em] uppercase px-2.5 py-1.5 hover:bg-orange hover:text-[#0d0d0d] transition-colors">
                      Change
                    </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setForm((f) => ({ ...f, cover_image: "" })); }}
                      className="bg-black/70 text-[#f87171] font-space text-[9px] font-bold tracking-[0.1em] uppercase px-2.5 py-1.5 hover:bg-red-500/20 transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-muted">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="font-space text-[11px] text-muted text-center">Drop image here or <span className="text-orange">click to browse</span></p>
                  <p className="font-space text-[10px] text-muted/60">JPG, PNG, WebP — max 8 MB</p>
                </>
              )}
            </div>
          </div>

          {/* Gallery */}
          <div>
            <label className={LBL}>Gallery <span className="normal-case font-normal text-muted/60">(up to 5)</span></label>
            <div className="grid grid-cols-3 gap-2">
              {gallery.map((url, i) => (
                <div key={url} className="relative aspect-square bg-white/[0.04]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setGallery((g) => g.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-white flex items-center justify-center hover:bg-red-500/80 transition-colors text-[11px] leading-none">
                    ×
                  </button>
                </div>
              ))}
              {gallery.length < 5 && (
                <div
                  className={`aspect-square border-2 border-dashed transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer ${dragOver === "gallery" ? "border-orange bg-orange/5" : "border-border hover:border-text/40"}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver("gallery"); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={onDrop("gallery")}
                  onClick={() => document.getElementById("gallery-input")?.click()}
                >
                  <input id="gallery-input" type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files) { uploadGallery(e.target.files); e.target.value = ""; }}} />
                  {galleryUploading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-border border-t-orange animate-spin" />
                  ) : (
                    <>
                      <span className="font-space text-xl text-muted leading-none">+</span>
                      <span className="font-space text-[9px] text-muted/70">Add</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
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
