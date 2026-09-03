import { NextRequest } from 'next/server';
import { successResponse, errorResponse, corsHeaders } from '@/lib/apiResponse';
import { dbStore } from '@/lib/db/store';
import { calculateZoneRisk } from '@/lib/ai/riskEngine';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Empty body is valid to trigger recalculation across all sectors
    }

    const { zoneId } = body;

    if (zoneId) {
      const zone = dbStore.getRiskZoneById(zoneId);
      if (!zone) {
        return errorResponse(`Risk zone '${zoneId}' not found`, 404);
      }

      const activeReports = dbStore.getCitizenReports().filter((r) => r.status !== 'Resolved');
      const explanation = calculateZoneRisk(zone, activeReports.length);

      // Update zone in database store with recalculated scores
      dbStore.createRiskZone({
        ...zone,
        riskScore: explanation.score / 10,
        riskLevel: explanation.level === 'CRITICAL' ? 'Critical' : explanation.level === 'HIGH' ? 'High' : explanation.level === 'MODERATE' ? 'Moderate' : 'Low',
        confidencePct: explanation.confidence,
        recommendedAction: explanation.recommended_action,
        lastUpdated: 'Just recalculated by AI Engine'
      });

      return successResponse(explanation, `Risk score calculated for ${zone.name} successfully`, 200);
    }

    // Batch Calculation Across All Chennai Sectors
    const allZones = dbStore.getRiskZones();
    const activeReports = dbStore.getCitizenReports().filter((r) => r.status !== 'Resolved');
    
    const explanations = allZones.map((zone) => {
      const exp = calculateZoneRisk(zone, activeReports.length);
      return exp;
    });

    return successResponse(
      explanations,
      `Calculated risk models across ${explanations.length} Chennai sectors`,
      200,
      { count: explanations.length }
    );
  } catch (err: any) {
    return errorResponse(`Failed to calculate risk model: ${err.message}`, 500);
  }
}
