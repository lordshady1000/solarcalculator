import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import Appliance from "@/models/Appliance";
import type { ApiResponse, IAppliance } from "@/types";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const query: Record<string, unknown> = {};
    if (category && category !== "All") query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };
    const appliances = await Appliance.find(query).sort({ category: 1, name: 1 }).lean();
    return NextResponse.json({
      success: true,
      data: appliances.map(a => ({ id: a._id!.toString(), name: a.name, defaultWattage: a.defaultWattage, category: a.category, icon: a.icon })),
    } satisfies ApiResponse<IAppliance[]>);
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch appliances" } satisfies ApiResponse, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, defaultWattage, category, icon } = await req.json();
    if (!name || !defaultWattage || !category) {
      return NextResponse.json({ success: false, error: "Missing required fields" } satisfies ApiResponse, { status: 400 });
    }
    const appliance = await Appliance.create({ name, defaultWattage: Number(defaultWattage), category, icon: icon || "⚡" });
    return NextResponse.json({ success: true, data: { id: appliance._id!.toString(), name: appliance.name, defaultWattage: appliance.defaultWattage, category: appliance.category, icon: appliance.icon }, message: "Appliance created" } satisfies ApiResponse, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create appliance" } satisfies ApiResponse, { status: 500 });
  }
}
