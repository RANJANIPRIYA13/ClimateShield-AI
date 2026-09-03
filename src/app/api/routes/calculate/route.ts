import { NextRequest } from 'next/server';
import { successResponse, errorResponse, corsHeaders } from '@/lib/apiResponse';
import { calculateSafeRoutes } from '@/lib/ai/routeEngine';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Default query params if body empty
    }

    const origin = body.origin || 'Velachery Lowlands (Zone 4)';
    const destination = body.destination || 'Velachery Community Hall Shelter';

    const result = calculateSafeRoutes(origin, destination);

    return successResponse(result, 'Calculated route options successfully');
  } catch (err: any) {
    return errorResponse(`Failed to calculate safe routes: ${err.message}`, 500);
  }
}
