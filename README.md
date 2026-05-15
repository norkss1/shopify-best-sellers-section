# Best Sellers - Shopify Section

A custom Shopify section for the **Dawn** theme. Displays up to 3 collection tabs with a product card: desktop uses a two-column layout (tabs left, product right); mobile stacks tabs above the card.

## Live preview

- **Section preview:** https://roman-dev-store-gk9ybyau.myshopify.com/?preview_theme_id=146840092732
- **Theme Editor:** https://roman-dev-store-gk9ybyau.myshopify.com/admin/themes/146840092732/editor
  
**Password:** chofle

## Project structure

```
src/best-sellers/              ← source files (edit here)
  best-sellers.liquid          - section markup + schema
  section-best-sellers.css     - styles (BEM: best-sellers__*)
  section-best-sellers.js      - tab switching, wishlist popup, add to cart

theme/                         ← Dawn theme (auto-synced, do not edit directly)
  sections/best-sellers.liquid
  assets/section-best-sellers.*
```

## Dev setup

**Requirements:** Node.js 20+, [Shopify CLI](https://shopify.dev/docs/themes/tools/cli)

| Command | Description |
|---|---|
| `npm run sync` | Copy src → theme/sections & theme/assets |
| `npm run start` | Start local dev server with hot reload |
| `npm run build` | Sync + push to live theme |
| `npm run pull` | Pull remote theme changes locally |

**Full dev cycle:**
```powershell
npm run sync
npm run start
# open http://127.0.0.1:9292 (password: chofle)
```
