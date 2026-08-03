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

**Without a Stripe key**, the site automatically falls back to a built-in
demo checkout (`/checkout/demo`) that looks like a real payment form but
never moves real money — useful for trying out the full flow immediately.
Use test card `4242 4242 4242 4242` with Stripe test keys, or any input in
demo mode.

The source PDF lives in `content/the-weird-penguin.pdf` (outside of
`public/`, so it can't be downloaded directly). At build time
`scripts/generate-pdf-asset.mjs` embeds it into `lib/generated/` as base64
(gitignored, regenerated automatically by `npm run dev`/`build`/`cf:build`)
so `/api/pdf` never needs filesystem access at request time — required for
it to work on Cloudflare Workers, which has no persistent disk.

### Getting a Stripe secret key

1. Create a free account at [dashboard.stripe.com/register](https://dashboard.stripe.com/register)
   (no cost, no credit card required to sign up).
2. You start in **test mode** (toggle visible in the dashboard sidebar).
   Go to **Developers → API keys**, or go directly to
   [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys).
3. Copy the **Secret key** (starts with `sk_test_...`). That's the only key
   this app needs — it uses Stripe's hosted Checkout page, so no
   publishable/client-side key is required.
4. Set it as `STRIPE_SECRET_KEY` (see "Local development" and "Deploying to
   Cloudflare" below for where that goes).
5. Test payments with card `4242 4242 4242 4242`, any future expiry, any
   CVC, any ZIP — test keys never move real money no matter what card you use.
6. **To take real $1 payments**, you have to activate the account: in the
   Stripe dashboard, complete business/bank verification, switch the
   toggle from Test to **Live mode**, and grab the live secret key
   (`sk_live_...`) from the same API keys page. Swap that in as
   `STRIPE_SECRET_KEY` wherever you deployed. This activation step is
   Stripe's identity/compliance process — nothing in this repo can do it
   for you.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Copy `.env.example` to
`.env.local` and set `STRIPE_SECRET_KEY` there to test real Stripe Checkout
locally; leave it unset to use the demo paywall.

## Deploying to Cloudflare

This app deploys to **Cloudflare Workers** (what the dashboard calls
"Workers & Pages") via the [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare),
which is what makes full Next.js App Router + Route Handlers work there —
Cloudflare's older `next-on-pages` adapter is deprecated and doesn't
support enough of Next.js for this app (it needs the Node.js runtime, not
just Edge).

```bash
# one-time: authenticate wrangler with your Cloudflare account
npx wrangler login

# build + preview locally against the real Workers runtime (not just Node)
npm run cf:preview

# build + deploy for real
npm run cf:deploy
```

`wrangler.jsonc` names the Worker `multiport-books` — change `name` there
if you want a different one, and update the matching `services` block
(`WORKER_SELF_REFERENCE`) to the same name.

**Setting environment variables/secrets on Cloudflare:**

- Dashboard: your Worker → **Settings → Variables and Secrets** → add
  `STRIPE_SECRET_KEY`, toggle **Encrypt**.
- Or via CLI, which never touches a file on disk:
  ```bash
  npx wrangler secret put STRIPE_SECRET_KEY
  ```
- For **local** `npm run cf:preview` runs, copy `.dev.vars.example` to
  `.dev.vars` and fill in `STRIPE_SECRET_KEY` there instead (Wrangler reads
  `.dev.vars`, not `.env.local`, for local secrets).

Without `STRIPE_SECRET_KEY` set, the deployed Worker behaves exactly like
local dev without a key: the demo paywall runs instead of real Stripe.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare)
