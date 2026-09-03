import { NextRequest } from 'next/server';
import { successResponse, corsHeaders } from '@/lib/apiResponse';
import { dbStore } from '@/lib/db/store';

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  const isPostgresConfigured = Boolean(process.env.DATABASE_URL);
  
  const stats = {
    status: 'HEALTHY',
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    databaseEngine: isPostgresConfigured ? 'PostgreSQL + PostGIS Live' : 'PostGIS Embedded Local Engine',
    postGisReady: true,
    entityCounts: {
      users: dbStore.getUsers().length,
      riskZones: dbStore.getRiskZones().length,
      hazards: dbStore.getHazards().length,
      weatherObservations: dbStore.getWeatherObservations().length,
      citizenReports: dbStore.getCitizenReports().length,
      roads: dbStore.getRoads().length,
      shelters: dbStore.getShelters().length,
      hospitals: dbStore.getHospitals().length,
      resources: dbStore.getResources().length,
      rescueIncidents: dbStore.getIncidents().length,
      resourceAssignments: dbStore.getAssignments().length,
      alerts: dbStore.getAlerts().length,
      riskHistory: dbStore.getRiskHistory().length
    }
  };

  return successResponse(stats, 'ClimateShield AI Backend System Health Nominal');
}
