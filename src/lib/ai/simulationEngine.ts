import { dbStore } from '@/lib/db/store';
import { dispatchSMSAlert, generateIVRPayload, createMeshPacket, encodeRadioReadyMessage } from '@/lib/resilience/commLayer';

export type SimulationScenario =
  | 'NORMAL'
  | 'HEAVY_RAIN'
  | 'HYPERLOCAL_RISK_INCREASE'
  | 'WATER_LEVEL_RISE'
  | 'CITIZEN_REPORT'
  | 'ROAD_BECOMES_UNSAFE'
  | 'RISK_SCORE_RECALCULATES'
  | 'SAFE_ROUTE_RECALCULATES'
  | 'SHELTER_RECOMMENDATION_CHANGES'
  | 'RESCUE_PRIORITY_CHANGES'
  | 'AUTHORITY_ALERT'
  | 'INTERNET_FAILURE'
  | 'RESILIENT_FALLBACK'
  | 'OFFLINE_RESILIENCE_CONFIRMED'
  | 'FLOOD_ESCALATION'
  | 'ROAD_CLOSURE'
  | 'NEW_CITIZEN_REPORT'
  | 'SHELTER_CAPACITY_DROP';

export interface SimulationResult {
  scenario: SimulationScenario;
  timestamp: string;
  summary: string;
  stepNumber?: number;
  totalSteps?: number;
  resiliencePayloads?: {
    smsMessage?: string;
    ivrScript?: string;
    meshRelayPacketId?: string;
    radioCompactString?: string;
  };
  affectedEntities: {
    zonesUpdated: number;
    incidentsAdded: number;
    roadsBlocked: number;
    shelterOccupancyPct: number;
    reportsAdded: number;
  };
}

export async function triggerSimulationScenario(scenario: SimulationScenario): Promise<SimulationResult> {
  const timestamp = new Date().toISOString();
  let summary = '';
  let zonesUpdated = 0;
  let incidentsAdded = 0;
  let roadsBlocked = 0;
  let shelterOccupancyPct = 60;
  let reportsAdded = 0;
  let resiliencePayloads: SimulationResult['resiliencePayloads'] = undefined;
  let stepNumber = 1;

  switch (scenario) {
    case 'NORMAL': {
      stepNumber = 1;
      summary = '1. NORMAL BASELINE: Standard monsoonal readiness. Moderate rain (12 mm/h), roads clear, 850 shelter beds open.';
      const velachery = dbStore.getRiskZoneById('ZONE-CHN-01');
      if (velachery) {
        dbStore.createRiskZone({
          ...velachery,
          riskScore: 3.8,
          riskLevel: 'Low',
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
      stepNumber = 2;
      summary = '2. HEAVY RAIN INITIATED: Monsoonal cloudburst recorded at 62.4 mm/h across Velachery & Adyar basins.';
      const velachery = dbStore.getRiskZoneById('ZONE-CHN-01');
      if (velachery) {
        dbStore.createRiskZone({
          ...velachery,
          riskScore: 7.2,
          riskLevel: 'High',
          rainfallMmHr: 62.4,
          waterLevelM: 0.85,
          lastUpdated: 'Just now (HEAVY RAIN)'
        });
        zonesUpdated++;
      }
      break;
    }

    case 'HYPERLOCAL_RISK_INCREASE': {
      stepNumber = 3;
      summary = '3. HYPERLOCAL RISK INCREASE: Velachery Ward 177 street-level risk spikes to 86/100 (HIGH RISK).';
      const velachery = dbStore.getRiskZoneById('ZONE-CHN-01');
      if (velachery) {
        dbStore.createRiskZone({
          ...velachery,
          riskScore: 8.6,
          riskLevel: 'High',
          rainfallMmHr: 72.0,
          waterLevelM: 1.10,
          lastUpdated: 'Just now (RISK INCREASE)'
        });
        zonesUpdated++;
      }
      break;
    }

    case 'WATER_LEVEL_RISE': {
      stepNumber = 4;
      summary = '4. WATER LEVEL RISE: Ultrasonic sensor #04 logs standing water rise +1.75m at Madipakkam Railway Subway.';
      const velachery = dbStore.getRiskZoneById('ZONE-CHN-01');
      if (velachery) {
        dbStore.createRiskZone({
          ...velachery,
          riskScore: 9.1,
          riskLevel: 'Critical',
          waterLevelM: 1.75,
          lastUpdated: 'Just now (WATER LEVEL RISE)'
        });
        zonesUpdated++;
      }
      break;
    }

    case 'NEW_CITIZEN_REPORT':
    case 'CITIZEN_REPORT': {
      stepNumber = 5;
      summary = '5. CITIZEN REPORT FIRED: 4 verified citizen reports submitted with GPS & high water level photos in Velachery.';
      dbStore.createCitizenReport({
        userName: 'Citizen Reporter (Velachery)',
        category: 'Flash Flood / High Water Level',
        locationName: '100 Feet Bypass Junction',
        latitude: 12.9810,
        longitude: 80.2200,
        urgency: 'Critical',
        description: 'Standing water level 4ft near subway. Cars stalling.'
      });
      reportsAdded++;
      break;
    }

    case 'ROAD_CLOSURE':
    case 'ROAD_BECOMES_UNSAFE': {
      stepNumber = 6;
      summary = '6. ROAD BECOMES UNSAFE: 100 Feet Bypass Road & Madipakkam Subway declared BLOCKED (Boats/High Clearance Only).';
      dbStore.updateRoadStatus('RD-CHN-02', 'Blocked', 175, 'Impassable');
      dbStore.updateRoadStatus('RD-CHN-01', 'Flooded', 85, 'Boats Only');
      roadsBlocked = 2;
      break;
    }

    case 'RISK_SCORE_RECALCULATES': {
      stepNumber = 7;
      summary = '7. RISK SCORE RECALCULATED: Risk Engine recalculates Velachery Ward 177 score to 94/100 (CRITICAL).';
      const velachery = dbStore.getRiskZoneById('ZONE-CHN-01');
      if (velachery) {
        dbStore.createRiskZone({
          ...velachery,
          riskScore: 9.4,
          riskLevel: 'Critical',
          rainfallMmHr: 78.0,
          waterLevelM: 1.95,
          recommendedAction: 'IMMEDIATE EVACUATION ORDER: Evacuate lowlands via GST Road flyover.',
          lastUpdated: 'Just now (CRITICAL RECALCULATION)'
        });
        zonesUpdated++;
      }
      break;
    }

    case 'SAFE_ROUTE_RECALCULATES': {
      stepNumber = 8;
      summary = '8. SAFE ROUTE RECALCULATED: Primary subway route penalized (+999). Safe route dynamically detoured via GST Road flyover.';
      break;
    }

    case 'SHELTER_CAPACITY_DROP':
    case 'SHELTER_RECOMMENDATION_CHANGES': {
      stepNumber = 9;
      summary = '9. SHELTER RECOMMENDATION CHANGE: Shift evacuees from ground floor school to Perungudi Community Relief Center.';
      dbStore.updateShelterOccupancy('SHL-CHN-01', 780);
      shelterOccupancyPct = 97.5;
      break;
    }

    case 'RESCUE_PRIORITY_CHANGES': {
      stepNumber = 10;
      summary = '10. RESCUE PRIORITY ESCALATED: Incident #INC-4821 escalated to PRIORITY 1 CRITICAL (Vulnerable pop density = high).';
      dbStore.createIncident({
        title: 'SIMULATION: Velachery Balaji Nagar Evacuation',
        type: 'Boat Evacuation',
        priority: 'Critical',
        status: 'Pending',
        zoneId: 'ZONE-CHN-01',
        location: 'Balaji Nagar 2nd Street, Velachery',
        assignee: 'Unassigned',
        description: 'Simulated breach: 32 elderly residents stranded. Water depth +1.6m.',
        unitsDispatched: 0
      });
      incidentsAdded++;
      break;
    }

    case 'AUTHORITY_ALERT': {
      stepNumber = 11;
      summary = '11. AUTHORITY ALERT ISSUED: EOC auto-dispatches NDRF Swift Water Team 4 + 2 dewatering pumps to Velachery.';
      dbStore.createAlert({
        headline: 'CRITICAL EOC DISPATCH: Evacuation Order for Velachery Sector 4',
        level: 'Critical',
        issuer: 'GCC EOC Command Center',
        actionRequired: 'NDRF Unit 4 & SDRF Boat Teams deployed. Evacuate immediately.',
        affectedZones: ['Velachery'],
        broadcastChannels: ['SMS', 'Sirens', 'EOC Dashboard'],
        expiresAt: '2026-09-05T12:00:00Z'
      });
      break;
    }

    case 'INTERNET_FAILURE': {
      stepNumber = 12;
      summary = '12. INTERNET FAILURE SIMULATED: Cellular tower power loss & fiber cable damage detected. Main internet OFFLINE.';
      break;
    }

    case 'RESILIENT_FALLBACK': {
      stepNumber = 13;
      summary = '13. RESILIENT FALLBACK ACTIVATED: SMS alert dispatched, IVR call queued, BLE Mesh packet created, Radio string generated.';
      
      const sms = dispatchSMSAlert({
        alertId: 'ALT-9821',
        area: 'Velachery Ward 177',
        riskScore: 94,
        riskLevel: 'CRITICAL',
        actionRequired: 'Evacuate via GST Road flyover immediately',
        nearestShelter: 'Perungudi Relief Center',
        timestamp
      });

      const ivr = generateIVRPayload('Velachery', 94, 'Evacuate via GST Road flyover immediately', 'en');
      const mesh = createMeshPacket('Velachery', 94, 'Evacuate lowlands via GST Road flyover');
      const radio = encodeRadioReadyMessage('ALT-9821', 'Velachery', 'CRITICAL', 'EVACUATE_VIA_GST_ROAD', 4);

      resiliencePayloads = {
        smsMessage: (await Promise.resolve(sms)).formattedSMS,
        ivrScript: ivr.voiceScript,
        meshRelayPacketId: mesh.packetId,
        radioCompactString: radio.compactRawString
      };
      break;
    }

    case 'OFFLINE_RESILIENCE_CONFIRMED': {
      stepNumber = 14;
      summary = '14. OFFLINE RESILIENCE CONFIRMED: Citizen devices receive emergency directions via Service Worker + SMS + BLE Mesh without internet!';
      break;
    }

    case 'FLOOD_ESCALATION': {
      stepNumber = 7;
      summary = 'CRITICAL FLOOD ESCALATION: Basin breach reached +1.85m in Velachery Lowlands. Risk score escalated to 9.4 CRITICAL.';
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
      break;
    }

    default:
      summary = `Simulation step ${scenario} executed.`;
  }

  return {
    scenario,
    timestamp,
    summary,
    stepNumber,
    totalSteps: 14,
    resiliencePayloads,
    affectedEntities: {
      zonesUpdated,
      incidentsAdded,
      roadsBlocked,
      shelterOccupancyPct,
      reportsAdded
    }
  };
}
