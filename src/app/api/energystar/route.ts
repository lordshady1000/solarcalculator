import { NextRequest, NextResponse } from "next/server";
import { ENERGY_STAR_ENDPOINTS } from "@/config/energystar.config";
import type { ApiResponse, EnergyStarResult } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "";
    const term = searchParams.get("term");
    const url = ENERGY_STAR_ENDPOINTS[category];
    if (!url) return NextResponse.json({ success: false, error: `Invalid category. Valid: ${Object.keys(ENERGY_STAR_ENDPOINTS).join(", ")}` } satisfies ApiResponse, { status: 400 });

    let q = "?$limit=8";
    if (term?.trim()) {
      const enc = encodeURIComponent(term.trim());
      q += `&$where=upper(brand_name) like upper('%25${enc}%25') OR upper(model_name) like upper('%25${enc}%25') OR upper(model_number) like upper('%25${enc}%25')`;
    }
    const r = await fetch(url + q, { next: { revalidate: 3600 } });
    if (!r.ok) throw new Error("ENERGY STAR API error");
    const raw = await r.json();
    const data: EnergyStarResult[] = raw.map((i: any) => {
      const kwh = parseFloat(i.annual_energy_use_kwh || i.estimated_annual_energy_use_kwh || i.annual_energy_consumption_kwh || i.annual_energy_use || 0);
      return { brand: i.brand_name || "Unknown", model: i.model_name || i.model_number || "N/A", annualKwh: kwh, watts: kwh > 0 ? Math.round(kwh / 8.76) : 0 };
    });
    return NextResponse.json({ success: true, data } satisfies ApiResponse<EnergyStarResult[]>);
  } catch {
    return NextResponse.json({ success: false, error: "ENERGY STAR lookup failed" } satisfies ApiResponse, { status: 500 });
  }
}
