import { NextRequest } from 'next/server';
import { successResponse, errorResponse, corsHeaders } from '@/lib/apiResponse';
import { validateRequiredFields, validateEnum } from '@/lib/validation';
import { dbStore } from '@/lib/db/store';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  const resources = dbStore.getResources();
  return successResponse(resources, 'Emergency resources fetched successfully', 200, { count: resources.length });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const missingErr = validateRequiredFields(body, ['id', 'status']);
    if (missingErr) return errorResponse(missingErr, 400);

    const statusErr = validateEnum(body.status, ['Ready', 'Deployed', 'Maintenance', 'Depleted'], 'status');
    if (statusErr) return errorResponse(statusErr, 400);

    const updated = dbStore.updateResourceStatus(
      body.id,
      body.status,
      body.availableUnits !== undefined ? Number(body.availableUnits) : undefined
    );
    if (!updated) return errorResponse(`Resource '${body.id}' not found`, 404);

    return successResponse(updated, 'Resource deployment status updated successfully');
  } catch (err: any) {
    return errorResponse(`Failed to update resource status: ${err.message}`, 500);
  }
}
