import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import SystemTemplateModel from "@/models/SystemTemplate";
import type { ApiResponse } from "@/types";

export async function GET() {
  try {
    await connectDB();
    const templates = await SystemTemplateModel.find().lean();
    return NextResponse.json({ success: true, data: templates } satisfies ApiResponse);
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch templates" } satisfies ApiResponse, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const template = await SystemTemplateModel.create(body);
    return NextResponse.json({ success: true, data: template.toJSON(), message: "Template created" } satisfies ApiResponse, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create template" } satisfies ApiResponse, { status: 500 });
  }
}
