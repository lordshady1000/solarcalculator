export const ENERGY_STAR_ENDPOINTS: Record<string, string> = {
  "Room AC": "https://data.energystar.gov/resource/b7ek-jymx.json",
  "Refrigerators": "https://data.energystar.gov/resource/9jmz-k56d.json",
  "Freezers": "https://data.energystar.gov/resource/dgsy-5gkb.json",
  "Washers": "https://data.energystar.gov/resource/t9u7-4d2j.json",
  "Dishwashers": "https://data.energystar.gov/resource/rcjp-7zsr.json",
  "Ceiling Fans": "https://data.energystar.gov/resource/4kra-6act.json",
  "TVs": "https://data.energystar.gov/resource/bfar-bfak.json",
  "Computers": "https://data.energystar.gov/resource/jkt3-mf6w.json",
};

export const ES_CATEGORY_MAP: Record<string, string> = {
  "Room AC": "Cooling",
  "Refrigerators": "Kitchen",
  "Freezers": "Kitchen",
  "Washers": "Laundry",
  "Dishwashers": "Kitchen",
  "Ceiling Fans": "Cooling",
  "TVs": "Entertainment",
  "Computers": "Office",
};

export const ES_ICON_MAP: Record<string, string> = {
  "Room AC": "❄️",
  "Refrigerators": "🧊",
  "Freezers": "🧊",
  "Washers": "🫧",
  "Dishwashers": "🍽️",
  "Ceiling Fans": "🌀",
  "TVs": "📺",
  "Computers": "🖥️",
};
