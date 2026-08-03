import { NextRequest, NextResponse } from "next/server";
import { readDemoToken, createDemoPaidSessionId } from "@/lib/payment";

export async function POST(request: NextRequest) {
  const { token } = await request.json();
  const decoded = await readDemoToken(token);

  if (!decoded || decoded.paid) {
    return NextResponse.json({ error: "Invalid or expired checkout token" }, { status: 400 });
  }

  const sessionId = await createDemoPaidSessionId(decoded.bookId);
  return NextResponse.json({ sessionId });
}
