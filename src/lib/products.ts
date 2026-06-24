export type LensType = "clear" | "uv400" | "blue-light" | "photochromic" | "mirrored";
export type Material = "titanium" | "acetate" | "stainless-steel" | "carbon-fiber" | "bio-nylon";
export type FrameShape = "rectangle" | "oval" | "round" | "cat-eye" | "hexagon" | "shield";
export type Gender = "unisex" | "men" | "women";

export interface ProductColor {
  name: string;
  hex: string;
  frameImage: string;
}

export interface ProductSize {
  label: "XS" | "S" | "M" | "L" | "XL";
  bridge: number;   // mm
  lens: number;     // mm
  temple: number;   // mm
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  collection: string;
  collectionSlug: string;
  tagline: string;
  description: string;
  price: number;
  category: "eyeglasses" | "sunglasses";
  shape: FrameShape;
  material: Material;
  gender: Gender;
  lensTypes: LensType[];
  colors: ProductColor[];
  sizes: ProductSize[];
  images: string[];
  coverImage: string;
  isNew: boolean;
  isBestseller: boolean;
  isLimited: boolean;
  stock: number;
  tags: string[];
}

export interface Collection {
  slug: string;
  name: string;
  season: string;
  year: string;
  tagline: string;
  description: string;
  coverImage: string;
  accentColor: string;
  productSlugs: string[];
}

// ─── Unsplash image helpers ───────────────────────────────────────────────────
const unsplash = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

// ─── Products ─────────────────────────────────────────────────────────────────
export const products: Product[] = [
  {
    id: "001",
    slug: "phantom-i",
    name: "Phantom I",
    collection: "Eclipse",
    collectionSlug: "eclipse",
    tagline: "Disappear into clarity.",
    description:
      "Ultra-thin titanium frames with a rectangular silhouette. Anti-reflective coating, flex hinges, and available in three darkfield finishes.",
    price: 320,
    category: "eyeglasses",
    shape: "rectangle",
    material: "titanium",
    gender: "unisex",
    lensTypes: ["clear", "blue-light", "photochromic"],
    colors: [
      { name: "Void Black",   hex: "#0A0A0A", frameImage: unsplash("photo-1574258495973-f010dfbb5371") },
      { name: "Burnt Chrome", hex: "#8A7A6E", frameImage: unsplash("photo-1508296695527-9b57e44e49e5") },
      { name: "Deep Cobalt",  hex: "#1B2A4A", frameImage: unsplash("photo-1511499767150-a48a237f0083") },
    ],
    sizes: [
      { label: "S", bridge: 16, lens: 50, temple: 140 },
      { label: "M", bridge: 17, lens: 52, temple: 145 },
      { label: "L", bridge: 18, lens: 54, temple: 150 },
    ],
    images: [
      unsplash("photo-1574258495973-f010dfbb5371", 1200),
      unsplash("photo-1508296695527-9b57e44e49e5", 1200),
      unsplash("photo-1511499767150-a48a237f0083", 1200),
    ],
    coverImage: unsplash("photo-1574258495973-f010dfbb5371", 1200),
    isNew: true,
    isBestseller: false,
    isLimited: false,
    stock: 24,
    tags: ["titanium", "rectangle", "new", "eclipse"],
  },
  {
    id: "002",
    slug: "noir-ii",
    name: "Noir II",
    collection: "Eclipse",
    collectionSlug: "eclipse",
    tagline: "Absolute black. Absolute presence.",
    description:
      "Matte black acetate with a wide hexagonal frame. Bold enough to define your face, light enough to forget you're wearing them.",
    price: 280,
    category: "sunglasses",
    shape: "hexagon",
    material: "acetate",
    gender: "unisex",
    lensTypes: ["uv400", "mirrored"],
    colors: [
      { name: "Matte Noir",  hex: "#111111", frameImage: unsplash("photo-1511499767150-a48a237f0083") },
      { name: "Rust",        hex: "#8B2500", frameImage: unsplash("photo-1556306535-0f09a537f0a3") },
    ],
    sizes: [
      { label: "M", bridge: 18, lens: 55, temple: 145 },
      { label: "L", bridge: 20, lens: 58, temple: 150 },
    ],
    images: [
      unsplash("photo-1511499767150-a48a237f0083", 1200),
      unsplash("photo-1556306535-0f09a537f0a3", 1200),
    ],
    coverImage: unsplash("photo-1511499767150-a48a237f0083", 1200),
    isNew: true,
    isBestseller: true,
    isLimited: false,
    stock: 18,
    tags: ["acetate", "hexagon", "sunglasses", "bestseller"],
  },
  {
    id: "003",
    slug: "eclipse",
    name: "Eclipse",
    collection: "Eclipse",
    collectionSlug: "eclipse",
    tagline: "When light meets shadow.",
    description:
      "Two-tone stainless steel shield frame. Photochromic lenses that shift from light amber indoors to deep smoke in sunlight.",
    price: 350,
    category: "sunglasses",
    shape: "shield",
    material: "stainless-steel",
    gender: "unisex",
    lensTypes: ["photochromic", "uv400"],
    colors: [
      { name: "Solar Flare", hex: "#FF4D00", frameImage: unsplash("photo-1508296695527-9b57e44e49e5") },
      { name: "Lunar Grey",  hex: "#444444", frameImage: unsplash("photo-1574258495973-f010dfbb5371") },
    ],
    sizes: [
      { label: "L",  bridge: 20, lens: 60, temple: 150 },
      { label: "XL", bridge: 22, lens: 62, temple: 155 },
    ],
    images: [
      unsplash("photo-1508296695527-9b57e44e49e5", 1200),
      unsplash("photo-1574258495973-f010dfbb5371", 1200),
    ],
    coverImage: unsplash("photo-1508296695527-9b57e44e49e5", 1200),
    isNew: true,
    isBestseller: false,
    isLimited: true,
    stock: 6,
    tags: ["shield", "limited", "photochromic", "eclipse"],
  },
  {
    id: "004",
    slug: "vector-01",
    name: "Vector 01",
    collection: "Static",
    collectionSlug: "static",
    tagline: "Engineered for motion.",
    description:
      "Carbon-fiber temples meet a lightweight stainless bridge. Built for those who never stop moving.",
    price: 195,
    category: "eyeglasses",
    shape: "rectangle",
    material: "carbon-fiber",
    gender: "men",
    lensTypes: ["clear", "blue-light"],
    colors: [
      { name: "Carbon",    hex: "#1C1C1C", frameImage: unsplash("photo-1556306535-0f09a537f0a3") },
      { name: "Gunmetal",  hex: "#4A4A4A", frameImage: unsplash("photo-1509695507497-903c140c43b0") },
    ],
    sizes: [
      { label: "S", bridge: 15, lens: 49, temple: 138 },
      { label: "M", bridge: 16, lens: 51, temple: 142 },
      { label: "L", bridge: 17, lens: 53, temple: 146 },
    ],
    images: [
      unsplash("photo-1556306535-0f09a537f0a3", 1200),
      unsplash("photo-1509695507497-903c140c43b0", 1200),
    ],
    coverImage: unsplash("photo-1556306535-0f09a537f0a3", 1200),
    isNew: true,
    isBestseller: false,
    isLimited: false,
    stock: 32,
    tags: ["carbon-fiber", "rectangle", "new", "static"],
  },
  {
    id: "005",
    slug: "chrome-rx",
    name: "Chrome RX",
    collection: "Static",
    collectionSlug: "static",
    tagline: "Prescription meets precision.",
    description:
      "Prescription-ready stainless steel with a slim oval frame. Mirror-finish temples catch every angle of light.",
    price: 240,
    category: "eyeglasses",
    shape: "oval",
    material: "stainless-steel",
    gender: "unisex",
    lensTypes: ["clear", "blue-light", "photochromic"],
    colors: [
      { name: "Mirror",       hex: "#C0C0C0", frameImage: unsplash("photo-1582142839970-2b9e4c78f11d") },
      { name: "Rose Chrome",  hex: "#B76E79", frameImage: unsplash("photo-1624204386084-79974a9d89b6") },
    ],
    sizes: [
      { label: "XS", bridge: 14, lens: 47, temple: 135 },
      { label: "S",  bridge: 15, lens: 49, temple: 138 },
      { label: "M",  bridge: 16, lens: 51, temple: 142 },
    ],
    images: [
      unsplash("photo-1582142839970-2b9e4c78f11d", 1200),
      unsplash("photo-1624204386084-79974a9d89b6", 1200),
    ],
    coverImage: unsplash("photo-1582142839970-2b9e4c78f11d", 1200),
    isNew: true,
    isBestseller: false,
    isLimited: false,
    stock: 20,
    tags: ["stainless-steel", "oval", "prescription", "static"],
  },
  {
    id: "006",
    slug: "aura-slim",
    name: "Aura Slim",
    collection: "Orbit",
    collectionSlug: "orbit",
    tagline: "Light as air, sharp as focus.",
    description:
      "Bio-nylon cat-eye with feather-weight temples. Our thinnest frame ever — 1.2mm at the rim.",
    price: 175,
    category: "eyeglasses",
    shape: "cat-eye",
    material: "bio-nylon",
    gender: "women",
    lensTypes: ["clear", "blue-light"],
    colors: [
      { name: "Obsidian",    hex: "#1A1A2E", frameImage: unsplash("photo-1624204386084-79974a9d89b6") },
      { name: "Ivory Mist",  hex: "#E8E4DC", frameImage: unsplash("photo-1577744486770-020ab432da65") },
      { name: "Ember",       hex: "#CC4400", frameImage: unsplash("photo-1582142839970-2b9e4c78f11d") },
    ],
    sizes: [
      { label: "XS", bridge: 13, lens: 46, temple: 133 },
      { label: "S",  bridge: 14, lens: 48, temple: 136 },
      { label: "M",  bridge: 15, lens: 50, temple: 140 },
    ],
    images: [
      unsplash("photo-1624204386084-79974a9d89b6", 1200),
      unsplash("photo-1577744486770-020ab432da65", 1200),
    ],
    coverImage: unsplash("photo-1624204386084-79974a9d89b6", 1200),
    isNew: false,
    isBestseller: true,
    isLimited: false,
    stock: 41,
    tags: ["cat-eye", "bio-nylon", "slim", "women", "orbit"],
  },
  {
    id: "007",
    slug: "hex-noir",
    name: "Hex Noir",
    collection: "Orbit",
    collectionSlug: "orbit",
    tagline: "Six sides. Zero compromises.",
    description:
      "Architectural hexagonal frames in high-density acetate. The frame that people ask about first.",
    price: 290,
    category: "sunglasses",
    shape: "hexagon",
    material: "acetate",
    gender: "unisex",
    lensTypes: ["uv400", "mirrored", "photochromic"],
    colors: [
      { name: "Noir",         hex: "#0D0D0D", frameImage: unsplash("photo-1577744486770-020ab432da65") },
      { name: "Cognac",       hex: "#6B3A2A", frameImage: unsplash("photo-1509695507497-903c140c43b0") },
      { name: "Arctic Smoke", hex: "#BCC5CE", frameImage: unsplash("photo-1556306535-0f09a537f0a3") },
    ],
    sizes: [
      { label: "S", bridge: 17, lens: 52, temple: 143 },
      { label: "M", bridge: 18, lens: 54, temple: 147 },
      { label: "L", bridge: 19, lens: 56, temple: 151 },
    ],
    images: [
      unsplash("photo-1577744486770-020ab432da65", 1200),
      unsplash("photo-1509695507497-903c140c43b0", 1200),
    ],
    coverImage: unsplash("photo-1577744486770-020ab432da65", 1200),
    isNew: true,
    isBestseller: false,
    isLimited: false,
    stock: 15,
    tags: ["hexagon", "acetate", "sunglasses", "orbit"],
  },
  {
    id: "008",
    slug: "frequency",
    name: "Frequency",
    collection: "Static",
    collectionSlug: "static",
    tagline: "Tuned to a different signal.",
    description:
      "Round titanium frames with mirrored lenses that shift colour at different angles. A limited collector's piece.",
    price: 410,
    category: "sunglasses",
    shape: "round",
    material: "titanium",
    gender: "unisex",
    lensTypes: ["mirrored", "uv400"],
    colors: [
      { name: "Spectrum",  hex: "#4A0080", frameImage: unsplash("photo-1511499767150-a48a237f0083") },
      { name: "Gold Haze", hex: "#B8860B", frameImage: unsplash("photo-1574258495973-f010dfbb5371") },
    ],
    sizes: [
      { label: "S", bridge: 16, lens: 48, temple: 140 },
      { label: "M", bridge: 17, lens: 50, temple: 144 },
    ],
    images: [
      unsplash("photo-1511499767150-a48a237f0083", 1200),
      unsplash("photo-1574258495973-f010dfbb5371", 1200),
    ],
    coverImage: unsplash("photo-1511499767150-a48a237f0083", 1200),
    isNew: false,
    isBestseller: false,
    isLimited: true,
    stock: 4,
    tags: ["titanium", "round", "limited", "mirrored", "static"],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getProductsByCollection = (collectionSlug: string) =>
  products.filter((p) => p.collectionSlug === collectionSlug);

export const getFeaturedProducts = () =>
  products.filter((p) => p.isNew || p.isBestseller).slice(0, 3);

export const getNewArrivals = () =>
  products.filter((p) => p.isNew).slice(0, 4);
