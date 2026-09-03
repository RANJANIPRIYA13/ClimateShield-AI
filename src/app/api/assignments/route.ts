import { NextRequest } from 'next/server';
import { successResponse, errorResponse, corsHeaders } from '@/lib/apiResponse';
import { validateRequiredFields, validateEnum } from '@/lib/validation';
import { dbStore } from '@/lib/db/store';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  const assignments = dbStore.getAssignments();
  return successResponse(assignments, 'Resource assignments fetched successfully', 200, { count: assignments.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const missingErr = validateRequiredFields(body, ['incidentId', 'resourceId', 'unitsAssigned']);
    if (missingErr) return errorResponse(missingErr, 400);

    const status = body.status || 'Active';
    const statusErr = validateEnum(status, ['Active', 'Completed', 'Recalled'], 'status');
    if (statusErr) return errorResponse(statusErr, 400);

    const newAssignment = dbStore.createAssignment({
      incidentId: body.incidentId,
      resourceId: body.resourceId,
      unitsAssigned: Number(body.unitsAssigned),
      status
    });

    return successResponse(newAssignment, 'Resource assigned to rescue incident successfully', 201);
  } catch (err: any) {
    return errorResponse(`Failed to create resource assignment: ${err.message}`, 500);
  }
}
