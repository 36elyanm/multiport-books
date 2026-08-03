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

// Web Crypto (globalThis.crypto.subtle) instead of node:crypto so signing
// works identically on Node hosts, Cloudflare Workers, and any edge runtime
// without depending on a platform's Node-compat shim.
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function base64UrlEncode(input: string): string {
  const bytes = encoder.encode(input);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return decoder.decode(bytes);
}

async function getHmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(demoSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function sign(payload: string): Promise<string> {
  const key = await getHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toHex(signature);
}

export async function createDemoCheckoutToken(bookId: string): Promise<string> {
  const payload = JSON.stringify({ bookId, paid: false });
  const body = base64UrlEncode(payload);
  return `${body}.${await sign(body)}`;
}

export async function createDemoPaidSessionId(bookId: string): Promise<string> {
  const payload = JSON.stringify({ bookId, paid: true, exp: Date.now() + DEMO_TTL_MS });
  const body = base64UrlEncode(payload);
  return `${DEMO_PREFIX}${body}.${await sign(body)}`;
}

export async function readDemoToken(
  token: string
): Promise<{ bookId: string; paid: boolean; exp?: number } | null> {
  const raw = token.startsWith(DEMO_PREFIX) ? token.slice(DEMO_PREFIX.length) : token;
  const [body, signature] = raw.split(".");
  if (!body || !signature) return null;
  if ((await sign(body)) !== signature) return null;
  try {
    return JSON.parse(base64UrlDecode(body));
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
    const decoded = await readDemoToken(sessionId);
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
