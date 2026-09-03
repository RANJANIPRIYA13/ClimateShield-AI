import { NextRequest } from 'next/server';
import { successResponse, errorResponse, corsHeaders } from '@/lib/apiResponse';
import { validateRequiredFields, validateEnum } from '@/lib/validation';
import { dbStore } from '@/lib/db/store';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  const alerts = dbStore.getAlerts();
  return successResponse(alerts, 'Emergency alerts fetched successfully', 200, { count: alerts.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const missingErr = validateRequiredFields(body, [
      'headline', 'level', 'issuer', 'actionRequired', 'affectedZones'
    ]);
    if (missingErr) return errorResponse(missingErr, 400);

    const levelErr = validateEnum(body.level, ['Critical', 'Warning', 'Advisory', 'Safe'], 'level');
    if (levelErr) return errorResponse(levelErr, 400);

    const newAlert = dbStore.createAlert({
      headline: body.headline,
      level: body.level,
      issuer: body.issuer,
      actionRequired: body.actionRequired,
      affectedZones: Array.isArray(body.affectedZones) ? body.affectedZones : [body.affectedZones],
      broadcastChannels: Array.isArray(body.broadcastChannels) ? body.broadcastChannels : ['EAS Broadcast'],
      expiresAt: body.expiresAt || new Date(Date.now() + 12 * 3600 * 1000).toISOString()
    });

    return successResponse(newAlert, 'Emergency alert broadcast dispatched successfully', 201);
  } catch (err: any) {
    return errorResponse(`Failed to dispatch alert: ${err.message}`, 500);
  }
}
