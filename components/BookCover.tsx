const covers: Record<string, React.ReactNode> = {
  penguin: (
    <svg viewBox="0 0 300 400" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="penguin-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfe3ff" />
          <stop offset="100%" stopColor="#eaf6ff" />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill="url(#penguin-bg)" />
      <ellipse cx="150" cy="330" rx="110" ry="14" fill="#9fd2f2" opacity="0.6" />
      {/* body */}
      <ellipse cx="150" cy="230" rx="78" ry="98" fill="#2b3440" />
      <ellipse cx="150" cy="245" rx="52" ry="78" fill="#f5f7f8" />
      {/* head */}
      <circle cx="150" cy="120" r="58" fill="#2b3440" />
      <ellipse cx="150" cy="132" rx="34" ry="30" fill="#f5f7f8" />
      {/* beak */}
      <path d="M150 118 172 130 150 142Z" fill="#f2a541" />
      {/* eyes - one raised brow for "weird" personality */}
      <circle cx="132" cy="112" r="5" fill="#1c2127" />
      <circle cx="170" cy="106" r="5" fill="#1c2127" />
      <path
        d="M160 92c4-4 12-5 17-2"
        stroke="#1c2127"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* quirky tuft of hair */}
      <path
        d="M138 66c-4-10 2-20 10-24-2 9 1 16 6 21-9-1-13 1-16 3Z"
        fill="#2b3440"
      />
      {/* wings */}
      <path d="M92 190c-22 10-34 40-28 74 16-6 34-24 40-48Z" fill="#2b3440" />
      <path d="M208 190c22 10 34 40 28 74-16-6-34-24-40-48Z" fill="#2b3440" />
      {/* feet */}
      <path d="M120 322c-4 10-14 14-24 12 4-8 10-14 18-16Z" fill="#f2a541" />
      <path d="M180 322c4 10 14 14 24 12-4-8-10-14-18-16Z" fill="#f2a541" />
    </svg>
  ),
  harbor: (
    <svg viewBox="0 0 300 400" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="harbor-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b2a4a" />
          <stop offset="100%" stopColor="#0c1424" />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill="url(#harbor-bg)" />
      <circle cx="230" cy="80" r="26" fill="#ffe9a8" opacity="0.9" />
      <rect x="0" y="260" width="300" height="140" fill="#0a1220" />
      <path d="M40 260 100 190 160 260Z" fill="#16223a" />
      <path d="M140 260 190 160 260 260Z" fill="#101a2e" />
      <rect x="95" y="150" width="10" height="110" fill="#0a1220" />
      <circle cx="100" cy="145" r="6" fill="#ffe9a8" />
    </svg>
  ),
  orchard: (
    <svg viewBox="0 0 300 400" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="orchard-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4e9ff" />
          <stop offset="100%" stopColor="#fbe3ea" />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill="url(#orchard-bg)" />
      <rect x="140" y="180" width="14" height="140" fill="#8a6a8f" opacity="0.7" />
      <circle cx="147" cy="150" r="70" fill="#c9a6e0" opacity="0.55" />
      <circle cx="105" cy="180" r="16" fill="#e8c8e6" />
      <circle cx="190" cy="170" r="14" fill="#e8c8e6" />
      <circle cx="147" cy="120" r="18" fill="#e8c8e6" />
    </svg>
  ),
};

export default function BookCover({ id }: { id: string }) {
  return covers[id] ?? <div style={{ width: "100%", height: "100%", background: "var(--bg-elevated)" }} />;
}
