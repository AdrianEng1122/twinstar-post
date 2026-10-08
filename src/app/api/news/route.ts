import { NextRequest, NextResponse } from "next/server";
import { getAggregatedNews } from "@/lib/news/rssService";
import { NewsCategory, NewsSource } from "@/lib/news/types";

export const dynamic = "force-dynamic";
export const revalidate = 60; // 60 seconds ISR caching

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const rawSource = searchParams.get("source");
    const source: NewsSource | "all" =
      rawSource === "sinchew" || rawSource === "chinapress" ? rawSource : "all";

    const rawCategory = searchParams.get("category") as NewsCategory | null;
    const category = rawCategory || undefined;

    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 30, 1), 100) : 30;

    const result = await getAggregatedNews({
      source,
      category,
      limit,
    });

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (error: any) {
    console.error("Error in /api/news route:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error?.message || "Failed to aggregate news feeds",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
