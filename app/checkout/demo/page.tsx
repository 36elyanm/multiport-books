import { getBook } from "@/lib/books";
import { readDemoToken } from "@/lib/payment";
import DemoCheckoutForm from "@/components/DemoCheckoutForm";

export default async function DemoCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; success_url?: string; cancel_url?: string }>;
}) {
  const params = await searchParams;
  const token = params.token ?? "";
  const successUrl = params.success_url ?? "/";
  const cancelUrl = params.cancel_url ?? "/";

  const decoded = readDemoToken(token);
  const book = decoded ? getBook(decoded.bookId) : undefined;

  if (!book || decoded?.paid) {
    return (
      <div className="checkout-shell">
        <div className="checkout-card">
          <p className="error-text">This checkout link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <DemoCheckoutForm
      token={token}
      bookTitle={book.title}
      priceCents={book.priceCents}
      successUrl={successUrl}
      cancelUrl={cancelUrl}
    />
  );
}
