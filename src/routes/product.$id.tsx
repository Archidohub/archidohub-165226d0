import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { Check, Heart, Minus, Plus, RotateCcw, Star, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { discountPercent, formatPrice, getProduct, products } from "@/data/products";
import { useStore } from "@/lib/store";
import { ProductCard, SectionHeading } from "@/components/store/ProductCard";
import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — ArchidoHub` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — ArchidoHub` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:type", content: "product" },
        ]
      : [{ title: "Product unavailable — ArchidoHub" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleWishlist, isWishlisted, markViewed, recentlyViewed } = useStore();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const off = discountPercent(product);
  const liked = isWishlisted(product.id);

  useEffect(() => {
    markViewed(product.id);
    setQty(1);
    setActive(0);
  }, [product.id, markViewed]);

  // Gallery: main photo plus alternate crops (add more image URLs per product later)
  const gallery = [
    { src: product.image, cls: "object-cover" },
    { src: product.image, cls: "object-cover scale-150" },
    { src: product.image, cls: "object-cover scale-125 object-top" },
  ];
  const activeImage = gallery[active] ?? { src: product.image, cls: "object-cover" };

  const related = products.filter((p) => p.id !== product.id && (p.category === product.category || p.tags.some((t) => product.tags.includes(t)))).slice(0, 4);
  const recent = recentlyViewed.filter((id) => id !== product.id).map(getProduct).filter((p): p is NonNullable<typeof p> => !!p).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-[2rem] bg-secondary">
            <img src={activeImage.src} alt={product.name} width={1024} height={1024} className={cn("h-full w-full transition duration-500", activeImage.cls)} />
          </div>
          <div className="mt-3 flex gap-3">
            {gallery.map((g, i) => (
              <button key={i} onClick={() => setActive(i)} aria-label={`Show image ${i + 1}`} className={cn("h-20 w-20 overflow-hidden rounded-2xl border-2", i === active ? "border-primary" : "border-transparent")}>
                <img src={g.src} alt="" className={cn("h-full w-full", g.cls)} loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        <div className="md:pt-4">
          <p className="text-sm font-medium text-muted-foreground">{product.category}</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Star className="h-4 w-4 fill-brand-pink text-brand-pink" /> <span className="font-semibold">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviews} ratings)</span>
          </div>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold">{formatPrice(product.price)}</span>
            {off > 0 && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                <span className="rounded-full bg-gradient-brand px-3 py-1 text-sm font-bold text-primary-foreground">{off}% off</span>
              </>
            )}
          </div>
          <p className="mt-6 text-muted-foreground">{product.description}</p>
          <ul className="mt-6 space-y-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-brand-violet" /> {f}</li>
            ))}
          </ul>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center rounded-full border bg-card">
              <button className="p-4" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
              <span className="w-8 text-center font-semibold" aria-live="polite">{qty}</span>
              <button className="p-4" onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
            </div>
            <button onClick={() => toggleWishlist(product.id)} aria-pressed={liked} aria-label="Wishlist" className="grid h-14 w-14 place-items-center rounded-full border bg-card">
              <Heart className={cn("h-5 w-5", liked && "fill-brand-pink text-brand-pink")} />
            </button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button onClick={() => addToCart(product.id, qty)} className="rounded-full border-2 border-primary py-4 font-semibold transition hover:bg-secondary">Add to Cart</button>
            <button
              onClick={() => {
                addToCart(product.id, qty);
                navigate({ to: "/checkout" });
              }}
              className="rounded-full bg-primary py-4 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Buy Now
            </button>
          </div>

          <div className="mt-8 space-y-3 rounded-3xl border bg-card p-5 text-sm">
            <p className="flex gap-3"><Truck className="h-5 w-5 shrink-0" /> <span><b>Delivery:</b> Ships in 1–2 days. Free shipping above {formatPrice(siteConfig.freeShippingAbove)}.</span></p>
            <p className="flex gap-3"><RotateCcw className="h-5 w-5 shrink-0" /> <span><b>Returns:</b> Easy returns within 7 days of delivery.</span></p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <SectionHeading title="You might also like" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}
      {recent.length > 0 && (
        <section className="mt-16">
          <SectionHeading title="Recently viewed" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{recent.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}
    </div>
  );
}
