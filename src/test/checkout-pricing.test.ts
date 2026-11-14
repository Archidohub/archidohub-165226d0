import { describe, expect, it } from "vitest";
import { calculateCheckoutTotals, calculateShippingFee } from "@/data/products";

describe("checkout pricing", () => {
  it("charges the existing ₹49 fee at exactly ₹100 and offers free delivery above ₹100", () => {
    expect(calculateShippingFee(100)).toBe(49);
    expect(calculateShippingFee(101)).toBe(0);
  });

  it("calculates the order amount from catalog prices and quantities", () => {
    expect(calculateCheckoutTotals([{ id: "blob-cable-organizers", qty: 2 }])).toMatchObject({
      subtotal: 398,
      shippingFee: 0,
      total: 398,
      items: [{ id: "blob-cable-organizers", price: 199, qty: 2 }],
    });
  });
});