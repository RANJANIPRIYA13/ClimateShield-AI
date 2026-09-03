import { RiskZoneEntity } from '@/lib/db/types';

export interface FactorBreakdown {
  name: string;
  weight: number;
  weightPct: string;
  raw: string;
  score: number;
  contribution: number;
  impact: string;
}

export interface RiskExplanation {
  zoneId: string;
  zoneName: string;
  score: number; // 0 - 100
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  confidence: number; // percentage 0 - 100
  factors: FactorBreakdown[];
  recommended_action: string;
  last_updated: string;
  disclaimer: string;
}

export function calculateZoneRisk(zone: RiskZoneEntity, activeReportsCount = 3): RiskExplanation {
  // 1. Rainfall Factor (Weight 0.30)
  // Max benchmark: 60 mm/hr rainfall = 100%
  const rainfallScore = Math.min(100, Math.round((zone.rainfallMmHr / 60) * 100));
  const rainfallContrib = +(rainfallScore * 0.30).toFixed(2);

  // 2. Elevation Factor (Weight 0.20)
  // Lower elevation = higher flood risk. 1m MSL -> ~95%, 20m MSL -> ~0%
  const elevationScore = Math.max(0, Math.min(100, Math.round(((20 - zone.elevationM) / 20) * 100)));
  const elevationContrib = +(elevationScore * 0.20).toFixed(2);

  // 3. Water Level Factor (Weight 0.20)
  // Max benchmark: 2.5m water accumulation = 100%
  const waterScore = Math.min(100, Math.round((zone.waterLevelM / 2.5) * 100));
  const waterContrib = +(waterScore * 0.20).toFixed(2);

  // 4. Historical Risk Factor (Weight 0.10)
  // Rated based on historical disaster frequency in Chennai
  const historicalScore = zone.riskScore > 8.0 ? 90 : zone.riskScore > 6.0 ? 70 : 45;
  const historicalContrib = +(historicalScore * 0.10).toFixed(2);

  // 5. Population Vulnerability Factor (Weight 0.10)
  // Ratio of vulnerable population (infants, elderly) to total population
  const vulnRatio = zone.population > 0 ? zone.vulnerablePopulation / zone.population : 0.1;
  const vulnScore = Math.min(100, Math.round(vulnRatio * 500));
  const vulnContrib = +(vulnScore * 0.10).toFixed(2);

  // 6. Citizen Reports Factor (Weight 0.10)
  // Based on ground hazard reports in sector
  const reportsScore = Math.min(100, activeReportsCount * 22);
  const reportsContrib = +(reportsScore * 0.10).toFixed(2);

  // Sum Weighted Total Score (0 - 100)
  const totalScore = Math.min(100, Math.max(0, Math.round(
    rainfallContrib + elevationContrib + waterContrib + historicalContrib + vulnContrib + reportsContrib
  )));

  // Risk Level Mapping
  // 0–25 LOW, 26–50 MODERATE, 51–75 HIGH, 76–100 CRITICAL
  let level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (totalScore >= 76) {
    level = 'CRITICAL';
  } else if (totalScore >= 51) {
    level = 'HIGH';
  } else if (totalScore >= 26) {
    level = 'MODERATE';
  } else {
    level = 'LOW';
  }

  // Confidence Score (0 - 100%)
  const confidence = Math.min(98, Math.max(82, 85 + Math.round((rainfallScore + waterScore) / 20)));

  const factors: FactorBreakdown[] = [
    {
      name: 'Rainfall Intensity',
      weight: 0.30,
      weightPct: '30%',
      raw: `${zone.rainfallMmHr} mm/h`,
      score: rainfallScore,
      contribution: rainfallContrib,
      impact: rainfallScore > 70 ? 'Severe monsoonal precipitation rate' : 'Moderate rainfall rate'
    },
    {
      name: 'Elevation Vulnerability',
      weight: 0.20,
      weightPct: '20%',
      raw: `${zone.elevationM} m MSL`,
      score: elevationScore,
      contribution: elevationContrib,
      impact: elevationScore > 75 ? 'Low-lying coastal/basin depression' : 'Elevated terrain'
    },
    {
      name: 'Water Inundation Level',
      weight: 0.20,
      weightPct: '20%',
      raw: `+${zone.waterLevelM} m`,
      score: waterScore,
      contribution: waterContrib,
      impact: waterScore > 60 ? 'Significant standing water accumulation' : 'Minor surface runoff'
    },
    {
      name: 'Historical Flood Index',
      weight: 0.10,
      weightPct: '10%',
      raw: zone.historicalRisk || 'Historical monsoon sector',
      score: historicalScore,
      contribution: historicalContrib,
      impact: historicalScore > 75 ? 'Repeated historical flood inundation (2015/2023)' : 'Standard historical profile'
    },
    {
      name: 'Population Vulnerability',
      weight: 0.10,
      weightPct: '10%',
      raw: `${zone.vulnerablePopulation.toLocaleString()} / ${zone.population.toLocaleString()} (${(vulnRatio * 100).toFixed(1)}%)`,
      score: vulnScore,
      contribution: vulnContrib,
      impact: vulnScore > 60 ? 'High concentration of elderly & infant residents' : 'Moderate demographic risk'
    },
    {
      name: 'Citizen Incident Reports',
      weight: 0.10,
      weightPct: '10%',
      raw: `${activeReportsCount} active ground reports`,
      score: reportsScore,
      contribution: reportsContrib,
      impact: reportsScore > 50 ? 'Sustained ground hazard notifications from citizens' : 'Low report volume'
    }
  ];

  // Dynamic Recommended Action
  let recommended_action = zone.recommendedAction;
  if (level === 'CRITICAL') {
    recommended_action = `IMMEDIATE ACTION REQUIRED: Evacuate lowlands in ${zone.name}. Move to nearest emergency shelter immediately. Deploy swift-water rescue units.`;
  } else if (level === 'HIGH') {
    recommended_action = `HIGH ADVISORY: Prepare emergency kits in ${zone.name}. Reroute vehicles away from flooded subways and stage dewatering pumps.`;
  } else if (level === 'MODERATE') {
    recommended_action = `MODERATE ALERT: Monitor water levels in ${zone.name}. Avoid low-lying underpasses and pre-cool facilities.`;
  } else {
    recommended_action = `NOMINAL STATUS: Sector ${zone.name} operating under standard preparedness protocols.`;
  }

  return {
    zoneId: zone.id,
    zoneName: zone.name,
    score: totalScore,
    level,
    confidence,
    factors,
    recommended_action,
    last_updated: new Date().toISOString(),
    disclaimer: 'AI-assisted decision support'
  };
}
