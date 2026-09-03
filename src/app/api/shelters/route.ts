import { NextRequest } from 'next/server';
import { successResponse, errorResponse, corsHeaders } from '@/lib/apiResponse';
import { validateRequiredFields, validateEnum, validateCoordinates } from '@/lib/validation';
import { dbStore } from '@/lib/db/store';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  const shelters = dbStore.getShelters();
  return successResponse(shelters, 'Shelters fetched successfully', 200, { count: shelters.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const missingErr = validateRequiredFields(body, [
      'name', 'address', 'zoneId', 'latitude', 'longitude', 'status', 'capacity', 'contactPhone'
    ]);
    if (missingErr) return errorResponse(missingErr, 400);

    const statusErr = validateEnum(body.status, ['Open', 'Full', 'Standby', 'Closed'], 'status');
    if (statusErr) return errorResponse(statusErr, 400);

    const coordErr = validateCoordinates(Number(body.latitude), Number(body.longitude));
    if (coordErr) return errorResponse(coordErr, 400);

    const newShelter = dbStore.createShelter({
      name: body.name,
      address: body.address,
      zoneId: body.zoneId,
      latitude: Number(body.latitude),
      longitude: Number(body.longitude),
      status: body.status,
      occupancy: Number(body.occupancy || 0),
      capacity: Number(body.capacity),
      contactPhone: body.contactPhone,
      facilities: Array.isArray(body.facilities) ? body.facilities : []
    });

    return successResponse(newShelter, 'Emergency shelter registered successfully', 201);
  } catch (err: any) {
    return errorResponse(`Failed to register shelter: ${err.message}`, 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const missingErr = validateRequiredFields(body, ['id', 'occupancy']);
    if (missingErr) return errorResponse(missingErr, 400);

    const updated = dbStore.updateShelterOccupancy(body.id, Number(body.occupancy));
    if (!updated) return errorResponse(`Shelter '${body.id}' not found`, 404);

    return successResponse(updated, 'Shelter occupancy updated successfully');
  } catch (err: any) {
    return errorResponse(`Failed to update shelter occupancy: ${err.message}`, 500);
  }
}
