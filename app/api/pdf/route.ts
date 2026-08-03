import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getBook } from "@/lib/books";
import { verifyPaidSession } from "@/lib/payment";

const CONTENT_DIR = path.join(process.cwd(), "content");

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? "";
  const sessionId = searchParams.get("session_id");

  const book = getBook(slug);
  if (!book || !book.available) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const paid = await verifyPaidSession(sessionId, slug);
  if (!paid) {
    return NextResponse.json({ error: "Payment required" }, { status: 402 });
  }

  const filePath = path.join(CONTENT_DIR, `${slug}.pdf`);
  const fileBuffer = await readFile(filePath);

  return new NextResponse(new Uint8Array(fileBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${slug}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
