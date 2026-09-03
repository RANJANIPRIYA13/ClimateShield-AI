import { NextRequest } from 'next/server';
import { successResponse, errorResponse, corsHeaders } from '@/lib/apiResponse';
import { validateRequiredFields, validateEnum } from '@/lib/validation';
import { dbStore } from '@/lib/db/store';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  const incidents = dbStore.getIncidents();
  return successResponse(incidents, 'Rescue incidents fetched successfully', 200, { count: incidents.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const missingErr = validateRequiredFields(body, [
      'title', 'type', 'priority', 'status', 'zoneId', 'location', 'description'
    ]);
    if (missingErr) return errorResponse(missingErr, 400);

    const typeErr = validateEnum(body.type, ['Infrastructure', 'Medical', 'Evacuation', 'Environmental'], 'type');
    if (typeErr) return errorResponse(typeErr, 400);

    const prioErr = validateEnum(body.priority, ['Critical', 'Warning', 'Advisory', 'Safe'], 'priority');
    if (prioErr) return errorResponse(prioErr, 400);

    const statusErr = validateEnum(body.status, ['Unassigned', 'In Progress', 'Resolved', 'Dispatched'], 'status');
    if (statusErr) return errorResponse(statusErr, 400);

    const newInc = dbStore.createIncident({
      title: body.title,
      type: body.type,
      priority: body.priority,
      status: body.status,
      zoneId: body.zoneId,
      location: body.location,
      assignee: body.assignee || 'Unassigned',
      description: body.description,
      unitsDispatched: Number(body.unitsDispatched || 0)
    });

    return successResponse(newInc, 'Rescue incident logged successfully', 201);
  } catch (err: any) {
    return errorResponse(`Failed to log rescue incident: ${err.message}`, 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return errorResponse("Missing required field: 'id'", 400);
    }

    const existing = dbStore.getIncidents().find((i) => i.id === body.id);
    if (!existing) {
      return errorResponse(`Rescue incident '${body.id}' not found`, 404);
    }

    const updated = dbStore.createIncident({
      ...existing,
      status: body.status || existing.status,
      unitsDispatched: body.unitsDispatched !== undefined ? Number(body.unitsDispatched) : existing.unitsDispatched,
      assignee: body.assignee || existing.assignee,
      assignedResourceIds: body.assignedResourceIds || existing.assignedResourceIds
    });

    return successResponse(updated, `Incident '${body.id}' updated successfully`);
  } catch (err: any) {
    return errorResponse(`Failed to update incident dispatch: ${err.message}`, 500);
  }
}
