import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Instagram, Facebook, Menu, Minus, Plus, Search, ShoppingBag, Trash2, X } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/data/site-config";
import { getProduct, formatPrice } from "@/data/products";
import { useStore } from "@/lib/store";

const navLinks = [
  { label: "Home", to: "/", search: {} },
  { label: "Shop", to: "/shop", search: {} },
  { label: "Categories", to: "/categories", search: {} },
  { label: "Trending", to: "/shop", search: { filter: "trending" } },
  { label: "New Arrivals", to: "/shop", search: { filter: "new" } },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label={`${siteConfig.brandName} home`}>
      <img src={siteConfig.logoUrl} alt="" width={36} height={36} className="h-9 w-9 rounded-xl" />
      <span className="font-display text-lg font-bold tracking-tight">{siteConfig.brandName}</span>
    </Link>
  );
}

export function Header() {
  const { cartCount, wishlist, setCartOpen } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-primary py-2 text-center text-xs font-medium tracking-wide text-primary-foreground">
        {siteConfig.announcementText}
      </div>
      <header className="glass sticky top-0 z-40 border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
          <div className="flex items-center gap-2">
            <button className="md:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>
            <Logo />
          </div>
          <nav className="hidden items-center gap-7 text-sm font-medium md:flex" aria-label="Main">
            {navLinks.map((l) => (
              <Link key={l.label} to={l.to} search={l.search} className="text-muted-foreground transition hover:text-foreground" activeOptions={{ exact: true, includeSearch: true }} activeProps={{ className: "text-foreground" }}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <IconBtn label="Search" onClick={() => setSearchOpen((s) => !s)}><Search className="h-5 w-5" /></IconBtn>
            <Link to="/wishlist" aria-label="Wishlist" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-secondary">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && <Dot n={wishlist.length} />}
            </Link>
            <IconBtn label="Open cart" onClick={() => setCartOpen(true)}>
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && <Dot n={cartCount} />}
            </IconBtn>
          </div>
        </div>
        {searchOpen && (
          <form
            className="mx-auto max-w-7xl px-5 pb-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSearchOpen(false);
              navigate({ to: "/shop", search: { q } });
            }}
          >
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search speakers, lip oil, sunglasses…" aria-label="Search products" className="w-full rounded-full border bg-card px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </form>
        )}
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-foreground/30 md:hidden" onClick={() => setMenuOpen(false)}>
          <div className="h-full w-72 bg-background p-6 rise-in" onClick={(e) => e.stopPropagation()}>
            <div className="mb-8 flex items-center justify-between">
              <Logo />
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu"><X className="h-6 w-6" /></button>
            </div>
            <nav className="flex flex-col gap-5 font-display text-2xl font-semibold" aria-label="Mobile">
              {navLinks.map((l) => (
                <Link key={l.label} to={l.to} search={l.search} onClick={() => setMenuOpen(false)}>{l.label}</Link>
              ))}
              <Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
            </nav>
          </div>
        </div>
      )}
      <CartDrawer />
    </>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-secondary">
      {children}
    </button>
  );
}

function Dot({ n }: { n: number }) {
  return <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-brand px-1 text-[10px] font-bold text-primary-foreground">{n}</span>;
}

function CartDrawer() {
  const { cart, cartOpen, setCartOpen, setQty, removeFromCart, cartSubtotal } = useStore();
  const navigate = useNavigate();
  if (!cartOpen) return null;
  const remaining = siteConfig.freeShippingAbove - cartSubtotal;

  return (
    <div className="fixed inset-0 z-50 bg-foreground/30" onClick={() => setCartOpen(false)}>
      <aside role="dialog" aria-label="Your cart" className="ml-auto flex h-full w-full max-w-md flex-col bg-background shadow-2xl rise-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="font-display text-xl font-bold">Your bag</h2>
          <button onClick={() => setCartOpen(false)} aria-label="Close cart"><X className="h-6 w-6" /></button>
        </div>
        {cart.length === 0 ? (
          <div className="grid flex-1 place-items-center p-8 text-center">
            <div>
              <p className="font-display text-2xl font-semibold">Your bag is empty</p>
              <p className="mt-2 text-sm text-muted-foreground">Go find something you'll love.</p>
              <button onClick={() => { setCartOpen(false); navigate({ to: "/shop" }); }} className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Start shopping</button>
            </div>
          </div>
        ) : (
          <>
            <p className="bg-accent px-5 py-2 text-center text-xs font-medium text-accent-foreground">
              {remaining > 0 ? `Add ${formatPrice(remaining)} more for free shipping ✨` : "You've unlocked free shipping 🎉"}
            </p>
            <ul className="flex-1 space-y-4 overflow-y-auto p-5">
              {cart.map((line) => {
                const p = getProduct(line.id);
                if (!p) return null;
                return (
                  <li key={line.id} className="flex gap-4">
                    <img src={p.image} alt={p.name} className="h-24 w-20 rounded-2xl object-cover" loading="lazy" />
                    <div className="flex flex-1 flex-col">
                      <p className="font-medium leading-tight">{p.name}</p>
                      <p className="text-sm text-muted-foreground">{formatPrice(p.price)}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-full border">
                          <button className="p-2" onClick={() => setQty(p.id, line.qty - 1)} aria-label="Decrease quantity"><Minus className="h-3 w-3" /></button>
                          <span className="w-6 text-center text-sm">{line.qty}</span>
                          <button className="p-2" onClick={() => setQty(p.id, line.qty + 1)} aria-label="Increase quantity"><Plus className="h-3 w-3" /></button>
                        </div>
                        <button onClick={() => removeFromCart(p.id)} aria-label={`Remove ${p.name}`} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="border-t p-5">
              <div className="mb-4 flex justify-between font-semibold"><span>Subtotal</span><span>{formatPrice(cartSubtotal)}</span></div>
              <button onClick={() => { setCartOpen(false); navigate({ to: "/checkout" }); }} className="w-full rounded-full bg-primary py-4 font-semibold text-primary-foreground transition hover:opacity-90">Checkout</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export function Footer() {
  const cols = [
    { title: "Shop", links: [{ label: "All products", to: "/shop" }, { label: "Categories", to: "/categories" }, { label: "Wishlist", to: "/wishlist" }] },
    { title: "Help", links: [{ label: "Contact", to: "/info/contact" }, { label: "Shipping", to: "/info/shipping" }, { label: "Returns", to: "/info/returns" }] },
    { title: "Company", links: [{ label: "About", to: "/info/about" }, { label: "Privacy Policy", to: "/info/privacy" }, { label: "Terms", to: "/info/terms" }] },
  ];
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <img src={siteConfig.logoUrl} alt="" className="h-10 w-10 rounded-xl" loading="lazy" />
            <span className="font-display text-xl font-bold">{siteConfig.brandName}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm opacity-70">{siteConfig.heroDescription}</p>
          <div className="mt-5 flex gap-3">
            <a href={`https://instagram.com/${siteConfig.instagramUsername}`} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20"><Instagram className="h-4 w-4" /></a>
            <a href={`https://facebook.com/${siteConfig.facebookUsername}`} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20"><Facebook className="h-4 w-4" /></a>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="mb-4 text-sm font-semibold">{c.title}</h3>
            <ul className="space-y-2 text-sm opacity-70">
              {c.links.map((l) => (
                <li key={l.label}><a href={l.to} className="hover:opacity-100">{l.label}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-primary-foreground/10 py-5 text-center text-xs opacity-60">
        © {new Date().getFullYear()} {siteConfig.brandName} · Secure payments by Cashfree · {siteConfig.contactEmail}
      </div>
    </footer>
  );
}
