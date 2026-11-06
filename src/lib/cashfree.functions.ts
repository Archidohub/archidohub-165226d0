import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getRequest } from "@tanstack/react-start/server";
import { getProduct } from "@/data/products";

/**
 * Cashfree Payments integration.
 * Credentials come from project secrets:
 *   CASHFREE_APP_ID, CASHFREE_SECRET_KEY, CASHFREE_ENV ("sandbox" | "live")
 * The app never sees the secret key — all payment calls run here.
 */

const API_VERSION = "2023-08-01";

function cashfreeBase(mode: "sandbox" | "live") {
  return mode === "live"
    ? "https://api.cashfree.com"
    : "https://api-sandbox.cashfree.com";
}

function readCredentials(): { appId: string; secret: string; mode: "sandbox" | "live" } | null {
  const appId = process.env["CASHFREE_APP_ID"];
  const secret = process.env["CASHFREE_SECRET_KEY"];
  if (!appId || !secret) return null;
  const mode = process.env["CASHFREE_ENV"] === "live" ? "live" : "sandbox";
  return { appId, secret, mode };
}

function siteOrigin(): string {
  const req = getRequest();
  if (!req) return "";
  const url = new URL(req.url);
  return url.origin;
}

const checkoutInput = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        qty: z.number().int().min(1).max(10),
      })
    )
    .min(1),
  customer: z.object({
    name: z.string().min(2, "Please enter your name"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  }),
});

// Prices are recomputed server-side from the catalog so a tampered
// client can never pay a different amount.
function computeAmount(items: { id: string; qty: number }[]) {
  let amount = 0;
  const lines: string[] = [];
  for (const item of items) {
    const product = getProduct(item.id);
    if (!product) throw new Error(`Unknown product: ${item.id}`);
    amount += product.price * item.qty;
    lines.push(`${product.name} x${item.qty}`);
  }
  return { amount, lines };
}

export const createCashfreeOrder = createServerFn({ method: "POST" })
  .inputValidator((input) => checkoutInput.parse(input))
  .handler(async ({ data }) => {
    const creds = readCredentials();
    if (!creds) {
      return { ok: false as const, error: "Payments are not configured yet." };
    }
    const { amount, lines } = computeAmount(data.items);

    const orderId = `AH_${Date.now().toString(36)}${Math.floor(Math.random() * 1296).toString(36)}`;
    const origin = siteOrigin();

    const body = {
      order_id: orderId,
      order_amount: Number(amount.toFixed(2)),
      order_currency: "INR",
      customer_details: {
        customer_name: data.customer.name,
        customer_email: data.customer.email,
        customer_phone: data.customer.phone,
        customer_country: "IN",
      },
      order_meta: origin
        ? { return_url: `${origin}/checkout?order_id=${orderId}&status=verify` }
        : undefined,
      order_note: lines.join(", ").slice(0, 200),
    };

    const res = await fetch(`${cashfreeBase(creds.mode)}/pg/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": creds.appId,
        "x-client-secret": creds.secret,
        "x-api-version": API_VERSION,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`Cashfree create order failed [${res.status}]: ${errorBody}`);
      return {
        ok: false as const,
        error: "Could not start the payment. Please try again in a moment.",
      };
    }

    const created = (await res.json()) as {
      order_id: string;
      payment_session_id: string;
      order_amount: number;
    };

    return {
      ok: true as const,
      orderId: created.order_id,
      sessionId: created.payment_session_id,
      amount: created.order_amount,
      // SDK mode string for the browser checkout widget
      sdkMode: creds.mode === "live" ? "production" : "sandbox",
    };
  });

export const verifyCashfreeOrder = createServerFn({ method: "GET" })
  .inputValidator((input: { orderId: string }) =>
    z.object({ orderId: z.string().min(1) }).parse(input)
  )
  .handler(async ({ data }) => {
    const creds = readCredentials();
    if (!creds) return { ok: false as const, error: "Payments are not configured." };

    const res = await fetch(
      `${cashfreeBase(creds.mode)}/pg/orders/${encodeURIComponent(data.orderId)}`,
      {
        headers: {
          "x-client-id": creds.appId,
          "x-client-secret": creds.secret,
          "x-api-version": API_VERSION,
        },
      }
    );

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`Cashfree verify failed [${res.status}]: ${errorBody}`);
      return { ok: false as const, error: "Could not confirm the payment status." };
    }

    const order = (await res.json()) as {
      order_id: string;
      order_status: string;
      order_amount: number;
    };

    return {
      ok: true as const,
      status: order.order_status, // "PAID" | "ACTIVE" | "EXPIRED" | ...
      amount: order.order_amount,
    };
  });
