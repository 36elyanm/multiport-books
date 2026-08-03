"use client";

import { useState } from "react";

export default function PayButton({
  slug,
  priceLabel,
}: {
  slug: string;
  priceLabel: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (!res.ok) throw new Error("Could not start checkout");
      const data = await res.json();
      window.location.href = data.url;
    } catch {
      setError("Something went wrong starting checkout. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        className="btn btn-primary btn-block"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? <span className="spinner" /> : `Pay ${priceLabel} & Read`}
      </button>
      {error && <p className="error-text">{error}</p>}
    </>
  );
}
