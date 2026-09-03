import { NextRequest } from 'next/server';
import { successResponse, errorResponse, corsHeaders } from '@/lib/apiResponse';
import { triggerSimulationScenario, SimulationScenario } from '@/lib/ai/simulationEngine';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const scenario: SimulationScenario = body.scenario || 'NORMAL';

    const result = triggerSimulationScenario(scenario);

    return successResponse(result, `Simulation scenario '${scenario}' executed successfully`);
  } catch (err: any) {
    return errorResponse(`Failed to execute simulation scenario: ${err.message}`, 500);
  }
}
