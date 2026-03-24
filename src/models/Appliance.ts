import mongoose, { Schema, Model } from "mongoose";
import type { IAppliance } from "@/types";

const ApplianceSchema = new Schema<IAppliance>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    defaultWattage: { type: Number, required: true, min: 0, max: 50000 },
    category: {
      type: String, required: true,
      enum: ["Lighting","Cooling","Kitchen","Entertainment","Office","Laundry","Utility","Security","Personal","Business","Medical","Industrial"],
    },
    icon: { type: String, required: true, default: "⚡", maxlength: 10 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform: (_doc, ret) => { (ret as any).id = ret._id.toString(); delete (ret as { __v?: unknown }).__v; return ret; } },
  }
);

ApplianceSchema.index({ name: "text" });
ApplianceSchema.index({ category: 1 });

const Appliance: Model<IAppliance> = mongoose.models.Appliance || mongoose.model<IAppliance>("Appliance", ApplianceSchema);
export default Appliance;
