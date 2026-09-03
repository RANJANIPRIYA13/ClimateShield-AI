import { NextRequest } from 'next/server';
import { successResponse, errorResponse, corsHeaders } from '@/lib/apiResponse';
import { dbStore } from '@/lib/db/store';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function POST() {
  try {
    dbStore.seedAll();
    return successResponse({
      reseeded: true,
      timestamp: new Date().toISOString(),
      entities: {
        users: dbStore.getUsers().length,
        riskZones: dbStore.getRiskZones().length,
        hazards: dbStore.getHazards().length,
        weather: dbStore.getWeatherObservations().length,
        citizenReports: dbStore.getCitizenReports().length,
        roads: dbStore.getRoads().length,
        shelters: dbStore.getShelters().length,
        hospitals: dbStore.getHospitals().length,
        resources: dbStore.getResources().length,
        incidents: dbStore.getIncidents().length,
        assignments: dbStore.getAssignments().length,
        alerts: dbStore.getAlerts().length,
        riskHistory: dbStore.getRiskHistory().length
      }
    }, 'Database re-seeded with Chennai disaster telemetry successfully');
  } catch (err: any) {
    return errorResponse(`Failed to re-seed database: ${err.message}`, 500);
  }
}
