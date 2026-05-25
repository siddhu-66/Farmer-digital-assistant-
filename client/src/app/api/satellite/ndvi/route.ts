import { NextResponse } from "next/server";
import { getSatelliteInsights } from "@/lib/satellite";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = Number(searchParams.get("lat") || "30.9010");
    const lon = Number(searchParams.get("lon") || "75.8573");
    const cropHint = searchParams.get("crop") || undefined;

    const insights = await getSatelliteInsights(lat, lon, cropHint);
    return NextResponse.json({ success: true, insights });
  } catch (error) {
    console.error("Satellite NDVI API error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch satellite insights" }, { status: 500 });
  }
}
