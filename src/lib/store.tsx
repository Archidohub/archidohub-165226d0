import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProduct } from "@/data/products";

/**
 * Cart + wishlist state, persisted in localStorage.
 * (No account needed for v1 — swap for a database later if needed.)
 */

export interface CartLine {
  id: string; // product id
  qty: number;
}

interface StoreContextValue {
  cart: CartLine[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  recentlyViewed: string[];
  markViewed: (id: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = "ah_cart_v1";
const WISHLIST_KEY = "ah_wishlist_v1";
const RECENT_KEY = "ah_recent_v1";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    setCart(readJson<CartLine[]>(CART_KEY, []));
    setWishlist(readJson<string[]>(WISHLIST_KEY, []));
    setRecentlyViewed(readJson<string[]>(RECENT_KEY, []));
  }, []);

  useEffect(() => {
    if (cart.length > 0 || localStorage.getItem(CART_KEY)) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    if (wishlist.length > 0 || localStorage.getItem(WISHLIST_KEY)) {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist]);

  useEffect(() => {
    if (recentlyViewed.length > 0 || localStorage.getItem(RECENT_KEY)) {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed]);

  const addToCart = useCallback((id: string, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) {
        return prev.map((l) =>
          l.id === id ? { ...l, qty: Math.min(l.qty + qty, 10) } : l
        );
      }
      return [...prev, { id, qty }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, 10) } : l))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  }, []);

  const isWishlisted = useCallback(
    (id: string) => wishlist.includes(id),
    [wishlist]
  );

  const markViewed = useCallback((id: string) => {
    setRecentlyViewed((prev) => {
      const next = [id, ...prev.filter((r) => r !== id)].slice(0, 8);
      return next;
    });
  }, []);

  const { cartCount, cartSubtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    for (const line of cart) {
      const product = getProduct(line.id);
      if (!product) continue;
      count += line.qty;
      subtotal += product.price * line.qty;
    }
    return { cartCount: count, cartSubtotal: subtotal };
  }, [cart]);

  const value: StoreContextValue = {
    cart,
    cartCount,
    cartSubtotal,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    cartOpen,
    setCartOpen,
    wishlist,
    toggleWishlist,
    isWishlisted,
    recentlyViewed,
    markViewed,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
