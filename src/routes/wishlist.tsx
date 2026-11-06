import { createFileRoute, Link } from "@tanstack/react-router";
import { getProduct } from "@/data/products";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/store/ProductCard";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your wishlist — ArchidoHub" },
      { name: "description", content: "Everything you've saved at ArchidoHub." },
      { property: "og:title", content: "Your wishlist — ArchidoHub" },
      { property: "og:description", content: "Everything you've saved at ArchidoHub." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist } = useStore();
  const items = wishlist.map(getProduct).filter((p): p is NonNullable<typeof p> => !!p);
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <h1 className="font-display text-5xl font-bold tracking-tight">Wishlist</h1>
      {items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-2xl font-semibold">Nothing saved yet</p>
          <p className="mt-2 text-muted-foreground">Tap the heart on anything you love.</p>
          <Link to="/shop" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Browse the shop</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </div>
  );
}
