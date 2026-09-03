import { NextRequest } from 'next/server';
import { successResponse, errorResponse, corsHeaders } from '@/lib/apiResponse';
import { validateRequiredFields, validateEnum, validateCoordinates } from '@/lib/validation';
import { dbStore } from '@/lib/db/store';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  const hazards = dbStore.getHazards();
  return successResponse(hazards, 'Hazards fetched successfully', 200, { count: hazards.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const missingErr = validateRequiredFields(body, [
      'title', 'category', 'severity', 'probability', 'impactScore',
      'zoneId', 'locationName', 'latitude', 'longitude', 'trend'
    ]);
    if (missingErr) return errorResponse(missingErr, 400);

    const catErr = validateEnum(body.category, ['Flood', 'Heatwave', 'Hurricane', 'Wildfire', 'Storm Surge', 'Waterlogging'], 'category');
    if (catErr) return errorResponse(catErr, 400);

    const sevErr = validateEnum(body.severity, ['Critical', 'Warning', 'Advisory', 'Safe'], 'severity');
    if (sevErr) return errorResponse(sevErr, 400);

    const coordErr = validateCoordinates(Number(body.latitude), Number(body.longitude));
    if (coordErr) return errorResponse(coordErr, 400);

    const newHazard = dbStore.createHazard({
      title: body.title,
      category: body.category,
      severity: body.severity,
      probability: Number(body.probability),
      impactScore: Number(body.impactScore),
      zoneId: body.zoneId,
      locationName: body.locationName,
      latitude: Number(body.latitude),
      longitude: Number(body.longitude),
      trend: body.trend,
      affectedPopulation: Number(body.affectedPopulation || 0),
      description: body.description || ''
    });

    return successResponse(newHazard, 'Hazard recorded successfully', 201);
  } catch (err: any) {
    return errorResponse(`Failed to record hazard: ${err.message}`, 500);
  }
}
