export interface UserEntity {
  id: string;
  name: string;
  email: string;
  role: 'Citizen' | 'Authority' | 'Responder' | 'Admin';
  phone?: string;
  zoneId?: string;
  createdAt: string;
}

export interface RiskZoneEntity {
  id: string;
  name: string;
  city: string;
  sectorCode: string;
  baseRiskLevel: 'Critical' | 'Warning' | 'Advisory' | 'Safe';
  population: number;
  vulnerablePopulation: number;
  riskScore: number;
  riskLevel: 'Critical' | 'High' | 'Moderate' | 'Low';
  confidencePct: number;
  rainfallMmHr: number;
  waterLevelM: number;
  elevationM: number;
  historicalRisk: string;
  lastUpdated: string;
  category: 'Flood' | 'Heat' | 'Cyclone' | 'Landslide';
  contributingFactors: string[];
  recommendedAction: string;
  polygonCoords: [number, number][];
  boundaryGeojson?: any;
  createdAt: string;
}

export interface HazardEntity {
  id: string;
  title: string;
  category: 'Flood' | 'Heatwave' | 'Hurricane' | 'Wildfire' | 'Storm Surge' | 'Waterlogging';
  severity: 'Critical' | 'Warning' | 'Advisory' | 'Safe';
  probability: number;
  impactScore: number;
  zoneId: string;
  locationName: string;
  latitude: number;
  longitude: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  affectedPopulation: number;
  description: string;
  createdAt: string;
}

export interface WeatherObservationEntity {
  id: string;
  zoneId: string;
  temperatureC: number;
  rainfallMmHr: number;
  humidityPct: number;
  riverLevelM: number;
  windSpeedKmh: number;
  recordedAt: string;
}

export interface CitizenReportEntity {
  id: string;
  userId?: string;
  userName: string;
  category: string;
  locationName: string;
  latitude: number;
  longitude: number;
  status: 'Pending' | 'Triaged' | 'Dispatched' | 'Resolved';
  urgency: 'Critical' | 'Warning' | 'Advisory';
  description: string;
  createdAt: string;
}

export interface RoadEntity {
  id: string;
  name: string;
  zoneId: string;
  status: 'Open' | 'Flooded' | 'Blocked' | 'Restricted';
  waterDepthCm: number;
  passability: 'All Vehicles' | '4x4 Only' | 'Boats Only' | 'Impassable';
  updatedAt: string;
}

export interface ShelterEntity {
  id: string;
  name: string;
  address: string;
  zoneId: string;
  latitude: number;
  longitude: number;
  status: 'Open' | 'Full' | 'Standby' | 'Closed';
  occupancy: number;
  capacity: number;
  contactPhone: string;
  facilities: string[];
  createdAt: string;
}

export interface HospitalEntity {
  id: string;
  name: string;
  address: string;
  zoneId: string;
  latitude: number;
  longitude: number;
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  powerBackup: boolean;
  contactPhone: string;
  createdAt: string;
}

export interface ResourceEntity {
  id: string;
  name: string;
  category: 'Vehicles' | 'Medical Supplies' | 'Power Systems' | 'Water & Food' | 'Personnel';
  status: 'Ready' | 'Deployed' | 'Maintenance' | 'Depleted';
  totalUnits: number;
  availableUnits: number;
  depotLocation: string;
  lastMaintenance: string;
  createdAt: string;
}

export interface RescueIncidentEntity {
  id: string;
  title: string;
  type: string;
  priority: 'Critical' | 'Warning' | 'Advisory' | 'Safe' | 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Dispatched' | 'Resolved' | 'Unassigned';
  zoneId: string;
  location: string;
  assignee: string;
  description: string;
  unitsDispatched: number;
  createdAt: string;
  // Enhanced Rescue Priority & Triage Metrics
  severity?: 'Critical' | 'High' | 'Medium' | 'Low';
  confidencePct?: number;
  peopleAffected?: number;
  vulnerablePeople?: number;
  waterLevelM?: number;
  incidentAgeMins?: number;
  distanceFromHelpKm?: number;
  infrastructureFailure?: string;
  priorityRank?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  priorityScore?: number;
  assignedResourceIds?: string[];
}

export interface ResourceAssignmentEntity {
  id: string;
  incidentId: string;
  resourceId: string;
  unitsAssigned: number;
  status: 'Active' | 'Completed' | 'Recalled';
  assignedAt: string;
}

export interface AlertEntity {
  id: string;
  headline: string;
  level: 'Critical' | 'Warning' | 'Advisory' | 'Safe';
  issuer: string;
  actionRequired: string;
  affectedZones: string[];
  broadcastChannels: string[];
  issuedAt: string;
  expiresAt: string;
}

export interface RiskHistoryEntity {
  id: string;
  zoneId: string;
  riskScore: number;
  waterLevelM: number;
  powerOutagePct: number;
  recordedAt: string;
}
