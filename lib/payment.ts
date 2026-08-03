import crypto from "crypto";
import { isStripeConfigured, stripe } from "./stripe";

const DEMO_PREFIX = "demo_";
const DEMO_TTL_MS = 30 * 60 * 1000; // 30 minutes

// Only used for the built-in demo paywall (no real money involved, and no
// content this app treats as actually secret). A per-process random secret
// doesn't work here: route handlers can be bundled/instantiated separately,
// so two routes signing/verifying in the same request could disagree. Real
// payment protection comes from Stripe once STRIPE_SECRET_KEY is set —
// set APP_SECRET to override this fallback if desired.
const demoSecret = process.env.APP_SECRET ?? "multiport-books-demo-mode-not-a-real-secret";

function sign(payload: string): string {
  return crypto.createHmac("sha256", demoSecret).update(payload).digest("hex");
}

export function createDemoCheckoutToken(bookId: string): string {
  const payload = JSON.stringify({ bookId, paid: false });
  const body = Buffer.from(payload).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function createDemoPaidSessionId(bookId: string): string {
  const payload = JSON.stringify({ bookId, paid: true, exp: Date.now() + DEMO_TTL_MS });
  const body = Buffer.from(payload).toString("base64url");
  return `${DEMO_PREFIX}${body}.${sign(body)}`;
}

export function readDemoToken(
  token: string
): { bookId: string; paid: boolean; exp?: number } | null {
  const raw = token.startsWith(DEMO_PREFIX) ? token.slice(DEMO_PREFIX.length) : token;
  const [body, signature] = raw.split(".");
  if (!body || !signature) return null;
  if (sign(body) !== signature) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export async function verifyPaidSession(
  sessionId: string | undefined | null,
  bookId: string
): Promise<boolean> {
  if (!sessionId) return false;

  if (sessionId.startsWith(DEMO_PREFIX)) {
    const decoded = readDemoToken(sessionId);
    if (!decoded) return false;
    if (decoded.bookId !== bookId || !decoded.paid) return false;
    if (decoded.exp && decoded.exp < Date.now()) return false;
    return true;
  }

  if (!isStripeConfigured || !stripe) return false;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.payment_status === "paid" && session.metadata?.bookId === bookId;
  } catch {
    return false;
  }
}
