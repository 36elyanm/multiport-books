import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

// Self-hosted Inter, used only as the fallback for non-Apple devices —
// see the font-family stack in globals.css (-apple-system first).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Multiport Books",
  description: "A small harbor for strange, wonderful stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <div className="page">
          <header className="site-header">
            <div className="site-header-inner">
              <Link href="/" className="brand">
                <svg
                  className="brand-mark"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2 3 6.5V12c0 5.2 3.6 9.7 9 10 5.4-.3 9-4.8 9-10V6.5L12 2Z"
                    fill="var(--accent)"
                  />
                  <path
                    d="M8.5 12.5 11 15l4.5-5"
                    stroke="#fff"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Multiport Books
              </Link>
              <nav className="site-nav">
                <Link href="/">Store</Link>
                <Link href="/#about">About</Link>
              </nav>
            </div>
          </header>
          {children}
          <footer className="site-footer">
            Copyright © {new Date().getFullYear()} Multiport Books.
          </footer>
        </div>
      </body>
    </html>
  );
}
