// ============================================================
// ARCHIDOHUB — PRODUCT CATALOG
//
// ▸ HOW TO ADD A PRODUCT
//   Copy any block below, paste it at the end of the array,
//   and change the values. `id` must be unique.
//   For the image, use any public URL — or add a new file to
//   src/assets/products/ and import it at the top like the others.
//
// ▸ HOW TO REMOVE A PRODUCT
//   Delete its whole { ... } block.
//
// ▸ HOW TO CHANGE PRICES
//   Edit `price` (current price) and `originalPrice` (the
//   struck-through price). The discount % is calculated for you.
//
// ▸ HOW TO CHANGE SORTING
//   `createdAt` (older = further back) drives "Newest";
//   `popularity` (higher = further up) drives "Trending".
// ============================================================

import p1 from "@/assets/products/p1.jpg";
import p2 from "@/assets/products/p2.jpg";
import p3 from "@/assets/products/p3.jpg";
import p4 from "@/assets/products/p4.jpg";
import p5 from "@/assets/products/p5.jpg";
import p6 from "@/assets/products/p6.jpg";
import p7 from "@/assets/products/p7.jpg";
import p8 from "@/assets/products/p8.jpg";
import p9 from "@/assets/products/p9.jpg";
import { siteConfig } from "@/data/site-config";

export interface Product {
  id: string; // unique, used in the product page URL
  name: string;
  category: string;
  price: number; // current selling price in ₹
  originalPrice: number; // struck-through price in ₹
  image: string; // main product photo
  description: string;
  features: string[];
  badge?: "Trending" | "New" | "Viral";
  tags: string[]; // used by moods + shop filters (trending, viral, new, aesthetic...)
  rating: number; // 0–5
  reviews: number;
  createdAt: string; // "YYYY-MM-DD" — drives "Newest"
  popularity: number; // 1–100 — drives "Trending"
}

export const products: Product[] = [
  {
    id: "glow-ring-light",
    name: "Glow Ring Selfie Light",
    category: "Tech & Gadgets",
    price: 499,
    originalPrice: 999,
    image: p1,
    description:
      "Soft, flattering light for every selfie and late-night call. Clips onto any phone or laptop, three glow modes, USB-C rechargeable.",
    features: ["3 glow modes (warm / natural / cool)", "USB-C rechargeable, 4-hour battery", "Fits phones & laptops", "Weighs less than 90g"],
    badge: "Trending",
    tags: ["trending", "viral", "tech", "aesthetic"],
    rating: 4.7,
    reviews: 412,
    createdAt: "2026-09-14",
    popularity: 96,
  },
  {
    id: "retro-squared-sunglasses",
    name: "Retro Squared Sunglasses",
    category: "Fashion",
    price: 399,
    originalPrice: 899,
    image: p2,
    description:
      "Slim squared frames with a soft tortoise finish. UV400 lenses, feather-light frame — the accessory that finishes every fit.",
    features: ["UV400 protection", "Feather-light TR90 frame", "Unisex fit", "Hard case included"],
    badge: "Trending",
    tags: ["trending", "fashion", "aesthetic"],
    rating: 4.6,
    reviews: 268,
    createdAt: "2026-08-30",
    popularity: 88,
  },
  {
    id: "cloud-boucle-pillow",
    name: "Cloud Boucle Throw Pillow",
    category: "Home & Living",
    price: 749,
    originalPrice: 1299,
    image: p3,
    description:
      "A cloud you can actually keep. Chunky boucle texture, plush filling, and a cover you can unzip and wash.",
    features: ["45 × 45 cm", "Removable, washable cover", "Hypoallergenic filling", "Couch + bed friendly"],
    tags: ["aesthetic", "home"],
    rating: 4.8,
    reviews: 190,
    createdAt: "2026-09-02",
    popularity: 74,
  },
  {
    id: "cherry-glass-bottle",
    name: "Cherry Glass Water Bottle · 750ml",
    category: "Home & Living",
    price: 549,
    originalPrice: 999,
    image: p4,
    description:
      "Borosilicate glass bottle with a cherry-red silicone sleeve. Your desk's main character — and it keeps water tasting like water.",
    features: ["750 ml borosilicate glass", "Anti-slip silicone sleeve", "Leak-proof bamboo lid", "Dishwasher safe (glass)"],
    badge: "Viral",
    tags: ["viral", "aesthetic", "home", "gifts"],
    rating: 4.5,
    reviews: 321,
    createdAt: "2026-09-20",
    popularity: 91,
  },
  {
    id: "pop-mini-speaker",
    name: "Pop Mini Bluetooth Speaker",
    category: "Tech & Gadgets",
    price: 1199,
    originalPrice: 1999,
    image: p5,
    description:
      "Palm-sized speaker, room-filling sound. Pairs in seconds, runs 10 hours, and looks like a piece of candy on your shelf.",
    features: ["10-hour battery", "Bluetooth 5.3, instant pairing", "Built-in mic for calls", "Strap for bags & bikes"],
    badge: "Viral",
    tags: ["viral", "tech", "gifts", "trending"],
    rating: 4.7,
    reviews: 507,
    createdAt: "2026-09-25",
    popularity: 94,
  },
  {
    id: "aurora-diffuser-lamp",
    name: "Aurora Diffuser Night Lamp",
    category: "Home & Living",
    price: 899,
    originalPrice: 1599,
    image: p6,
    description:
      "Mist, mood light and sunset colours in one. Fills your room with slow-drifting aurora light while the diffuser hums quietly.",
    features: ["300 ml ultrasonic diffuser", "7 aurora light modes", "Auto shut-off", "Whisper quiet (< 25 dB)"],
    badge: "Viral",
    tags: ["viral", "aesthetic", "home"],
    rating: 4.6,
    reviews: 233,
    createdAt: "2026-10-01",
    popularity: 85,
  },
  {
    id: "butter-lip-oil-trio",
    name: "Butter Soft Lip Oil Trio",
    category: "Beauty & Lifestyle",
    price: 399,
    originalPrice: 699,
    image: p7,
    description:
      "Three glossy, non-sticky lip oils — Cherry, Vanilla and Lychee. Sheer tint, serious hydration, zero stick.",
    features: ["3 × 6 ml", "Sheer buildable tint", "Jojoba + vitamin E", "Vegan & cruelty-free"],
    badge: "New",
    tags: ["new", "beauty", "aesthetic", "gifts"],
    rating: 4.4,
    reviews: 118,
    createdAt: "2026-10-18",
    popularity: 62,
  },
  {
    id: "y2k-beaded-phone-charm",
    name: "Y2K Beaded Phone Charm",
    category: "Gifts",
    price: 249,
    originalPrice: 499,
    image: p8,
    description:
      "Hand-strung beads in bubblegum pink and cloud blue. Fits any phone with a case hole — instant 2003 energy.",
    features: ["Hand-strung acrylic beads", "Universal case attachment", "26 cm drop length", "Anti-tangle clasp"],
    badge: "New",
    tags: ["new", "fashion", "aesthetic", "gifts"],
    rating: 4.5,
    reviews: 96,
    createdAt: "2026-10-22",
    popularity: 58,
  },
  {
    id: "blob-cable-organizers",
    name: "Blob Cable Organizers · 3-Pack",
    category: "Tech & Gadgets",
    price: 199,
    originalPrice: 399,
    image: p9,
    description:
      "Three squishy blobs that finally stop your cables from wandering. Wrap, snap, done.",
    features: ["Set of 3 (S / M / L)", "Soft-touch silicone", "Snap-wrap closure", "Fits cables up to 8 mm"],
    badge: "Trending",
    tags: ["trending", "tech", "gifts"],
    rating: 4.3,
    reviews: 154,
    createdAt: "2026-10-05",
    popularity: 79,
  },
];

// ---------- helpers (no need to edit below this line) ----------

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export interface CheckoutItemInput {
  id: string;
  qty: number;
}

export function calculateShippingFee(subtotal: number): number {
  return subtotal > siteConfig.freeShippingAbove ? 0 : siteConfig.shippingFee;
}

export function calculateCheckoutTotals(items: CheckoutItemInput[]) {
  const orderItems = items.map(({ id, qty }) => {
    const product = getProduct(id);
    if (!product) throw new Error(`Unknown product: ${id}`);
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      qty,
    };
  });
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingFee = calculateShippingFee(subtotal);
  return { items: orderItems, subtotal, shippingFee, total: subtotal + shippingFee };
}

export function discountPercent(p: Product): number {
  if (!p.originalPrice || p.originalPrice <= p.price) return 0;
  return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
}

export function formatPrice(amount: number, symbol = "₹"): string {
  return `${symbol}${amount.toLocaleString("en-IN")}`;
}
