import Link from "next/link";
import { books } from "@/lib/books";
import BookCover from "@/components/BookCover";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <h1>Multiport Books</h1>
        <p>A small harbor for strange, wonderful stories.</p>
      </section>

      <section className="section" id="about">
        <h2 className="section-title">The Store</h2>
        <div className="book-grid">
          {books.map((book) => (
            <Link key={book.slug} href={`/books/${book.slug}`} className="book-card">
              <div className="book-cover">
                <BookCover id={book.coverId} />
              </div>
              <div className="book-info">
                <div className="book-title">{book.title}</div>
                <div className="book-author">{book.author}</div>
                <div className="book-tagline">{book.tagline}</div>
                <div className="book-price-row">
                  <span className="book-price">
                    ${(book.priceCents / 100).toFixed(2)}
                  </span>
                  {book.available ? (
                    <span className="badge">Read now</span>
                  ) : (
                    <span className="badge">Coming soon</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
