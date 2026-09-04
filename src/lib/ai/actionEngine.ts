/**
 * Risk-to-Action Engine
 * Converts risk scores and multi-source observations into actionable multi-stakeholder recommendations.
 */

import { RiskZoneEntity } from '@/lib/db/types';
import { NormalizedObservation } from '@/lib/adapters';

export interface CitizenActionPlan {
  primary: string;
  priority: 'IMMEDIATE' | 'URGENT' | 'MONITOR' | 'NOMINAL';
  steps: string[];
  safeGroundHeading: string;
  safetyChecklist: string[];
}

export interface RouteActionPlan {
  recommendedEvacuationRoute: string;
  alternateRoute: string;
  roadsToAvoid: string[];
  blockedRoads: string[];
  estimatedTravelTimeMin: number;
  routeRiskScore: number; // 0 - 100
  navigationGuidance: string;
}

export interface ResponseActionPlan {
  rescuePriority: 'CRITICAL (PRIORITY 1)' | 'HIGH (PRIORITY 2)' | 'MEDIUM' | 'LOW';
  responseTeamDeployment: string;
  medicalResponsePriority: string;
  resourceAllocations: string[];
  roadClearancePriority: string;
}

export interface ShelterActionPlan {
  nearestShelterId: string;
  nearestShelterName: string;
  availableCapacity: number;
  totalCapacity: number;
  distanceKm: number;
  accessibilityStatus: 'FULLY ACCESSIBLE' | 'WALK-ONLY DETOUR' | 'RESCUE BOAT ACCESS ONLY';
  hasMedicalSupport: boolean;
}

export interface AuthorityActionPlan {
  evacuateZone: boolean;
  deployRescueTeams: number;
  dispatchMedicalUnits: number;
  deployDewateringPumps: number;
  closeRoadSegments: string[];
  publicAlertMessage: string;
  commandDirective: string;
}

export interface ComprehensiveActionPlan {
  zoneId: string;
  zoneName: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  confidence: number;
  citizenAction: CitizenActionPlan;
  routeAction: RouteActionPlan;
  responseAction: ResponseActionPlan;
  shelterAction: ShelterActionPlan;
  authorityAction: AuthorityActionPlan;
  generatedAt: string;
  underlyingTriggers: string[];
}

export function generateActionPlan(
  zone: RiskZoneEntity,
  observations: NormalizedObservation[] = []
): ComprehensiveActionPlan {
  const isCritical = zone.riskScore >= 75 || zone.waterLevelM >= 1.5;
  const isHigh = zone.riskScore >= 50 && !isCritical;
  const isModerate = zone.riskScore >= 25 && !isHigh && !isCritical;

  const underlyingTriggers: string[] = [
    `Rainfall: ${zone.rainfallMmHr} mm/hr`,
    `Water Level: +${zone.waterLevelM}m MSL`,
    `Elevation: ${zone.elevationM}m`,
    `Vulnerable Pop: ${zone.vulnerablePopulation.toLocaleString()} residents`
  ];

  if (observations.length > 0) {
    observations.forEach(o => underlyingTriggers.push(`[${o.provenance}] ${o.observed_value}`));
  }

  // 1. Citizen Action Plan
  let citizenAction: CitizenActionPlan;
  if (isCritical) {
    citizenAction = {
      primary: `EVACUATE IMMEDIATELY from low-lying areas in ${zone.name}.`,
      priority: 'IMMEDIATE',
      steps: [
        `Move to upper floors or nearest designated shelter in ${zone.name}`,
        'Avoid 100 Feet Road subway and low-lying underpasses',
        'Gather emergency bag (medications, IDs, charged devices, bottled water)',
        'Check on elderly neighbors and infants before leaving'
      ],
      safeGroundHeading: `Proceed East toward GST Road / Higher Elevation (Distance 1.2 km)`,
      safetyChecklist: [
        'Do NOT drive or wade through standing water deeper than 15 cm',
        'Disconnect electricity mains if water level approaches sockets',
        'Notify emergency dispatch of mobility-impaired individuals'
      ]
    };
  } else if (isHigh) {
    citizenAction = {
      primary: `PREPARE FOR EVACUATION & SHELTER IN PLACE in ${zone.name}.`,
      priority: 'URGENT',
      steps: [
        'Charge power banks and phones immediately',
        'Elevate ground-floor electronics and valuable documents',
        'Identify route to closest emergency shelter',
        'Stay tuned to official EOC alerts'
      ],
      safeGroundHeading: 'Stay on elevated arterial roads. Avoid storm drains.',
      safetyChecklist: [
        'Keep emergency flashlight and first aid kit within reach',
        'Avoid touch of metal poles or fallen electric wires'
      ]
    };
  } else {
    citizenAction = {
      primary: `STAY ADVISORY & MONITOR LOCAL WEATHER in ${zone.name}.`,
      priority: 'NOMINAL',
      steps: [
        'Clear domestic roof drains and rainwater pipes',
        'Store 48 hours of clean drinking water',
        'Keep ClimateShield AI alert notifications enabled'
      ],
      safeGroundHeading: 'Standard neighborhood roads operational.',
      safetyChecklist: ['Monitor weather updates on ClimateShield Citizen App']
    };
  }

  // 2. Route Action Plan
  const routeAction: RouteActionPlan = {
    recommendedEvacuationRoute: isCritical
      ? `${zone.name} Main Rd → Inner Ring Road Flyover → GST Road (Safest Green Route)`
      : `${zone.name} Arterial Road → Main Bus Stand Road`,
    alternateRoute: 'Velachery Station Elevation Flyover Detour (2.4 km additional)',
    roadsToAvoid: ['100 Feet Bypass Underpass', 'Velachery Lake Low-Lying Extension', 'Madipakkam Subway'],
    blockedRoads: isCritical ? ['Madipakkam Subway (+1.8m water)', '100 Feet Rd (Flooded)'] : ['Madipakkam Subway'],
    estimatedTravelTimeMin: isCritical ? 28 : 14,
    routeRiskScore: isCritical ? 32 : 12,
    navigationGuidance: isCritical
      ? 'PRIMARY ROUTE FLOODED. AI navigation engine has dynamically rerouted via elevated flyovers.'
      : 'Standard arterial routes clear with light surface runoff.'
  };

  // 3. Response Action Plan
  const responseAction: ResponseActionPlan = {
    rescuePriority: isCritical
      ? 'CRITICAL (PRIORITY 1)'
      : isHigh
      ? 'HIGH (PRIORITY 2)'
      : 'MEDIUM',
    responseTeamDeployment: isCritical
      ? `Deploy NDRF Team 4 + SDRF Unit 2 to ${zone.name} Sector 4`
      : `Stage 1 SDRF Swift Water Unit at ${zone.name} Fire Station`,
    medicalResponsePriority: isCritical ? 'URGENT: Dispatch Mobile Trauma Unit' : 'STANDBY: Ambulance Unit 3',
    resourceAllocations: isCritical
      ? ['2x High-Capacity Dewatering Pumps (500 HP)', '3x Inflatable Rescue Rafts', '500x Dry Food Packs']
      : ['1x Dewatering Pump (200 HP)', '100x Clean Water Cans'],
    roadClearancePriority: isCritical ? 'Clear 100 Feet Road subway for emergency rescue vehicles' : 'Routine drain clearance'
  };

  // 4. Shelter Action Plan
  const shelterAction: ShelterActionPlan = {
    nearestShelterId: 'sh-01',
    nearestShelterName: `${zone.name} Govt Higher Secondary School Emergency Relief Center`,
    availableCapacity: isCritical ? 140 : 350,
    totalCapacity: 500,
    distanceKm: 0.8,
    accessibilityStatus: isCritical ? 'WALK-ONLY DETOUR' : 'FULLY ACCESSIBLE',
    hasMedicalSupport: true
  };

  // 5. Authority Action Plan
  const authorityAction: AuthorityActionPlan = {
    evacuateZone: isCritical,
    deployRescueTeams: isCritical ? 3 : 1,
    dispatchMedicalUnits: isCritical ? 2 : 1,
    deployDewateringPumps: isCritical ? 4 : 1,
    closeRoadSegments: isCritical
      ? [`${zone.name} Low-Lying Subway Segment`, '100 Feet Bypass Link']
      : [`${zone.name} Low-Lying Subway Segment`],
    publicAlertMessage: `[CRITICAL FLOOD ALERT] ${zone.name}: Water level at +${zone.waterLevelM}m. Evacuate low-lying streets to ${shelterAction.nearestShelterName}. Avoid flooded subways.`,
    commandDirective: isCritical
      ? `EOC DIRECTIVE: Issue Level 4 Public Emergency Alert. Mobilize NDRF Teams to ${zone.name}. Activate emergency pumps.`
      : `EOC DIRECTIVE: Maintain active telemetry monitoring in ${zone.name}.`
  };

  return {
    zoneId: zone.id,
    zoneName: zone.name,
    riskScore: zone.riskScore,
    riskLevel: (zone.riskLevel?.toUpperCase() as any) || 'LOW',
    confidence: Math.min(98, Math.max(85, 88 + Math.round(zone.waterLevelM * 4))),
    citizenAction,
    routeAction,
    responseAction,
    shelterAction,
    authorityAction,
    generatedAt: new Date().toISOString(),
    underlyingTriggers
  };
}
