import { RescueIncidentEntity } from '@/lib/db/types';

export interface RescuePriorityExplanation {
  incidentId: string;
  location: string;
  priorityScore: number; // 0 - 100
  priorityRank: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidencePct: number; // 0 - 100%
  breakdown: {
    severityScore: number;
    vulnerabilityScore: number;
    ageScore: number;
    distanceScore: number;
    infraFailureScore: number;
  };
  reasons: string[];
  recommendedAction: string;
  disclaimer: string;
}

export function calculateRescuePriority(incident: RescueIncidentEntity): RescuePriorityExplanation {
  const reasons: string[] = [];

  // 1. Severity Factor (0 - 25 pts)
  // Scaled from severity (0 - 10) or water level
  const rawSev = incident.severity === 'Critical' ? 10 : incident.severity === 'High' ? 8 : incident.severity === 'Medium' ? 5 : 3;
  const severityScore = Math.min(25, Math.round((rawSev / 10) * 25));
  reasons.push(`• Risk Severity: Rated ${rawSev}/10 (${incident.severity}) -> ${severityScore}/25 pts`);

  // 2. Vulnerable Population Factor (0 - 25 pts)
  // Higher proportion of elderly/children increases score
  const vulnPeople = incident.vulnerablePeople || 10;
  const totalAffected = incident.peopleAffected || 50;
  const vulnRatio = totalAffected > 0 ? vulnPeople / totalAffected : 0.2;
  const vulnerabilityScore = Math.min(25, Math.round(vulnRatio * 50));
  reasons.push(`• Demographics: ${vulnPeople} vulnerable out of ${totalAffected} affected (${Math.round(vulnRatio * 100)}%) -> ${vulnerabilityScore}/25 pts`);

  // 3. Incident Age Factor (0 - 20 pts)
  // Older unhandled incidents gain urgency
  const ageMins = incident.incidentAgeMins || 30;
  const ageScore = Math.min(20, Math.round((ageMins / 90) * 20));
  reasons.push(`• Incident Age: Elapsed ${ageMins} mins since emergency call -> ${ageScore}/20 pts`);

  // 4. Distance From Help Factor (0 - 15 pts)
  // Farther distances require urgent staging
  const distKm = incident.distanceFromHelpKm || 2.5;
  const distanceScore = Math.min(15, Math.round((distKm / 5) * 15));
  reasons.push(`• Staging Distance: ${distKm} km from nearest rescue depot -> ${distanceScore}/15 pts`);

  // 5. Infrastructure Failure Factor (0 - 15 pts)
  // Road blockages, power grid failures, subway submersions
  const hasSubwayBlock = incident.infrastructureFailure?.toLowerCase().includes('subway') || incident.location.toLowerCase().includes('subway');
  const infraFailureScore = hasSubwayBlock ? 15 : incident.infrastructureFailure ? 10 : 5;
  reasons.push(`• Infrastructure Failure: ${incident.infrastructureFailure || 'Standard access route'} -> ${infraFailureScore}/15 pts`);

  // Total Priority Score (0 - 100)
  const priorityScore = Math.min(100, Math.max(0,
    severityScore + vulnerabilityScore + ageScore + distanceScore + infraFailureScore
  ));

  // Rank Mapping
  let priorityRank: RescuePriorityExplanation['priorityRank'] = 'LOW';
  if (priorityScore >= 75) {
    priorityRank = 'CRITICAL';
  } else if (priorityScore >= 50) {
    priorityRank = 'HIGH';
  } else if (priorityScore >= 25) {
    priorityRank = 'MEDIUM';
  } else {
    priorityRank = 'LOW';
  }

  // Confidence Score (0 - 100%)
  const confidencePct = Math.min(98, Math.max(85, incident.confidencePct || 92));

  // Recommended Action
  let recommendedAction = '';
  if (priorityRank === 'CRITICAL') {
    recommendedAction = `DISPATCH IMMEDIATE AIRBOAT & NDRF SWIFT-WATER TEAM: Deploy ${incident.vulnerablePeople} life preservers and emergency medical kits to ${incident.location}.`;
  } else if (priorityRank === 'HIGH') {
    recommendedAction = `DISPATCH TACTICAL AMBULANCE & PUMP UNIT: Stage 108 ALS unit and dewatering pump at ${incident.location}.`;
  } else if (priorityRank === 'MEDIUM') {
    recommendedAction = `MONITOR & STAGE FOOD/WATER DISPENSARY: Supply relief food packets to ${incident.location}.`;
  } else {
    recommendedAction = `STANDARD MONITORING: Monitor ground status at ${incident.location}.`;
  }

  return {
    incidentId: incident.id,
    location: incident.location,
    priorityScore,
    priorityRank,
    confidencePct,
    breakdown: {
      severityScore,
      vulnerabilityScore,
      ageScore,
      distanceScore,
      infraFailureScore
    },
    reasons,
    recommendedAction,
    disclaimer: 'AI-assisted decision support • Rescue Priority Product Model'
  };
}
