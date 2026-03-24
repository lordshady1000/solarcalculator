import type { IAppliance } from "@/types";

/**
 * Hardcoded appliance catalog.
 * surgeMultiplier: motor loads (AC, pumps, fridges) = 3-5x startup surge.
 * Resistive loads (lights, heaters, kettles) = 1.0 (no surge).
 * Electronics = 1.0-1.5 (minor inrush current).
 */
export const FALLBACK_APPLIANCES: IAppliance[] = [
  { id:"a1",name:"LED Bulb",defaultWattage:10,category:"Lighting",icon:"💡",surgeMultiplier:1.0 },
  { id:"a2",name:"CFL Bulb",defaultWattage:23,category:"Lighting",icon:"💡",surgeMultiplier:1.0 },
  { id:"a3",name:"Fluorescent Tube",defaultWattage:40,category:"Lighting",icon:"💡",surgeMultiplier:1.5 },
  { id:"a4",name:"Ceiling Fan",defaultWattage:75,category:"Cooling",icon:"🌀",surgeMultiplier:2.5 },
  { id:"a5",name:"Standing Fan",defaultWattage:55,category:"Cooling",icon:"🌀",surgeMultiplier:2.5 },
  // Standard ACs — old-style compressor, hard startup
  { id:"a6a",name:"AC 1HP (Standard)",defaultWattage:1000,category:"Cooling",icon:"❄️",surgeMultiplier:4.0 },
  { id:"a7a",name:"AC 1.5HP (Standard)",defaultWattage:1500,category:"Cooling",icon:"❄️",surgeMultiplier:4.0 },
  { id:"a8a",name:"AC 2HP (Standard)",defaultWattage:2000,category:"Cooling",icon:"❄️",surgeMultiplier:4.0 },
  // Inverter ACs — soft-start compressor, much lower surge
  { id:"a6b",name:"AC 1HP (Inverter)",defaultWattage:750,category:"Cooling",icon:"❄️",surgeMultiplier:2.0 },
  { id:"a7b",name:"AC 1.5HP (Inverter)",defaultWattage:1100,category:"Cooling",icon:"❄️",surgeMultiplier:2.0 },
  { id:"a8b",name:"AC 2HP (Inverter)",defaultWattage:1500,category:"Cooling",icon:"❄️",surgeMultiplier:2.0 },
  // Fridges — compressor motor
  { id:"a9",name:"Refrigerator (Small)",defaultWattage:100,category:"Kitchen",icon:"🧊",surgeMultiplier:3.0 },
  { id:"a10",name:"Refrigerator (Large)",defaultWattage:200,category:"Kitchen",icon:"🧊",surgeMultiplier:3.0 },
  { id:"a10b",name:"Refrigerator (Inverter)",defaultWattage:120,category:"Kitchen",icon:"🧊",surgeMultiplier:1.5 },
  { id:"a11",name:"Deep Freezer",defaultWattage:250,category:"Kitchen",icon:"🧊",surgeMultiplier:3.0 },
  { id:"a11b",name:"Deep Freezer (Inverter)",defaultWattage:150,category:"Kitchen",icon:"🧊",surgeMultiplier:1.5 },
  { id:"a12",name:"Microwave Oven",defaultWattage:1200,category:"Kitchen",icon:"🍳",surgeMultiplier:1.5 },
  { id:"a13",name:"Electric Kettle",defaultWattage:1500,category:"Kitchen",icon:"☕",surgeMultiplier:1.0 },
  { id:"a14",name:"Blender",defaultWattage:350,category:"Kitchen",icon:"🫙",surgeMultiplier:3.0 },
  { id:"a15",name:"Rice Cooker",defaultWattage:700,category:"Kitchen",icon:"🍚",surgeMultiplier:1.0 },
  { id:"a16",name:"Toaster",defaultWattage:800,category:"Kitchen",icon:"🍞",surgeMultiplier:1.0 },
  { id:"a17",name:"Electric Oven",defaultWattage:2400,category:"Kitchen",icon:"🔥",surgeMultiplier:1.0 },
  { id:"a18",name:"Dishwasher",defaultWattage:1800,category:"Kitchen",icon:"🍽️",surgeMultiplier:3.0 },
  { id:"a19",name:"Television (LED 32\")",defaultWattage:50,category:"Entertainment",icon:"📺",surgeMultiplier:1.0 },
  { id:"a20",name:"Television (LED 55\")",defaultWattage:100,category:"Entertainment",icon:"📺",surgeMultiplier:1.0 },
  { id:"a21",name:"Sound System",defaultWattage:150,category:"Entertainment",icon:"🔊",surgeMultiplier:1.5 },
  { id:"a22",name:"Projector",defaultWattage:300,category:"Entertainment",icon:"🎬",surgeMultiplier:1.0 },
  { id:"a23",name:"Desktop Computer",defaultWattage:200,category:"Office",icon:"🖥️",surgeMultiplier:1.5 },
  { id:"a24",name:"Laptop",defaultWattage:65,category:"Office",icon:"💻",surgeMultiplier:1.0 },
  { id:"a25",name:"Printer",defaultWattage:50,category:"Office",icon:"🖨️",surgeMultiplier:1.5 },
  { id:"a26",name:"Router/Modem",defaultWattage:15,category:"Office",icon:"📡",surgeMultiplier:1.0 },
  { id:"a27",name:"Phone Charger",defaultWattage:10,category:"Office",icon:"🔌",surgeMultiplier:1.0 },
  { id:"a28",name:"Washing Machine",defaultWattage:500,category:"Laundry",icon:"🫧",surgeMultiplier:2.5 },
  { id:"a28b",name:"Washing Machine (Inverter)",defaultWattage:350,category:"Laundry",icon:"🫧",surgeMultiplier:1.5 },
  { id:"a29",name:"Electric Iron",defaultWattage:1000,category:"Laundry",icon:"👔",surgeMultiplier:1.0 },
  { id:"a30",name:"Water Pump (0.5HP)",defaultWattage:375,category:"Utility",icon:"💧",surgeMultiplier:3.5 },
  { id:"a30b",name:"Water Pump (1HP)",defaultWattage:750,category:"Utility",icon:"💧",surgeMultiplier:3.5 },
  { id:"a30c",name:"Water Pump (Inverter)",defaultWattage:550,category:"Utility",icon:"💧",surgeMultiplier:1.5 },
  { id:"a31",name:"Water Heater",defaultWattage:2000,category:"Utility",icon:"🚿",surgeMultiplier:1.0 },
  { id:"a32",name:"Air Purifier",defaultWattage:60,category:"Utility",icon:"🌬️",surgeMultiplier:1.5 },
  { id:"a33",name:"Sewing Machine",defaultWattage:100,category:"Utility",icon:"🧵",surgeMultiplier:2.5 },
  { id:"a34",name:"Security Light",defaultWattage:30,category:"Security",icon:"🔦",surgeMultiplier:1.0 },
  { id:"a35",name:"CCTV System",defaultWattage:60,category:"Security",icon:"📷",surgeMultiplier:1.0 },
  { id:"a36",name:"Hair Dryer",defaultWattage:1500,category:"Personal",icon:"💇",surgeMultiplier:1.5 },
  { id:"a37",name:"POS Terminal",defaultWattage:50,category:"Business",icon:"💳",surgeMultiplier:1.0 },
  { id:"a38",name:"Barbing Clipper",defaultWattage:15,category:"Business",icon:"✂️",surgeMultiplier:2.0 },
  { id:"a39",name:"Grinding Machine",defaultWattage:1800,category:"Business",icon:"⚙️",surgeMultiplier:4.0 },
  { id:"a40",name:"Chest Cooler/Display",defaultWattage:350,category:"Business",icon:"🧃",surgeMultiplier:3.5 },
];

export const APPLIANCE_CATEGORIES_LIST = [...new Set(FALLBACK_APPLIANCES.map(a => a.category))];
