# AI product recommendations

## Build
- Add an AI-powered “You may also like” section to product detail pages.
- Ask Lovable AI to select a short list of matching items from the supplied catalog summaries, excluding the current product.
- Call AI only in a server function; validate the returned product IDs against the catalog before displaying recommendations.
- Keep the existing related-products section as the immediate and failure fallback so recommendations remain available if AI cannot respond.

## Technical details
- Use the Lovable AI Gateway SDK and the workspace default text model on its Responses surface.
- Keep the existing product cards and product-page layout patterns; load AI recommendations after the page renders.
