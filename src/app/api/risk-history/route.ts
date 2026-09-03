import { NextRequest } from 'next/server';
import { successResponse, corsHeaders } from '@/lib/apiResponse';
import { dbStore } from '@/lib/db/store';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  const history = dbStore.getRiskHistory();
  return successResponse(history, 'Historical risk telemetry fetched successfully', 200, { count: history.length });
}
