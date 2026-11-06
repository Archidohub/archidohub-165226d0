import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, Instagram, MessageCircle, ShieldCheck, Star, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { siteConfig } from "@/data/site-config";
import { products } from "@/data/products";
import { moods } from "@/data/categories";
import { ProductCard, ProductRail, SectionHeading } from "@/components/store/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ArchidoHub — Trending finds, everyday prices" },
      { name: "description", content: "Shop viral gadgets, aesthetic home decor, fashion accessories, beauty and gifts at ArchidoHub." },
      { property: "og:title", content: "ArchidoHub — Trending finds, everyday prices" },
      { property: "og:description", content: "Viral gadgets, aesthetic home decor, fashion accessories, beauty and gifts." },
    ],
  }),
  component: Home,
});

const uspIcons = { flame: Flame, zap: Zap, shield: ShieldCheck, message: MessageCircle } as const;

function Home() {
  const trending = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 4);
  const newest = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  const best = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-5">
      {/* HERO */}
      <section className="grid items-center gap-10 py-10 md:grid-cols-2 md:py-16">
        <div className="rise-in">
          <p className="mb-4 inline-flex rounded-full border bg-card px-4 py-1.5 text-xs font-semibold">🔥 New drops every week</p>
          <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
            {siteConfig.heroHeading.split(" ").slice(0, -2).join(" ")}{" "}
            <span className="text-gradient">{siteConfig.heroHeading.split(" ").slice(-2).join(" ")}</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">{siteConfig.heroDescription}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={siteConfig.heroCtaPrimary.href} className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground transition hover:gap-3">
              {siteConfig.heroCtaPrimary.label} <ArrowRight className="h-4 w-4" />
            </a>
            <a href={siteConfig.heroCtaSecondary.href} className="rounded-full border bg-card px-7 py-4 font-semibold transition hover:bg-secondary">
              {siteConfig.heroCtaSecondary.label}
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-gradient-brand opacity-20 blur-3xl" />
          <img src={siteConfig.heroImageUrl} alt="Aesthetic flat-lay of trending products" width={1024} height={1280} className="aspect-[4/5] w-full rounded-[2.5rem] object-cover shadow-2xl" />
          <div className="glass absolute bottom-5 left-5 rounded-2xl border px-4 py-3 text-sm">
            <p className="font-semibold">10k+ happy carts</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground"><Star className="h-3 w-3 fill-current" /> Loved for fast delivery</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <SectionHeading eyebrow="Right now" title="Trending Now" action={<Link to="/shop" search={{ filter: "trending" }} className="text-sm font-semibold underline-offset-4 hover:underline">View all</Link>} />
        <ProductRail products={trending} />
      </section>

      {/* MOODS */}
      <section className="py-12">
        <SectionHeading eyebrow="Pick a vibe" title="Shop by Mood" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {moods.map((m, i) => (
            <Link key={m.id} to="/shop" search={{ filter: m.filter }} className={`group relative flex flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br ${m.gradient} p-5 transition hover:-translate-y-1 ${i % 3 === 0 ? "min-h-56 md:row-span-2 md:min-h-80" : "min-h-40"}`}>
              <span className="absolute right-4 top-4 text-4xl transition group-hover:scale-125 md:text-5xl">{m.emoji}</span>
              <h3 className="font-display text-xl font-bold md:text-2xl">{m.title}</h3>
              <p className="text-sm text-muted-foreground">{m.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* USPS */}
      <section className="py-12">
        <SectionHeading eyebrow="The hub difference" title="Why people shop with us" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {siteConfig.usps.map((u) => {
            const Icon = uspIcons[u.icon as keyof typeof uspIcons] ?? Flame;
            return (
              <div key={u.title} className="rounded-3xl border bg-card p-6">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground"><Icon className="h-5 w-5" /></div>
                <h3 className="font-semibold">{u.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{u.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-12">
        <SectionHeading eyebrow="Just landed" title="New Arrivals" action={<Link to="/shop" search={{ filter: "new" }} className="text-sm font-semibold hover:underline">View all</Link>} />
        <ProductRail products={newest} />
      </section>

      <section className="py-12">
        <SectionHeading eyebrow="Most loved" title="Best Sellers" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {best.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* PROMO */}
      <section className="py-12">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-16 text-center text-primary-foreground md:py-24">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-blue opacity-40 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-brand-pink opacity-40 blur-3xl" />
          <h2 className="relative font-display text-4xl font-bold tracking-tight md:text-6xl">{siteConfig.promoBanner.heading}</h2>
          <p className="relative mt-4 opacity-70">{siteConfig.promoBanner.subtext}</p>
          <a href={siteConfig.promoBanner.href} className="relative mt-8 inline-flex rounded-full bg-primary-foreground px-8 py-4 font-semibold text-primary transition hover:scale-105">{siteConfig.promoBanner.ctaLabel}</a>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-12">
        <SectionHeading eyebrow="Sample reviews" title="What shoppers say" />
        <div className="no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-4 md:px-0">
          {siteConfig.reviews.map((r) => (
            <figure key={r.name} className="w-72 shrink-0 rounded-3xl border bg-card p-6 md:w-auto">
              <div className="flex gap-0.5">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-brand-pink text-brand-pink" />)}</div>
              <blockquote className="mt-3 text-sm">"{r.text}"</blockquote>
              <figcaption className="mt-4 text-sm font-semibold">{r.name} <span className="font-normal text-muted-foreground">· {r.location}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="py-12 text-center">
        <a href={`https://instagram.com/${siteConfig.instagramUsername}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-display text-3xl font-bold md:text-4xl">
          <Instagram className="h-8 w-8" /> Follow <span className="text-gradient">@{siteConfig.instagramUsername}</span>
        </a>
        <div className="mt-8 columns-2 gap-4 md:columns-4">
          {products.slice(0, 8).map((p, i) => (
            <img key={p.id} src={p.image} alt={p.name} loading="lazy" className={`mb-4 w-full rounded-3xl object-cover ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}`} />
          ))}
        </div>
      </section>

      <Newsletter />
    </div>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <section className="py-12">
      <div className="rounded-[2.5rem] bg-gradient-to-br from-brand-blue/15 via-accent to-brand-pink/20 px-6 py-14 text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight">{siteConfig.newsletter.heading}</h2>
        <p className="mt-3 text-muted-foreground">{siteConfig.newsletter.description}</p>
        <form
          className="mx-auto mt-8 flex max-w-md gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("You're on the list ✨");
            setEmail("");
          }}
        >
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" aria-label="Email address" className="flex-1 rounded-full border bg-card px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">{siteConfig.newsletter.ctaLabel}</button>
        </form>
      </div>
    </section>
  );
}
