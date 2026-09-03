import { NextRequest } from 'next/server';
import { successResponse, errorResponse, corsHeaders } from '@/lib/apiResponse';
import { validateRequiredFields, validateEnum } from '@/lib/validation';
import { dbStore } from '@/lib/db/store';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  const zones = dbStore.getRiskZones();
  return successResponse(zones, 'Risk zones fetched successfully', 200, { count: zones.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const missingErr = validateRequiredFields(body, ['name', 'sectorCode', 'baseRiskLevel', 'population']);
    if (missingErr) return errorResponse(missingErr, 400);

    const levelErr = validateEnum(body.baseRiskLevel, ['Critical', 'Warning', 'Advisory', 'Safe'], 'baseRiskLevel');
    if (levelErr) return errorResponse(levelErr, 400);

    const newZone = dbStore.createRiskZone({
      name: body.name,
      city: body.city || 'Chennai',
      sectorCode: body.sectorCode,
      baseRiskLevel: body.baseRiskLevel,
      population: Number(body.population),
      vulnerablePopulation: Number(body.vulnerablePopulation || Math.round(Number(body.population) * 0.12)),
      riskScore: Number(body.riskScore || 7.5),
      riskLevel: body.riskLevel || (body.baseRiskLevel === 'Critical' ? 'Critical' : body.baseRiskLevel === 'Warning' ? 'High' : 'Moderate'),
      confidencePct: Number(body.confidencePct || 90),
      rainfallMmHr: Number(body.rainfallMmHr || 25.0),
      waterLevelM: Number(body.waterLevelM || 0.5),
      elevationM: Number(body.elevationM || 5.0),
      historicalRisk: body.historicalRisk || 'Monsoon urban flood risk zone',
      lastUpdated: 'Just now',
      category: body.category || 'Flood',
      contributingFactors: Array.isArray(body.contributingFactors) ? body.contributingFactors : ['Storm drain runoff', 'Catchment saturation'],
      recommendedAction: body.recommendedAction || 'Monitor sector alerts and maintain preparedness.',
      polygonCoords: body.polygonCoords || [
        [13.00, 80.20],
        [13.02, 80.20],
        [13.02, 80.22],
        [13.00, 80.22]
      ],
      boundaryGeojson: body.boundaryGeojson
    });

    return successResponse(newZone, 'Risk zone created successfully', 201);
  } catch (err: any) {
    return errorResponse(`Failed to create risk zone: ${err.message}`, 500);
  }
}
