import { NextRequest } from 'next/server';
import { successResponse, errorResponse, corsHeaders } from '@/lib/apiResponse';
import { validateRequiredFields } from '@/lib/validation';
import { dbStore } from '@/lib/db/store';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  const hospitals = dbStore.getHospitals();
  return successResponse(hospitals, 'Emergency hospitals fetched successfully', 200, { count: hospitals.length });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const missingErr = validateRequiredFields(body, ['id', 'availableBeds']);
    if (missingErr) return errorResponse(missingErr, 400);

    const updated = dbStore.updateHospitalBeds(
      body.id,
      Number(body.availableBeds),
      body.icuBeds !== undefined ? Number(body.icuBeds) : undefined
    );
    if (!updated) return errorResponse(`Hospital '${body.id}' not found`, 404);

    return successResponse(updated, 'Hospital bed capacity updated successfully');
  } catch (err: any) {
    return errorResponse(`Failed to update hospital bed capacity: ${err.message}`, 500);
  }
}
