import { NextRequest } from 'next/server';
import { successResponse, errorResponse, corsHeaders } from '@/lib/apiResponse';
import { validateRequiredFields } from '@/lib/validation';
import { dbStore } from '@/lib/db/store';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  const observations = dbStore.getWeatherObservations();
  return successResponse(observations, 'Weather observations fetched successfully', 200, { count: observations.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const missingErr = validateRequiredFields(body, [
      'zoneId', 'temperatureC', 'rainfallMmHr', 'humidityPct', 'riverLevelM', 'windSpeedKmh'
    ]);
    if (missingErr) return errorResponse(missingErr, 400);

    const newObs = dbStore.createWeatherObservation({
      zoneId: body.zoneId,
      temperatureC: Number(body.temperatureC),
      rainfallMmHr: Number(body.rainfallMmHr),
      humidityPct: Number(body.humidityPct),
      riverLevelM: Number(body.riverLevelM),
      windSpeedKmh: Number(body.windSpeedKmh)
    });

    return successResponse(newObs, 'Weather observation logged successfully', 201);
  } catch (err: any) {
    return errorResponse(`Failed to log weather observation: ${err.message}`, 500);
  }
}
