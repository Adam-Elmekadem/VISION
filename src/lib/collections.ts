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

const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

export const collections: Collection[] = [
  {
    slug: "eclipse",
    name: "Eclipse",
    season: "SS",
    year: "2025",
    tagline: "When light meets shadow.",
    description:
      "Our flagship 2025 collection explores the space between darkness and clarity. Every frame in Eclipse is designed to command presence in low light — titanium profiles, shield geometries, and photochromic lenses that adapt without being asked.",
    coverImage: unsplash("photo-1574258495973-f010dfbb5371"),
    accentColor: "#FF4D00",
    productSlugs: ["phantom-i", "noir-ii", "eclipse"],
  },
  {
    slug: "static",
    name: "Static",
    season: "AW",
    year: "2024",
    tagline: "Signal in the noise.",
    description:
      "Static is a study in contrast — raw carbon fibre against polished steel, matte black against mirrored chrome. Built for a world that never slows down, this collection speaks to those who find clarity in complexity.",
    coverImage: unsplash("photo-1511499767150-a48a237f0083"),
    accentColor: "#C0C0C0",
    productSlugs: ["vector-01", "chrome-rx", "frequency"],
  },
  {
    slug: "orbit",
    name: "Orbit",
    season: "SS",
    year: "2024",
    tagline: "Beyond the atmosphere.",
    description:
      "Orbit looks upward. Bio-nylon materials, architectural hexagonal cuts, and feather-weight profiles designed for those whose vision extends beyond the horizon. The lightest collection we've ever made.",
    coverImage: unsplash("photo-1508296695527-9b57e44e49e5"),
    accentColor: "#8B8BFF",
    productSlugs: ["aura-slim", "hex-noir"],
  },
];

export const getCollectionBySlug = (slug: string) =>
  collections.find((c) => c.slug === slug);
