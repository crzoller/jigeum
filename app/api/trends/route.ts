import { NextRequest, NextResponse } from "next/server";
import { getTrends } from "@/lib/trends";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") ?? "All";
  try {
    const trends = await getTrends(category);
    return NextResponse.json(trends);
  } catch (err) {
    console.error("Failed to fetch trends:", err);
    return NextResponse.json({ error: "Failed to fetch trends" }, { status: 500 });
  }
}
