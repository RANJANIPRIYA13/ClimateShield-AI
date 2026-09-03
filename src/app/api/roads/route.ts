import { NextRequest } from 'next/server';
import { successResponse, errorResponse, corsHeaders } from '@/lib/apiResponse';
import { validateRequiredFields, validateEnum } from '@/lib/validation';
import { dbStore } from '@/lib/db/store';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  const roads = dbStore.getRoads();
  return successResponse(roads, 'Road status records fetched successfully', 200, { count: roads.length });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const missingErr = validateRequiredFields(body, ['id', 'status']);
    if (missingErr) return errorResponse(missingErr, 400);

    const statusErr = validateEnum(body.status, ['Open', 'Flooded', 'Blocked', 'Restricted'], 'status');
    if (statusErr) return errorResponse(statusErr, 400);

    if (body.passability) {
      const passErr = validateEnum(body.passability, ['All Vehicles', '4x4 Only', 'Boats Only', 'Impassable'], 'passability');
      if (passErr) return errorResponse(passErr, 400);
    }

    const updated = dbStore.updateRoadStatus(body.id, body.status, body.waterDepthCm, body.passability);
    if (!updated) return errorResponse(`Road record '${body.id}' not found`, 404);

    return successResponse(updated, 'Road passability updated successfully');
  } catch (err: any) {
    return errorResponse(`Failed to update road status: ${err.message}`, 500);
  }
}
