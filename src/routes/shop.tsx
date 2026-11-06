import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";
import { products } from "@/data/products";
import { categories, quickFilters } from "@/data/categories";
import { ProductCard } from "@/components/store/ProductCard";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  q: z.string().optional(),
  filter: z.string().optional(),
  sort: z.enum(["trending", "newest", "low", "high"]).optional(),
  max: z.number().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Shop all — ArchidoHub" },
      { name: "description", content: "Browse every trending product, aesthetic find and gift at ArchidoHub." },
      { property: "og:title", content: "Shop all — ArchidoHub" },
      { property: "og:description", content: "Browse every trending product, aesthetic find and gift." },
    ],
  }),
  component: Shop,
});

const priceSteps = [299, 499, 999, 1499];

function Shop() {
  const { q, filter, sort = "trending", max } = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const set = (patch: Partial<z.infer<typeof searchSchema>>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

  const list = useMemo(() => {
    let r = products.filter((p) => {
      if (q && !`${p.name} ${p.category} ${p.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (filter && p.category !== filter && !p.tags.includes(filter)) return false;
      if (max && p.price > max) return false;
      return true;
    });
    r = [...r].sort((a, b) =>
      sort === "newest" ? b.createdAt.localeCompare(a.createdAt) : sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : b.popularity - a.popularity
    );
    return r;
  }, [q, filter, sort, max]);

  const chip = (active: boolean) => cn("shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition", active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-secondary");

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <h1 className="font-display text-5xl font-bold tracking-tight">Shop</h1>
      <input
        value={q ?? ""}
        onChange={(e) => set({ q: e.target.value || undefined })}
        placeholder="Search products…"
        aria-label="Search products"
        className="mt-6 w-full rounded-full border bg-card px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring md:max-w-md"
      />
      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto">
        <button className={chip(!filter)} onClick={() => set({ filter: undefined })}>All</button>
        {quickFilters.map((f) => <button key={f.id} className={chip(filter === f.id)} onClick={() => set({ filter: f.id })}>{f.label}</button>)}
        {categories.map((c) => <button key={c} className={chip(filter === c)} onClick={() => set({ filter: c })}>{c}</button>)}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-2">
          <span className="text-muted-foreground">Price</span>
          <select value={max ?? ""} onChange={(e) => set({ max: e.target.value ? Number(e.target.value) : undefined })} className="rounded-full border bg-card px-3 py-2">
            <option value="">Any</option>
            {priceSteps.map((p) => <option key={p} value={p}>Under ₹{p}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-muted-foreground">Sort</span>
          <select value={sort} onChange={(e) => set({ sort: e.target.value as "trending" })} className="rounded-full border bg-card px-3 py-2">
            <option value="trending">Trending</option>
            <option value="newest">Newest</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </label>
        <span className="ml-auto text-muted-foreground">{list.length} items</span>
      </div>
      {list.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-2xl font-semibold">Nothing matches that (yet)</p>
          <Link to="/shop" className="mt-4 inline-block text-sm font-semibold underline">Clear filters</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
