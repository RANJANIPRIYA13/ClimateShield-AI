import { NextRequest } from 'next/server';
import { successResponse, errorResponse, corsHeaders } from '@/lib/apiResponse';
import { queryClimateCopilot } from '@/lib/ai/copilotEngine';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message || body.query || 'Summarize the current emergency.';

    const copilotResult = queryClimateCopilot(message);

    return successResponse(copilotResult, 'ClimateShield Copilot responded successfully');
  } catch (err: any) {
    return errorResponse(`Failed to execute Copilot query: ${err.message}`, 500);
  }
}
