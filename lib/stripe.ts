import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

export const isStripeConfigured = Boolean(secretKey);

export const stripe = secretKey
  ? new Stripe(secretKey, {
      apiVersion: "2026-07-29.dahlia",
      // Cloudflare Workers (and other edge runtimes) don't expose Node's
      // raw http/net modules, so Stripe's default Node HTTP client can't
      // make requests there. The fetch-based client works everywhere.
      httpClient: Stripe.createFetchHttpClient(),
    })
  : null;
