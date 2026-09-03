import { dbStore } from '@/lib/db/store';

export type SimulationScenario =
  | 'NORMAL'
  | 'HEAVY_RAIN'
  | 'FLOOD_ESCALATION'
  | 'ROAD_CLOSURE'
  | 'NEW_CITIZEN_REPORT'
  | 'SHELTER_CAPACITY_DROP';

export interface SimulationResult {
  scenario: SimulationScenario;
  timestamp: string;
  summary: string;
  affectedEntities: {
    zonesUpdated: number;
    incidentsAdded: number;
    roadsBlocked: number;
    shelterOccupancyPct: number;
    reportsAdded: number;
  };
}

export function triggerSimulationScenario(scenario: SimulationScenario): SimulationResult {
  const timestamp = new Date().toISOString();
  let summary = '';
  let zonesUpdated = 0;
  let incidentsAdded = 0;
  let roadsBlocked = 0;
  let shelterOccupancyPct = 60;
  let reportsAdded = 0;

  switch (scenario) {
    case 'NORMAL': {
      summary = 'Simulation reset to NORMAL baseline monsoonal readiness. Moderate rainfall (12 mm/h), subways clear, 850 shelter beds available.';
      const velachery = dbStore.getRiskZoneById('ZONE-CHN-01');
      if (velachery) {
        dbStore.createRiskZone({
          ...velachery,
          riskScore: 4.2,
          riskLevel: 'Moderate',
          rainfallMmHr: 12.0,
          waterLevelM: 0.20,
          lastUpdated: 'Just now (NORMAL)'
        });
        zonesUpdated++;
      }
      dbStore.updateRoadStatus('RD-CHN-01', 'Open', 10, 'All Vehicles');
      dbStore.updateRoadStatus('RD-CHN-02', 'Open', 15, 'All Vehicles');
      dbStore.updateShelterOccupancy('SHL-CHN-01', 480);
      shelterOccupancyPct = 60;
      break;
    }

    case 'HEAVY_RAIN': {
      summary = 'HEAVY RAIN SCENARIO TRIGGERED: Monsoonal cloudburst recorded at 52.4 mm/h. Velachery & Adyar risk levels escalated to HIGH.';
      const velachery = dbStore.getRiskZoneById('ZONE-CHN-01');
      if (velachery) {
        dbStore.createRiskZone({
          ...velachery,
          riskScore: 8.4,
          riskLevel: 'High',
          rainfallMmHr: 52.4,
          waterLevelM: 1.20,
          lastUpdated: 'Just now (HEAVY RAIN)'
        });
        zonesUpdated++;
      }
      dbStore.createAlert({
        headline: 'CLOUDBURST WARNING: 52.4 mm/h Rainfall Active in Zone 4',
        level: 'Warning',
        issuer: 'GCC EOC Command Center',
        actionRequired: 'Prepare emergency supplies and avoid lowlands',
        affectedZones: ['Velachery', 'Adyar', 'Saidapet'],
        broadcastChannels: ['SMS', 'Sirens', 'EOC Dashboard'],
        expiresAt: '2026-09-05T00:00:00Z'
      });
      break;
    }

    case 'FLOOD_ESCALATION': {
      summary = 'CRITICAL FLOOD ESCALATION: Basin breach reached +1.85m in Velachery Lowlands. Risk score escalated to 9.4 CRITICAL. Evacuation Order Broadcast.';
      const velachery = dbStore.getRiskZoneById('ZONE-CHN-01');
      if (velachery) {
        dbStore.createRiskZone({
          ...velachery,
          riskScore: 9.4,
          riskLevel: 'Critical',
          rainfallMmHr: 68.0,
          waterLevelM: 1.85,
          recommendedAction: 'IMMEDIATE EVACUATION ORDER: All ground floor residents relocate to Velachery Shelter now.',
          lastUpdated: 'Just now (CRITICAL FLOOD)'
        });
        zonesUpdated++;
      }

      // Generate simulation emergency incident
      dbStore.createIncident({
        title: 'SIMULATION: Lake View Apartment Evacuation Emergency',
        type: 'Boat Evacuation',
        priority: 'Critical',
        status: 'Pending',
        zoneId: 'ZONE-CHN-01',
        location: 'Lake View Colony 3rd Cross Street, Velachery',
        assignee: 'Unassigned',
        description: 'Simulated breach: 45 residents stranded on 1st floor balcony needing immediate boat extraction.',
        unitsDispatched: 0
      });
      incidentsAdded++;
      break;
    }

    case 'ROAD_CLOSURE': {
      summary = 'ROAD CLOSURE SCENARIO: Saidapet Railway Subway blocked (140cm standing water). Velachery Main Road flooded (75cm depth). Safe route cost penalties updated.';
      dbStore.updateRoadStatus('RD-CHN-02', 'Blocked', 140, 'Impassable');
      dbStore.updateRoadStatus('RD-CHN-01', 'Flooded', 75, 'Boats Only');
      roadsBlocked = 2;
      break;
    }

    case 'NEW_CITIZEN_REPORT': {
      summary = 'NEW CITIZEN REPORT LOGGED: Citizen reported 3ft standing water near Vijayanagar Bus Stand. Transmitted to EOC Triage Desk.';
      dbStore.createCitizenReport({
        userName: 'Citizen Reporter (Vijayanagar)',
        category: 'Flash Flood / High Water Level',
        locationName: 'Vijayanagar Bus Terminus Junction',
        latitude: 12.9770,
        longitude: 80.2210,
        urgency: 'Critical',
        description: 'Simulated ground report: Standing water depth 3ft near bus stand entrance.'
      });
      reportsAdded++;
      break;
    }

    case 'SHELTER_CAPACITY_DROP': {
      summary = 'SHELTER CAPACITY DROP: 300 evacuees admitted to Velachery Shelter. Capacity occupancy spiked from 60% to 97.5% (780 / 800 beds). WARNING: Near Full.';
      dbStore.updateShelterOccupancy('SHL-CHN-01', 780);
      shelterOccupancyPct = 97.5;
      break;
    }
  }

  return {
    scenario,
    timestamp,
    summary,
    affectedEntities: {
      zonesUpdated,
      incidentsAdded,
      roadsBlocked,
      shelterOccupancyPct,
      reportsAdded
    }
  };
}
