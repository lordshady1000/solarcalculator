import mongoose, { Schema, Model } from "mongoose";
import type { SystemTemplate } from "@/types";

const SystemTemplateSchema = new Schema<SystemTemplate>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    inverterRating: { type: Number, required: true, min: 0 },
    batteryVoltage: { type: Number, required: true, enum: [12, 24, 48] },
    panelEfficiencyFactor: { type: Number, required: true, min: 0, max: 1, default: 0.85 },
    peakSunHours: { type: Number, required: true, min: 1, max: 12, default: 4.5 },
    batteryDoD: { type: Number, required: true, min: 0.1, max: 1, default: 0.5 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform: (_doc, ret) => { ret.id = ret._id.toString(); delete ret.__v; return ret; } },
  }
);

const SystemTemplateModel: Model<SystemTemplate> = mongoose.models.SystemTemplate || mongoose.model<SystemTemplate>("SystemTemplate", SystemTemplateSchema);
export default SystemTemplateModel;
