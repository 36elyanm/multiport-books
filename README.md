# Multiport Books

A small Apple-styled bookstore. One title, *The Weird Penguin*, is a fully
working example: pay $1, then read the PDF right in the browser.

## Design

- Apple-like UI: translucent blurred nav bar, pill buttons, Apple system
  colors, light/dark mode.
- Font stack in `app/globals.css` puts `-apple-system, BlinkMacSystemFont`
  first, so Apple devices render in San Francisco (SF Pro). Every other
  platform falls through to self-hosted **Inter** (via `next/font/google`
  in `app/layout.tsx`), so no device is ever left on a generic system font.

## Payments

Buying a book runs through `/api/checkout`, which creates a real **Stripe
Checkout** session for $1 if Stripe is configured, gating the PDF at
`/api/pdf` behind a paid session check.

To go live:

1. Create a free Stripe account at stripe.com and grab your secret key.
2. Copy `.env.example` to `.env.local` and set `STRIPE_SECRET_KEY`.
3. Restart the dev server / redeploy.

**Without a Stripe key**, the site automatically falls back to a built-in
demo checkout (`/checkout/demo`) that looks like a real payment form but
never moves real money — useful for trying out the full flow immediately.
Use test card `4242 4242 4242 4242` with Stripe test keys, or any input in
demo mode.

The source PDF lives in `content/the-weird-penguin.pdf` (outside of
`public/`, so it can't be downloaded directly) and is only streamed by
`/api/pdf` after a payment (real or demo) is verified.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
