import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/solarcalc";

const SEED_APPLIANCES = [
  { name:"LED Bulb",defaultWattage:10,category:"Lighting",icon:"💡" },
  { name:"CFL Bulb",defaultWattage:23,category:"Lighting",icon:"💡" },
  { name:"Fluorescent Tube",defaultWattage:40,category:"Lighting",icon:"💡" },
  { name:"Ceiling Fan",defaultWattage:75,category:"Cooling",icon:"🌀" },
  { name:"Standing Fan",defaultWattage:55,category:"Cooling",icon:"🌀" },
  { name:"Air Conditioner 1HP (Standard)",defaultWattage:1000,category:"Cooling",icon:"❄️" },
  { name:"Air Conditioner 1.5HP (Standard)",defaultWattage:1500,category:"Cooling",icon:"❄️" },
  { name:"Air Conditioner 2HP (Standard)",defaultWattage:2000,category:"Cooling",icon:"❄️" },
  { name:"Air Conditioner 1HP (Inverter)",defaultWattage:750,category:"Cooling",icon:"❄️" },
  { name:"Air Conditioner 1.5HP (Inverter)",defaultWattage:1100,category:"Cooling",icon:"❄️" },
  { name:"Air Conditioner 2HP (Inverter)",defaultWattage:1500,category:"Cooling",icon:"❄️" },
  { name:"Refrigerator (Small)",defaultWattage:100,category:"Kitchen",icon:"🧊" },
  { name:"Refrigerator (Large)",defaultWattage:200,category:"Kitchen",icon:"🧊" },
  { name:"Refrigerator (Inverter)",defaultWattage:120,category:"Kitchen",icon:"🧊" },
  { name:"Deep Freezer",defaultWattage:250,category:"Kitchen",icon:"🧊" },
  { name:"Deep Freezer (Inverter)",defaultWattage:150,category:"Kitchen",icon:"🧊" },
  { name:"Microwave Oven",defaultWattage:1200,category:"Kitchen",icon:"🍳" },
  { name:"Electric Kettle",defaultWattage:1500,category:"Kitchen",icon:"☕" },
  { name:"Blender",defaultWattage:350,category:"Kitchen",icon:"🫙" },
  { name:"Rice Cooker",defaultWattage:700,category:"Kitchen",icon:"🍚" },
  { name:"Toaster",defaultWattage:800,category:"Kitchen",icon:"🍞" },
  { name:"Electric Oven",defaultWattage:2400,category:"Kitchen",icon:"🔥" },
  { name:"Dishwasher",defaultWattage:1800,category:"Kitchen",icon:"🍽️" },
  { name:"Television (LED 32\")",defaultWattage:50,category:"Entertainment",icon:"📺" },
  { name:"Television (LED 55\")",defaultWattage:100,category:"Entertainment",icon:"📺" },
  { name:"Sound System",defaultWattage:150,category:"Entertainment",icon:"🔊" },
  { name:"Projector",defaultWattage:300,category:"Entertainment",icon:"🎬" },
  { name:"Desktop Computer",defaultWattage:200,category:"Office",icon:"🖥️" },
  { name:"Laptop",defaultWattage:65,category:"Office",icon:"💻" },
  { name:"Printer",defaultWattage:50,category:"Office",icon:"🖨️" },
  { name:"Router/Modem",defaultWattage:15,category:"Office",icon:"📡" },
  { name:"Phone Charger",defaultWattage:10,category:"Office",icon:"🔌" },
  { name:"Washing Machine",defaultWattage:500,category:"Laundry",icon:"🫧" },
  { name:"Washing Machine (Inverter)",defaultWattage:350,category:"Laundry",icon:"🫧" },
  { name:"Electric Iron",defaultWattage:1000,category:"Laundry",icon:"👔" },
  { name:"Water Pump (0.5HP)",defaultWattage:375,category:"Utility",icon:"💧" },
  { name:"Water Pump (1HP)",defaultWattage:750,category:"Utility",icon:"💧" },
  { name:"Water Pump (Inverter)",defaultWattage:550,category:"Utility",icon:"💧" },
  { name:"Water Heater",defaultWattage:2000,category:"Utility",icon:"🚿" },
  { name:"Air Purifier",defaultWattage:60,category:"Utility",icon:"🌬️" },
  { name:"Sewing Machine",defaultWattage:100,category:"Utility",icon:"🧵" },
  { name:"Security Light",defaultWattage:30,category:"Security",icon:"🔦" },
  { name:"CCTV System",defaultWattage:60,category:"Security",icon:"📷" },
  { name:"Hair Dryer",defaultWattage:1500,category:"Personal",icon:"💇" },
  { name:"POS Terminal",defaultWattage:50,category:"Business",icon:"💳" },
  { name:"Barbing Clipper",defaultWattage:15,category:"Business",icon:"✂️" },
  { name:"Grinding Machine",defaultWattage:1800,category:"Business",icon:"⚙️" },
  { name:"Chest Cooler/Display",defaultWattage:350,category:"Business",icon:"🧃" },
];

const SEED_TEMPLATES = [
  { name:"Nigeria Standard",inverterRating:5,batteryVoltage:48,panelEfficiencyFactor:0.85,peakSunHours:4.5,batteryDoD:0.5 },
  { name:"Nigeria Economy",inverterRating:3,batteryVoltage:24,panelEfficiencyFactor:0.80,peakSunHours:4.5,batteryDoD:0.5 },
];

async function seed() {
  console.log("🌱 Seeding database...");
  await mongoose.connect(MONGODB_URI);
  const Appliance = (await import("../models/Appliance")).default;
  const SystemTemplate = (await import("../models/SystemTemplate")).default;
  await Appliance.deleteMany({});
  await SystemTemplate.deleteMany({});
  const a = await Appliance.insertMany(SEED_APPLIANCES);
  const t = await SystemTemplate.insertMany(SEED_TEMPLATES);
  console.log(`✅ Inserted ${a.length} appliances, ${t.length} templates`);
  await mongoose.disconnect();
  process.exit(0);
}
seed().catch(e => { console.error("❌ Seed failed:", e); process.exit(1); });
