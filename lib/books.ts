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
    tagline: "He came for the warmth. He left with a stolen sandwich and an Uber receipt.",
    description:
      "A penguin flies to the USA looking for somewhere warm, wanders into the wrong locker room, and accidentally becomes the subject of a \"peeping tom\" rumor before he ever finds a sauna. Things only get stranger from there. A short, silly, deadpan comedy that ends on a question it never answers.",
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
