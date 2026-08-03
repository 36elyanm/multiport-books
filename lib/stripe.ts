import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

export const isStripeConfigured = Boolean(secretKey);

export const stripe = secretKey
  ? new Stripe(secretKey, { apiVersion: "2026-07-29.dahlia" })
  : null;
