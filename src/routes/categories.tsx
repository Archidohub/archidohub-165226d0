import { createFileRoute, Link } from "@tanstack/react-router";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — ArchidoHub" },
      { name: "description", content: "Fashion, tech, home, beauty and gifts — shop ArchidoHub by category." },
      { property: "og:title", content: "Categories — ArchidoHub" },
      { property: "og:description", content: "Fashion, tech, home, beauty and gifts." },
    ],
  }),
  component: Categories,
});

function Categories() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <h1 className="font-display text-5xl font-bold tracking-tight">Categories</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const items = products.filter((p) => p.category === c);
          const cover = items[0]?.image;
          return (
            <Link key={c} to="/shop" search={{ filter: c }} className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-secondary">
              {cover && <img src={cover} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
              <div className="glass absolute inset-x-3 bottom-3 rounded-2xl border px-4 py-3">
                <p className="font-display text-lg font-bold">{c}</p>
                <p className="text-xs text-muted-foreground">{items.length} items</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
