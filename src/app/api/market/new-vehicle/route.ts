import { NextResponse } from "next/server";
import { lookupNewVehicle } from "@/engine/market";
import { withMarketCache } from "@/lib/market/cache";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const asking = searchParams.get("asking");

  if (!query.trim()) {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  const cacheKey = `new:${query.toLowerCase()}:${asking ?? "default"}`;
  const { data: result, meta } = withMarketCache(cacheKey, () => {
    const lookup = lookupNewVehicle(query, asking ? parseFloat(asking) : undefined);
    if (!lookup) return null;
    return lookup;
  });

  if (!result) {
    return NextResponse.json({ error: "Vehicle not found in SA market database", query }, { status: 404 });
  }

  return NextResponse.json({ result, meta });
}

export async function POST(request: Request) {
  const body = await request.json();
  const query = body.query ?? body.q ?? "";
  const asking = body.askingPrice;

  if (!query.trim()) {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  const cacheKey = `new:${query.toLowerCase()}:${asking ?? "default"}`;
  const { data: result, meta } = withMarketCache(cacheKey, () => {
    const lookup = lookupNewVehicle(query, asking);
    if (!lookup) return null;
    return lookup;
  });

  if (!result) {
    return NextResponse.json({ error: "Vehicle not found in SA market database", query }, { status: 404 });
  }

  return NextResponse.json({ result, meta });
}
