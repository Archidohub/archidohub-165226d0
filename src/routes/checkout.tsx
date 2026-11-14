import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Banknote, CheckCircle2, CreditCard, Loader2, Lock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { formatPrice, getProduct } from "@/data/products";
import { siteConfig } from "@/data/site-config";
import { useStore } from "@/lib/store";
import { createCashfreeOrder, createCodOrder, verifyCashfreeOrder } from "@/lib/cashfree.functions";

export const Route = createFileRoute("/checkout")({
  validateSearch: (s) => z.object({ order_id: z.string().optional(), status: z.string().optional() }).parse(s),
  head: () => ({
    meta: [
      { title: "Checkout — ArchidoHub" },
      { name: "description", content: "Secure checkout powered by Cashfree Payments." },
      { property: "og:title", content: "Checkout — ArchidoHub" },
      { property: "og:description", content: "Secure checkout powered by Cashfree Payments." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

declare global {
  interface Window {
    Cashfree?: (opts: { mode: string }) => { checkout: (o: { paymentSessionId: string; redirectTarget: string }) => Promise<unknown> };
  }
}

function loadCashfreeSdk(): Promise<void> {
  if (window.Cashfree) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not load payment window"));
    document.body.appendChild(s);
  });
}

const SHIPPING_FEE = 49;

function Checkout() {
  const { order_id } = Route.useSearch();
  if (order_id) return <OrderResult orderId={order_id} />;
  return <CheckoutForm />;
}

function CheckoutForm() {
  const { cart, cartSubtotal, clearCart } = useStore();
  const createOrder = useServerFn(createCashfreeOrder);
  const placeCodOrder = useServerFn(createCodOrder);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [paymentMethod, setPaymentMethod] = useState<"cashfree" | "cash_on_delivery">("cashfree");
  const [codOrderId, setCodOrderId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shipping = cartSubtotal > siteConfig.freeShippingAbove ? 0 : siteConfig.shippingFee;

  if (codOrderId) return <CodOrderConfirmation orderId={codOrderId} />;

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-4xl font-bold">Your bag is empty</h1>
        <Link to="/shop" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Go shopping</Link>
      </div>
    );
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (paymentMethod === "cash_on_delivery") {
        const result = await placeCodOrder({
          data: {
            items: cart.map((line) => ({ id: line.id, qty: line.qty })),
            customer: form,
          },
        });
        if (!result.ok) throw new Error(result.error);
        clearCart();
        setCodOrderId(result.orderId);
        return;
      }

      const res = await createOrder({ data: { items: cart.map((l) => ({ id: l.id, qty: l.qty })), customer: form } });
      if (!res.ok) throw new Error(res.error);
      await loadCashfreeSdk();
      const cf = window.Cashfree?.({ mode: res.sdkMode });
      if (!cf) throw new Error("Could not open Cashfree checkout. Please try again.");
      await cf.checkout({ paymentSessionId: res.sessionId, redirectTarget: "_self" });
    } catch (err) {
      const msg = err instanceof z.ZodError ? err.issues[0]?.message : err instanceof Error ? err.message : "Something went wrong";
      setError(msg ?? "Please check your details");
      setBusy(false);
    }
  }

  const field = "w-full rounded-2xl border bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-5 py-10 md:grid-cols-[1fr_380px]">
      <form onSubmit={pay} className="space-y-4">
        <h1 className="font-display text-4xl font-bold tracking-tight">Checkout</h1>
        <p className="text-sm text-muted-foreground">We'll send your order updates here.</p>
        <label className="block text-sm font-medium">Full name<input required minLength={2} className={`${field} mt-1`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label className="block text-sm font-medium">Email<input required type="email" className={`${field} mt-1`} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label className="block text-sm font-medium">Mobile number<input required inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10} placeholder="10-digit mobile" className={`${field} mt-1`} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })} /></label>
        {paymentMethod === "cash_on_delivery" && <label className="block text-sm font-medium">Complete shipping address<textarea required minLength={10} maxLength={500} rows={3} autoComplete="street-address" className={`${field} mt-1 resize-y`} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>}
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">Payment method</legend>
          <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 ${paymentMethod === "cashfree" ? "border-primary bg-primary/5" : "bg-card"}`}>
            <input type="radio" name="payment-method" value="cashfree" checked={paymentMethod === "cashfree"} onChange={() => setPaymentMethod("cashfree")} className="accent-primary" />
            <CreditCard className="h-5 w-5" aria-hidden="true" />
            <span className="font-medium">Cashfree online payment</span>
          </label>
          <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 ${paymentMethod === "cash_on_delivery" ? "border-primary bg-primary/5" : "bg-card"}`}>
            <input type="radio" name="payment-method" value="cash_on_delivery" checked={paymentMethod === "cash_on_delivery"} onChange={() => setPaymentMethod("cash_on_delivery")} className="accent-primary" />
            <Banknote className="h-5 w-5" aria-hidden="true" />
            <span className="font-medium">Cash on Delivery</span>
          </label>
        </fieldset>
        {error && <p role="alert" className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
        <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-semibold text-primary-foreground disabled:opacity-60">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : paymentMethod === "cash_on_delivery" ? <Banknote className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          {paymentMethod === "cash_on_delivery" ? "Place COD order" : "Pay"} {formatPrice(cartSubtotal + shipping)}
        </button>
        <p className="text-center text-xs text-muted-foreground">{paymentMethod === "cash_on_delivery" ? "Pay cash to the delivery partner when your order arrives." : "UPI, cards, net banking & wallets · Secured by Cashfree Payments"}</p>
      </form>

      <aside className="h-fit rounded-3xl border bg-card p-6">
        <h2 className="font-display text-lg font-bold">Order summary</h2>
        <ul className="mt-4 space-y-3">
          {cart.map((l) => {
            const p = getProduct(l.id);
            if (!p) return null;
            return (
              <li key={l.id} className="flex items-center gap-3 text-sm">
                <img src={p.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                <span className="flex-1">{p.name} <span className="text-muted-foreground">× {l.qty}</span></span>
                <span className="font-medium">{formatPrice(p.price * l.qty)}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-5 space-y-1 border-t pt-4 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(cartSubtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
          <div className="flex justify-between pt-2 text-base font-bold"><span>Total</span><span>{formatPrice(cartSubtotal + shipping)}</span></div>
        </div>
      </aside>
    </div>
  );
}

function CodOrderConfirmation({ orderId }: { orderId: string }) {
  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-brand-violet" />
      <h1 className="mt-4 font-display text-4xl font-bold">Your COD order is confirmed</h1>
      <p className="mt-2 text-muted-foreground">Order ID {orderId}. Pay cash to the delivery partner when it arrives.</p>
      <Link to="/shop" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Continue shopping</Link>
    </div>
  );
}

function OrderResult({ orderId }: { orderId: string }) {
  const verify = useServerFn(verifyCashfreeOrder);
  const { clearCart } = useStore();
  const [state, setState] = useState<"loading" | "paid" | "failed">("loading");

  useEffect(() => {
    verify({ data: { orderId } })
      .then((r) => {
        if (r.ok && r.status === "PAID") {
          setState("paid");
          clearCart();
        } else setState("failed");
      })
      .catch(() => setState("failed"));
  }, [orderId, verify, clearCart]);

  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      {state === "loading" && <Loader2 className="mx-auto h-10 w-10 animate-spin" />}
      {state === "paid" && (
        <>
          <CheckCircle2 className="mx-auto h-14 w-14 text-brand-violet" />
          <h1 className="mt-4 font-display text-4xl font-bold">Order confirmed 🎉</h1>
          <p className="mt-2 text-muted-foreground">Order ID {orderId}. We'll email your tracking details soon.</p>
        </>
      )}
      {state === "failed" && (
        <>
          <XCircle className="mx-auto h-14 w-14 text-destructive" />
          <h1 className="mt-4 font-display text-4xl font-bold">Payment not completed</h1>
          <p className="mt-2 text-muted-foreground">No money was taken. Your bag is still saved.</p>
          <Link to="/checkout" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Try again</Link>
        </>
      )}
      {state !== "loading" && <Link to="/shop" className="mt-4 block text-sm font-semibold underline">Continue shopping</Link>}
    </div>
  );
}
