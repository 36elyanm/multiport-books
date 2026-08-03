import { base64 as theWeirdPenguinBase64 } from "@/lib/generated/the-weird-penguin";

const registry: Record<string, string> = {
  "the-weird-penguin": theWeirdPenguinBase64,
};

export function getPdfBytes(slug: string): Buffer | null {
  const base64 = registry[slug];
  if (!base64) return null;
  return Buffer.from(base64, "base64");
}
