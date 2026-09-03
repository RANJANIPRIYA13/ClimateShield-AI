import { NextRequest } from 'next/server';
import { successResponse, errorResponse, corsHeaders } from '@/lib/apiResponse';
import { validateRequiredFields, validateEnum, validateCoordinates } from '@/lib/validation';
import { dbStore } from '@/lib/db/store';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  const reports = dbStore.getCitizenReports();
  return successResponse(reports, 'Citizen reports fetched successfully', 200, { count: reports.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const missingErr = validateRequiredFields(body, [
      'userName', 'category', 'locationName', 'latitude', 'longitude', 'urgency', 'description'
    ]);
    if (missingErr) return errorResponse(missingErr, 400);

    const urgErr = validateEnum(body.urgency, ['Critical', 'Warning', 'Advisory'], 'urgency');
    if (urgErr) return errorResponse(urgErr, 400);

    const coordErr = validateCoordinates(Number(body.latitude), Number(body.longitude));
    if (coordErr) return errorResponse(coordErr, 400);

    const newReport = dbStore.createCitizenReport({
      userId: body.userId,
      userName: body.userName,
      category: body.category,
      locationName: body.locationName,
      latitude: Number(body.latitude),
      longitude: Number(body.longitude),
      urgency: body.urgency,
      description: body.description
    });

    return successResponse(newReport, 'Citizen report submitted to EOC triage desk', 201);
  } catch (err: any) {
    return errorResponse(`Failed to submit citizen report: ${err.message}`, 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const missingErr = validateRequiredFields(body, ['id', 'status']);
    if (missingErr) return errorResponse(missingErr, 400);

    const statusErr = validateEnum(body.status, ['Pending', 'Triaged', 'Dispatched', 'Resolved'], 'status');
    if (statusErr) return errorResponse(statusErr, 400);

    const updated = dbStore.updateCitizenReportStatus(body.id, body.status);
    if (!updated) return errorResponse(`Citizen report '${body.id}' not found`, 404);

    return successResponse(updated, 'Citizen report status updated successfully');
  } catch (err: any) {
    return errorResponse(`Failed to update citizen report status: ${err.message}`, 500);
  }
}
