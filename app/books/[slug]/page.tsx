import { notFound } from "next/navigation";
import { getBook } from "@/lib/books";
import BookCover from "@/components/BookCover";
import PayButton from "@/components/PayButton";

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBook(slug);

  if (!book) notFound();

  const priceLabel = `$${(book.priceCents / 100).toFixed(2)}`;

  return (
    <main>
      <div className="book-detail">
        <div className="book-detail-cover">
          <BookCover id={book.coverId} />
        </div>
        <div>
          <div className="book-detail-eyebrow">Multiport Books</div>
          <h1>{book.title}</h1>
          <p className="book-detail-author">by {book.author}</p>
          <p className="book-detail-description">{book.description}</p>

          <div className="purchase-card">
            <div className="purchase-row">
              <span className="purchase-price">{priceLabel}</span>
              <span className="badge">PDF</span>
            </div>
            {book.available ? (
              <PayButton slug={book.slug} priceLabel={priceLabel} />
            ) : (
              <button className="btn btn-primary btn-block" disabled>
                Coming Soon
              </button>
            )}
            <p className="purchase-note">
              Secure checkout. One-time payment unlocks the full story.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
