// ============================================================
// ARCHIDOHUB — CATEGORIES & MOODS
// Moods power the "Shop by Mood" tiles on the home page.
// `filter` is the shop-page filter each tile links to.
// ============================================================

export interface Mood {
  id: string;
  emoji: string;
  title: string;
  description: string;
  gradient: string; // tailwind gradient classes for the tile
  filter: string;
}

export const moods: Mood[] = [
  {
    id: "aesthetic",
    emoji: "✨",
    title: "Aesthetic Finds",
    description: "Soft, dreamy, Pinterest-core picks",
    gradient: "from-brand-blue/25 via-accent to-brand-pink/25",
    filter: "aesthetic",
  },
  {
    id: "viral",
    emoji: "🔥",
    title: "Viral Products",
    description: "The things everyone's posting",
    gradient: "from-brand-pink/30 via-accent to-brand-violet/20",
    filter: "viral",
  },
  {
    id: "home",
    emoji: "🏠",
    title: "Home & Living",
    description: "Cozy corners and soft lighting",
    gradient: "from-brand-violet/20 via-accent to-brand-blue/20",
    filter: "Home & Living",
  },
  {
    id: "tech",
    emoji: "🎧",
    title: "Tech & Gadgets",
    description: "Small gear, big upgrade",
    gradient: "from-brand-blue/30 via-accent to-brand-violet/25",
    filter: "Tech & Gadgets",
  },
  {
    id: "fashion",
    emoji: "👕",
    title: "Fashion",
    description: "Accessories that finish the fit",
    gradient: "from-brand-pink/25 via-accent to-brand-blue/25",
    filter: "Fashion",
  },
  {
    id: "gifts",
    emoji: "🎁",
    title: "Gifts",
    description: "Under-₹999, guaranteed smiles",
    gradient: "from-brand-violet/25 via-accent to-brand-pink/25",
    filter: "Gifts",
  },
];

// Product categories (used in the shop filter + product cards)
export const categories = [
  "Fashion",
  "Tech & Gadgets",
  "Home & Living",
  "Beauty & Lifestyle",
  "Gifts",
] as const;

export type Category = (typeof categories)[number];

// Shop-page quick filters (besides categories)
export const quickFilters = [
  { id: "trending", label: "Trending Now" },
  { id: "new", label: "New Arrivals" },
  { id: "viral", label: "Viral Products" },
  { id: "aesthetic", label: "Aesthetic Finds" },
] as const;
