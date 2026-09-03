export interface RouteCostBreakdown {
  distanceKm: number;
  floodPenalty: number;
  roadClosurePenalty: number;
  hazardPenalty: number;
  totalRouteCost: number;
}

export interface RouteOption {
  id: string;
  name: string;
  type: 'safest' | 'shortest';
  distanceKm: number;
  etaMins: number;
  riskScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  safetyExplanation: string;
  roadsToAvoid: string[];
  costBreakdown: RouteCostBreakdown;
  polylineCoords: [number, number][];
}

export interface RouteCalculationResult {
  origin: string;
  destination: string;
  generatedAt: string;
  routes: RouteOption[];
  recommendedRouteId: string;
  disclaimer: string;
}

export function calculateSafeRoutes(
  origin = 'Velachery Lowlands (Zone 4)',
  destination = 'Velachery Community Hall Shelter'
): RouteCalculationResult {
  // Option 1: Safest Evacuation Route (Recommended)
  const safestCost: RouteCostBreakdown = {
    distanceKm: 2.4,
    floodPenalty: 1.0,
    roadClosurePenalty: 1.0,
    hazardPenalty: 1.0,
    totalRouteCost: 2.4 // 2.4 * 1.0 * 1.0 * 1.0 = 2.4
  };

  const safestRoute: RouteOption = {
    id: 'ROUTE-SAFE-01',
    name: 'Safest Evacuation Route (Via Vijayanagar Elevated Flyover)',
    type: 'safest',
    distanceKm: 2.4,
    etaMins: 8,
    riskScore: 18,
    riskLevel: 'LOW',
    safetyExplanation: 'Recommended evacuation corridor. Uses Vijayanagar Elevated Flyover and dry Inner Ring Road, completely avoiding flooded subways and low-lying waterlogged basements.',
    roadsToAvoid: ['Saidapet Railway Subway (1.4m depth)', 'Lake View 1st Street (75cm depth)'],
    costBreakdown: safestCost,
    polylineCoords: [
      [12.9785, 80.2206],
      [12.9820, 80.2220],
      [12.9850, 80.2250],
      [12.9750, 80.2220]
    ]
  };

  // Option 2: Direct Shortest Route (High Risk Warning)
  const shortestCost: RouteCostBreakdown = {
    distanceKm: 1.2,
    floodPenalty: 3.5,
    roadClosurePenalty: 4.0,
    hazardPenalty: 2.5,
    totalRouteCost: 42.0 // 1.2 * 3.5 * 4.0 * 2.5 = 42.0
  };

  const shortestRoute: RouteOption = {
    id: 'ROUTE-SHORT-02',
    name: 'Direct Shortest Route (HIGH HAZARD DANGER)',
    type: 'shortest',
    distanceKm: 1.2,
    etaMins: 18,
    riskScore: 88,
    riskLevel: 'CRITICAL',
    safetyExplanation: 'HIGH DANGER: Shorter distance but passes directly through Saidapet Subway (1.4m standing water) and flooded Vijayanagar Junction (75cm water depth). Vehicle submersion risk.',
    roadsToAvoid: ['Saidapet Railway Subway (Impassable 1.4m)', 'Vijayanagar Main Road Junction (75cm depth)'],
    costBreakdown: shortestCost,
    polylineCoords: [
      [12.9785, 80.2206],
      [12.9750, 80.2180],
      [13.0180, 80.2180],
      [12.9750, 80.2220]
    ]
  };

  return {
    origin,
    destination,
    generatedAt: new Date().toISOString(),
    routes: [safestRoute, shortestRoute],
    recommendedRouteId: safestRoute.id,
    disclaimer: 'AI-assisted decision support • Cost Penalty Equation = distance × flood_penalty × closure_penalty × hazard_penalty'
  };
}
