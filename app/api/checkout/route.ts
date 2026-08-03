import { NextRequest, NextResponse } from "next/server";
import { getBook } from "@/lib/books";
import { isStripeConfigured, stripe } from "@/lib/stripe";
import { createDemoCheckoutToken } from "@/lib/payment";

export async function POST(request: NextRequest) {
  const { slug } = await request.json();
  const book = getBook(slug);

  if (!book || !book.available) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;
  const successUrl = `${origin}/books/${book.slug}/read?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/books/${book.slug}`;

  if (isStripeConfigured && stripe) {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: book.priceCents,
            product_data: {
              name: `${book.title} — Full Story (PDF)`,
              description: book.tagline,
            },
          },
          quantity: 1,
        },
      ],
      metadata: { bookId: book.slug },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  }

  // Demo mode: no Stripe keys configured, so we route through a built-in
  // simulated checkout page instead of a real charge.
  const token = await createDemoCheckoutToken(book.slug);
  const demoUrl = `${origin}/checkout/demo?token=${encodeURIComponent(
    token
  )}&success_url=${encodeURIComponent(successUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`;

  return NextResponse.json({ url: demoUrl, demo: true });
}
