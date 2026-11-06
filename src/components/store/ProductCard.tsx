import { Link } from "@tanstack/react-router";
import { Heart, Plus, Star } from "lucide-react";
import { discountPercent, formatPrice, type Product } from "@/data/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const off = discountPercent(product);
  const liked = isWishlisted(product.id);

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="relative block aspect-[4/5] overflow-hidden rounded-3xl bg-secondary"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-background/85 px-3 py-1 text-xs font-semibold backdrop-blur">
            {product.badge === "Viral" ? "🔥 " : product.badge === "New" ? "✨ " : "↗ "}
            {product.badge}
          </span>
        )}
        {off > 0 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-gradient-brand px-2.5 py-1 text-xs font-bold text-primary-foreground">
            -{off}%
          </span>
        )}
      </Link>

      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        aria-label={liked ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        aria-pressed={liked}
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/85 backdrop-blur transition hover:scale-110"
      >
        <Heart className={cn("h-4 w-4", liked && "fill-brand-pink text-brand-pink")} />
      </button>

      <div className="mt-3 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <Link to="/product/$id" params={{ id: product.id }} className="line-clamp-1 font-medium hover:underline">
            {product.name}
          </Link>
          <div className="mt-1 flex items-center gap-2 text-sm">
            <span className="font-semibold">{formatPrice(product.price)}</span>
            {off > 0 && <span className="text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>}
            <span className="ml-auto flex items-center gap-0.5 text-xs text-muted-foreground sm:ml-0">
              <Star className="h-3 w-3 fill-current" /> {product.rating}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => addToCart(product.id)}
          aria-label={`Quick add ${product.name} to cart`}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition hover:rotate-90 hover:scale-105"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

export function ProductRail({ products }: { products: Product[] }) {
  return (
    <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} className="w-[68%] shrink-0 snap-start sm:w-[42%] md:w-auto" />
      ))}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p>}
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
