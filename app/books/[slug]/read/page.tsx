import Link from "next/link";
import { notFound } from "next/navigation";
import { getBook } from "@/lib/books";
import { verifyPaidSession } from "@/lib/payment";

export default async function ReadBookPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { slug } = await params;
  const { session_id: sessionId } = await searchParams;
  const book = getBook(slug);

  if (!book || !book.available) notFound();

  const paid = await verifyPaidSession(sessionId, slug);

  if (!paid) {
    return (
      <div className="status-shell">
        <div className="status-card">
          <h1>Payment required</h1>
          <p>
            We couldn&apos;t verify a completed payment for {book.title}. Please
            purchase the book to read it.
          </p>
          <Link href={`/books/${book.slug}`} className="btn btn-primary">
            Back to {book.title}
          </Link>
        </div>
      </div>
    );
  }

  const pdfUrl = `/api/pdf?slug=${encodeURIComponent(slug)}&session_id=${encodeURIComponent(
    sessionId ?? ""
  )}`;

  return (
    <div className="reader-shell">
      <div className="reader-bar">
        <strong>{book.title}</strong>
        <Link href="/" className="btn btn-secondary">
          Back to Store
        </Link>
      </div>
      <iframe title={book.title} src={pdfUrl} className="reader-frame" />
    </div>
  );
}
