export type Book = {
  slug: string;
  title: string;
  author: string;
  tagline: string;
  description: string;
  priceCents: number;
  coverId: "penguin" | "harbor" | "orchard";
  available: boolean;
};

export const books: Book[] = [
  {
    slug: "the-weird-penguin",
    title: "The Weird Penguin",
    author: "Multiport Books",
    tagline: "He doesn't waddle. He doesn't fish. He's just... weird.",
    description:
      "In a colony where every penguin follows the same icy routine, one small penguin marches to his own beat. A short, warm-hearted illustrated story about standing out, fitting in, and why weird is just another word for wonderful.",
    priceCents: 100,
    coverId: "penguin",
    available: true,
  },
  {
    slug: "midnight-harbor",
    title: "Midnight Harbor",
    author: "R. Alsen",
    tagline: "The tide only comes in once.",
    description:
      "A quiet fishing town, a light that shouldn't be there, and a harbor that remembers everything. Coming soon to Multiport Books.",
    priceCents: 499,
    coverId: "harbor",
    available: false,
  },
  {
    slug: "the-glass-orchard",
    title: "The Glass Orchard",
    author: "J. Faimont",
    tagline: "Every tree here holds a memory.",
    description:
      "An orchard grown from glass, tended by a family that can't stop time — only bottle it. Coming soon to Multiport Books.",
    priceCents: 399,
    coverId: "orchard",
    available: false,
  },
];

export function getBook(slug: string): Book | undefined {
  return books.find((book) => book.slug === slug);
}
