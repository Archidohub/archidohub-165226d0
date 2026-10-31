// ============================================================
// ARCHIDOHUB — STATIC PAGES (footer links)
// Edit the text below to update the About / Contact / Shipping /
// Returns / Privacy / Terms pages. Each entry = one page.
// ============================================================

export interface InfoPage {
  slug: string;
  title: string;
  description: string;
  paragraphs: string[];
}

export const infoPages: InfoPage[] = [
  {
    slug: "about",
    title: "About ArchidoHub",
    description: "The story behind the hub of things you'll want to own.",
    paragraphs: [
      "ArchidoHub started with a simple scroll — saving things on Pinterest that we'd never actually find in one place. So we made the place.",
      "We hunt down trending products, aesthetic finds and everyday essentials, try them ourselves, and stock only the ones we'd keep. New drops land every week.",
      "Small team, big curation, honest prices. That's the hub.",
    ],
  },
  {
    slug: "contact",
    title: "Contact Us",
    description: "Questions, order help or collab ideas — we reply fast.",
    paragraphs: [
      "Email us at hello@archidohub.com and we'll get back within 24 hours on working days.",
      "For order-related questions, include your order ID (you'll find it in your payment confirmation) so we can help faster.",
      "We're also active on Instagram @ArchidoHub — DMs are open.",
    ],
  },
  {
    slug: "shipping",
    title: "Shipping",
    description: "Dispatch times, delivery estimates and shipping charges.",
    paragraphs: [
      "Orders are dispatched within 1–2 business days. Metro cities usually receive orders in 2–4 days; other pincodes within 5–7 days.",
      "Shipping is free on orders above ₹499. Below that, a flat ₹49 shipping fee applies at checkout.",
      "You'll receive tracking details as soon as your order ships. Currently we ship across India only.",
    ],
  },
  {
    slug: "returns",
    title: "Returns & Refunds",
    description: "Easy returns within 7 days of delivery.",
    paragraphs: [
      "Not feeling it? Return any unused item in its original packaging within 7 days of delivery.",
      "Write to hello@archidohub.com with your order ID and a photo of the item. Once the return is picked up and checked, refunds reach your original payment method within 5–7 business days.",
      "For hygiene reasons, beauty products can only be returned if unopened and unused.",
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    description: "What we collect, and how we keep it safe.",
    paragraphs: [
      "We collect only what we need to fulfil your order: your name, email, phone number and delivery details. We never sell your data.",
      "Payments are processed by Cashfree Payments. We never see or store your card details, UPI PIN or banking credentials.",
      "You can ask us to delete your data any time by writing to hello@archidohub.com.",
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    description: "The ground rules for shopping with ArchidoHub.",
    paragraphs: [
      "By placing an order on ArchidoHub, you agree to these terms. Prices and product availability can change; an order is confirmed once payment succeeds.",
      "Product photos are representative — actual colours may vary slightly depending on your screen.",
      "These terms are governed by the laws of India. Questions? See the Contact page.",
    ],
  },
];

export function getInfoPage(slug: string): InfoPage | undefined {
  return infoPages.find((p) => p.slug === slug);
}
