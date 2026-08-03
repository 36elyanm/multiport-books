import { NextRequest, NextResponse } from "next/server";
import { getBook } from "@/lib/books";
import { verifyPaidSession } from "@/lib/payment";
import { getPdfBytes } from "@/lib/pdf-registry";

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

  const bytes = getPdfBytes(slug);
  if (!bytes) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${slug}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
