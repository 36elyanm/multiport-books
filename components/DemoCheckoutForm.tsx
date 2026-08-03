"use client";

import { useState } from "react";

export default function DemoCheckoutForm({
  token,
  bookTitle,
  priceCents,
  successUrl,
  cancelUrl,
}: {
  token: string;
  bookTitle: string;
  priceCents: number;
  successUrl: string;
  cancelUrl: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const priceLabel = `$${(priceCents / 100).toFixed(2)}`;

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/demo-pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) throw new Error("Payment failed");
      const data = await res.json();
      window.location.href = successUrl.replace(
        "{CHECKOUT_SESSION_ID}",
        data.sessionId
      );
    } catch {
      setError("Payment could not be completed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="checkout-shell">
      <div className="checkout-card">
        <div className="demo-banner">
          Demo Mode — no Stripe keys configured, no real charge will occur.
        </div>
        <div className="checkout-summary">
          <span>{bookTitle} (PDF)</span>
          <strong>{priceLabel}</strong>
        </div>
        <form onSubmit={handlePay}>
          <div className="checkout-field">
            <label htmlFor="cardNumber">Card number</label>
            <input id="cardNumber" placeholder="4242 4242 4242 4242" required />
          </div>
          <div className="checkout-row">
            <div className="checkout-field">
              <label htmlFor="expiry">Expiry</label>
              <input id="expiry" placeholder="MM / YY" required />
            </div>
            <div className="checkout-field">
              <label htmlFor="cvc">CVC</label>
              <input id="cvc" placeholder="123" required />
            </div>
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? <span className="spinner" /> : `Pay ${priceLabel}`}
          </button>
          {error && <p className="error-text">{error}</p>}
        </form>
        <p className="purchase-note">
          <a href={cancelUrl}>Cancel and go back</a>
        </p>
      </div>
    </div>
  );
}
