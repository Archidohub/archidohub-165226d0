// ============================================================
// ARCHIDOHUB — SITE SETTINGS
// Edit the values below to update text, links and the logo
// across the whole website. No other files need to change.
// ============================================================

// The logo file. To replace the logo: upload your new image and
// point logoUrl at it (any public URL works too).
import logoAsset from "@/assets/archidohub-logo.png.asset.json";
import heroImage from "@/assets/hero.jpg";

export interface Review {
  name: string;
  location: string;
  rating: number;
  text: string;
}

export const siteConfig = {
  brandName: "ArchidoHub",
  logoUrl: logoAsset.url,
  websiteUrl: "https://archidohub.myshopify.com",

  // Social handles (shown in footer + Instagram section)
  instagramUsername: "ArchidoHub",
  facebookUsername: "ArchidoHub",

  // Top announcement bar
  announcementText: "✨ Trending finds. Everyday prices.",

  // Hero section
  heroHeading: "Things you'll want to own.",
  heroDescription:
    "Discover trending products, aesthetic finds and everyday essentials.",
  heroCtaPrimary: { label: "Shop Trending", href: "/shop?filter=trending" },
  heroCtaSecondary: { label: "Explore All", href: "/shop" },
  heroImageUrl: heroImage,

  // Big promo banner (below Best Sellers on the home page)
  promoBanner: {
    heading: "Your next obsession is here.",
    subtext: "New viral drops land every week.",
    ctaLabel: "Shop Now",
    href: "/shop?filter=viral",
  },

  // Newsletter section
  newsletter: {
    heading: "Get the good stuff first.",
    description: "Drops, restocks and secret discounts — straight to your inbox.",
    ctaLabel: "Subscribe",
  },

  // "Why people shop with us" section
  usps: [
    { icon: "flame", title: "Trending products", text: "Viral finds, curated weekly." },
    { icon: "zap", title: "Easy ordering", text: "Two taps from cart to checkout." },
    { icon: "shield", title: "Secure checkout", text: "Payments powered by Cashfree." },
    { icon: "message", title: "Customer support", text: "Real humans, quick replies." },
  ],

  // Customer reviews.
  // NOTE: these are editable placeholders — replace them with real
  // customer reviews before claiming they are genuine.
  reviews: [
    {
      name: "Ananya S.",
      location: "Mumbai",
      rating: 5,
      text: "Ordered the phone charm and a lip oil — arrived fast, packaging was so cute. Already planning my next order.",
    },
    {
      name: "Rohan K.",
      location: "Bengaluru",
      rating: 5,
      text: "The mini speaker is legit. Sound quality for the price is unreal.",
    },
    {
      name: "Zoya M.",
      location: "Delhi",
      rating: 4,
      text: "Found things here I'd only seen on my Pinterest board. Checkout was smooth.",
    },
    {
      name: "Kabir T.",
      location: "Pune",
      rating: 5,
      text: "Support replied in minutes when I changed my address. Zero stress.",
    },
  ] satisfies Review[],

  // Contact
  contactEmail: "hello@archidohub.com",

  // Currency (Cashfree checkout charges in this currency)
  currency: { code: "INR", symbol: "₹" },

  // Free shipping threshold shown on cart / checkout
  freeShippingAbove: 499,
};

export type SiteConfig = typeof siteConfig;
