import { NextRequest } from 'next/server';
import { successResponse, errorResponse, corsHeaders } from '@/lib/apiResponse';
import { dbStore } from '@/lib/db/store';
import { verifyCitizenReport } from '@/lib/ai/confidenceEngine';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reportId } = body;

    if (!reportId) {
      return errorResponse("Missing required field: 'reportId'", 400);
    }

    const allReports = dbStore.getCitizenReports();
    const report = allReports.find((r) => r.id === reportId);
    if (!report) {
      return errorResponse(`Citizen report '${reportId}' not found`, 404);
    }

    const weatherObs = dbStore.getWeatherObservations()[0];
    const verification = verifyCitizenReport(report, allReports, weatherObs);

    return successResponse(verification, `Report '${reportId}' verified successfully`);
  } catch (err: any) {
    return errorResponse(`Failed to verify citizen report: ${err.message}`, 500);
  }
}
