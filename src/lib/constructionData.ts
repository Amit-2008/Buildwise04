// BUILDWISE PRO - Construction Data & Calculation Engine

export interface StateData {
  name: string;
  code: string;
  laborMultiplier: number;
  materialMultiplier: number;
  landPricePerSqFt: {
    urban: number;
    semiUrban: number;
    rural: number;
  };
  materialPrices: {
    cement: number; // per bag (50kg)
    steel: number; // per kg
    sand: number; // per ton
    bricks: number; // per 1000 pieces
    aggregate: number; // per ton
    paint: number; // per liter
  };
}

export const INDIAN_STATES: StateData[] = [
  {
    name: "Maharashtra",
    code: "MH",
    laborMultiplier: 1.25,
    materialMultiplier: 1.15,
    landPricePerSqFt: { urban: 15000, semiUrban: 5500, rural: 1200 },
    materialPrices: { cement: 380, steel: 72, sand: 2800, bricks: 8500, aggregate: 1800, paint: 420 }
  },
  {
    name: "Karnataka",
    code: "KA",
    laborMultiplier: 1.15,
    materialMultiplier: 1.10,
    landPricePerSqFt: { urban: 12000, semiUrban: 4500, rural: 900 },
    materialPrices: { cement: 360, steel: 70, sand: 2600, bricks: 7800, aggregate: 1650, paint: 400 }
  },
  {
    name: "Tamil Nadu",
    code: "TN",
    laborMultiplier: 1.10,
    materialMultiplier: 1.08,
    landPricePerSqFt: { urban: 11000, semiUrban: 4200, rural: 850 },
    materialPrices: { cement: 355, steel: 68, sand: 2500, bricks: 7500, aggregate: 1600, paint: 390 }
  },
  {
    name: "Delhi",
    code: "DL",
    laborMultiplier: 1.35,
    materialMultiplier: 1.25,
    landPricePerSqFt: { urban: 25000, semiUrban: 12000, rural: 5000 },
    materialPrices: { cement: 400, steel: 75, sand: 3200, bricks: 9500, aggregate: 2100, paint: 450 }
  },
  {
    name: "Gujarat",
    code: "GJ",
    laborMultiplier: 1.05,
    materialMultiplier: 1.02,
    landPricePerSqFt: { urban: 8500, semiUrban: 3500, rural: 700 },
    materialPrices: { cement: 340, steel: 65, sand: 2200, bricks: 6800, aggregate: 1450, paint: 370 }
  },
  {
    name: "Rajasthan",
    code: "RJ",
    laborMultiplier: 0.95,
    materialMultiplier: 0.95,
    landPricePerSqFt: { urban: 6500, semiUrban: 2800, rural: 550 },
    materialPrices: { cement: 330, steel: 64, sand: 2000, bricks: 5500, aggregate: 1300, paint: 350 }
  },
  {
    name: "Uttar Pradesh",
    code: "UP",
    laborMultiplier: 0.90,
    materialMultiplier: 0.92,
    landPricePerSqFt: { urban: 5500, semiUrban: 2200, rural: 450 },
    materialPrices: { cement: 320, steel: 62, sand: 1800, bricks: 5000, aggregate: 1200, paint: 340 }
  },
  {
    name: "West Bengal",
    code: "WB",
    laborMultiplier: 0.95,
    materialMultiplier: 0.98,
    landPricePerSqFt: { urban: 7500, semiUrban: 3000, rural: 600 },
    materialPrices: { cement: 350, steel: 66, sand: 2100, bricks: 6200, aggregate: 1400, paint: 360 }
  },
  {
    name: "Telangana",
    code: "TS",
    laborMultiplier: 1.12,
    materialMultiplier: 1.08,
    landPricePerSqFt: { urban: 10000, semiUrban: 4000, rural: 800 },
    materialPrices: { cement: 365, steel: 69, sand: 2550, bricks: 7600, aggregate: 1620, paint: 395 }
  },
  {
    name: "Kerala",
    code: "KL",
    laborMultiplier: 1.30,
    materialMultiplier: 1.20,
    landPricePerSqFt: { urban: 13000, semiUrban: 5000, rural: 1000 },
    materialPrices: { cement: 390, steel: 74, sand: 3000, bricks: 9000, aggregate: 1950, paint: 430 }
  },
  {
    name: "Punjab",
    code: "PB",
    laborMultiplier: 1.00,
    materialMultiplier: 1.00,
    landPricePerSqFt: { urban: 7000, semiUrban: 2800, rural: 550 },
    materialPrices: { cement: 345, steel: 67, sand: 2300, bricks: 6500, aggregate: 1500, paint: 375 }
  },
  {
    name: "Madhya Pradesh",
    code: "MP",
    laborMultiplier: 0.88,
    materialMultiplier: 0.90,
    landPricePerSqFt: { urban: 4500, semiUrban: 1800, rural: 350 },
    materialPrices: { cement: 310, steel: 60, sand: 1700, bricks: 4800, aggregate: 1150, paint: 330 }
  },
];

export type BuildingType = "residential" | "commercial";
export type QualityLevel = "economy" | "standard" | "premium";

export interface EstimationInput {
  area: number; // sq ft
  floors: number;
  buildingType: BuildingType;
  quality: QualityLevel;
  stateCode: string;
}

export interface MaterialQuantity {
  cement: number; // bags
  steel: number; // kg
  sand: number; // tons
  bricks: number; // pieces
  aggregate: number; // tons
  paint: number; // liters
}

export interface CostBreakdown {
  materialCost: number;
  laborCost: number;
  overhead: number;
  totalCost: number;
  costPerSqFt: number;
}

export interface EstimationResult {
  materials: MaterialQuantity;
  costs: CostBreakdown;
  stateData: StateData;
  breakdown: {
    name: string;
    value: number;
    percentage: number;
  }[];
}

// Base rates per sq ft (for standard quality, single floor, residential)
const BASE_RATES = {
  material: 850,
  labor: 450,
  overhead: 150,
};

// Quality multipliers
const QUALITY_MULTIPLIERS: Record<QualityLevel, number> = {
  economy: 0.75,
  standard: 1.0,
  premium: 1.5,
};

// Building type multipliers
const BUILDING_TYPE_MULTIPLIERS: Record<BuildingType, number> = {
  residential: 1.0,
  commercial: 1.25,
};

// Material quantity formulas (per sq ft, for standard quality)
const MATERIAL_FORMULAS = {
  cement: 0.4, // bags per sq ft
  steel: 4.5, // kg per sq ft
  sand: 0.045, // tons per sq ft
  bricks: 8, // pieces per sq ft
  aggregate: 0.035, // tons per sq ft
  paint: 0.18, // liters per sq ft (both coats)
};

export function calculateMaterialQuantity(
  area: number,
  floors: number,
  quality: QualityLevel,
  buildingType: BuildingType
): MaterialQuantity {
  const totalArea = area * floors;
  const qualityMult = QUALITY_MULTIPLIERS[quality];
  const typeMult = buildingType === "commercial" ? 1.15 : 1.0;

  return {
    cement: Math.ceil(totalArea * MATERIAL_FORMULAS.cement * qualityMult * typeMult),
    steel: Math.ceil(totalArea * MATERIAL_FORMULAS.steel * qualityMult * typeMult * 1.1),
    sand: Math.round(totalArea * MATERIAL_FORMULAS.sand * qualityMult * 100) / 100,
    bricks: Math.ceil(totalArea * MATERIAL_FORMULAS.bricks * (buildingType === "commercial" ? 0.7 : 1)),
    aggregate: Math.round(totalArea * MATERIAL_FORMULAS.aggregate * qualityMult * 100) / 100,
    paint: Math.ceil(totalArea * MATERIAL_FORMULAS.paint * qualityMult * 1.5), // includes exterior
  };
}

export function calculateEstimation(input: EstimationInput): EstimationResult {
  const state = INDIAN_STATES.find(s => s.code === input.stateCode) || INDIAN_STATES[0];
  const totalArea = input.area * input.floors;
  
  const qualityMult = QUALITY_MULTIPLIERS[input.quality];
  const typeMult = BUILDING_TYPE_MULTIPLIERS[input.buildingType];
  
  // Floor height cost increase (each additional floor adds 5% cost)
  const floorMult = 1 + (input.floors - 1) * 0.05;
  
  // Calculate costs
  const materialCost = Math.round(
    totalArea * BASE_RATES.material * qualityMult * typeMult * state.materialMultiplier * floorMult
  );
  
  const laborCost = Math.round(
    totalArea * BASE_RATES.labor * qualityMult * typeMult * state.laborMultiplier * floorMult
  );
  
  const overhead = Math.round(
    totalArea * BASE_RATES.overhead * qualityMult * floorMult
  );
  
  const totalCost = materialCost + laborCost + overhead;
  const costPerSqFt = Math.round(totalCost / totalArea);
  
  // Calculate materials
  const materials = calculateMaterialQuantity(input.area, input.floors, input.quality, input.buildingType);
  
  // Create breakdown
  const breakdown = [
    { name: "Materials", value: materialCost, percentage: Math.round((materialCost / totalCost) * 100) },
    { name: "Labor", value: laborCost, percentage: Math.round((laborCost / totalCost) * 100) },
    { name: "Overhead & Misc", value: overhead, percentage: Math.round((overhead / totalCost) * 100) },
  ];
  
  return {
    materials,
    costs: {
      materialCost,
      laborCost,
      overhead,
      totalCost,
      costPerSqFt,
    },
    stateData: state,
    breakdown,
  };
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-IN');
}
