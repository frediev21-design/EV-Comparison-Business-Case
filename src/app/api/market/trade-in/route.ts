import { NextResponse } from "next/server";
import { lookupTradeIn } from "@/engine/market";
import type { TradeInLookupInput, VehicleCondition } from "@/engine/market/types";

export async function POST(request: Request) {
  const body = await request.json();

  const input: TradeInLookupInput = {
    manufacturer: body.manufacturer ?? "",
    model: body.model ?? "",
    variant: body.variant,
    year: parseInt(body.year, 10) || new Date().getFullYear(),
    mileage: parseInt(body.mileage, 10) || 0,
    condition: (body.condition ?? "good") as VehicleCondition,
    colour: body.colour,
    serviceHistory: body.serviceHistory ?? true,
    accidentHistory: body.accidentHistory ?? false,
    province: body.province ?? "Gauteng",
  };

  if (!input.manufacturer || !input.model) {
    return NextResponse.json({ error: "Manufacturer and model required" }, { status: 400 });
  }

  const result = lookupTradeIn(input);
  if (!result) {
    return NextResponse.json({ error: "Unable to value vehicle" }, { status: 404 });
  }

  return NextResponse.json(result);
}
