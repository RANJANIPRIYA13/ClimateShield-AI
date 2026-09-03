import {
  UserEntity,
  RiskZoneEntity,
  HazardEntity,
  WeatherObservationEntity,
  CitizenReportEntity,
  RoadEntity,
  ShelterEntity,
  HospitalEntity,
  ResourceEntity,
  RescueIncidentEntity,
  ResourceAssignmentEntity,
  AlertEntity,
  RiskHistoryEntity
} from './types';
import {
  SEED_USERS,
  SEED_RISK_ZONES,
  SEED_HAZARDS,
  SEED_WEATHER,
  SEED_CITIZEN_REPORTS,
  SEED_ROADS,
  SEED_SHELTERS,
  SEED_HOSPITALS,
  SEED_RESOURCES,
  SEED_INCIDENTS,
  SEED_ASSIGNMENTS,
  SEED_ALERTS,
  SEED_RISK_HISTORY
} from './seedData';

class PostGISDataStore {
  private users: Map<string, UserEntity> = new Map();
  private riskZones: Map<string, RiskZoneEntity> = new Map();
  private hazards: Map<string, HazardEntity> = new Map();
  private weather: Map<string, WeatherObservationEntity> = new Map();
  private citizenReports: Map<string, CitizenReportEntity> = new Map();
  private roads: Map<string, RoadEntity> = new Map();
  private shelters: Map<string, ShelterEntity> = new Map();
  private hospitals: Map<string, HospitalEntity> = new Map();
  private resources: Map<string, ResourceEntity> = new Map();
  private rescueIncidents: Map<string, RescueIncidentEntity> = new Map();
  private resourceAssignments: Map<string, ResourceAssignmentEntity> = new Map();
  private alerts: Map<string, AlertEntity> = new Map();
  private riskHistory: Map<string, RiskHistoryEntity> = new Map();

  constructor() {
    this.seedAll();
  }

  public seedAll() {
    this.users.clear();
    this.riskZones.clear();
    this.hazards.clear();
    this.weather.clear();
    this.citizenReports.clear();
    this.roads.clear();
    this.shelters.clear();
    this.hospitals.clear();
    this.resources.clear();
    this.rescueIncidents.clear();
    this.resourceAssignments.clear();
    this.alerts.clear();
    this.riskHistory.clear();

    SEED_USERS.forEach((u) => this.users.set(u.id, { ...u }));
    SEED_RISK_ZONES.forEach((z) => this.riskZones.set(z.id, { ...z }));
    SEED_HAZARDS.forEach((h) => this.hazards.set(h.id, { ...h }));
    SEED_WEATHER.forEach((w) => this.weather.set(w.id, { ...w }));
    SEED_CITIZEN_REPORTS.forEach((c) => this.citizenReports.set(c.id, { ...c }));
    SEED_ROADS.forEach((r) => this.roads.set(r.id, { ...r }));
    SEED_SHELTERS.forEach((s) => this.shelters.set(s.id, { ...s }));
    SEED_HOSPITALS.forEach((hp) => this.hospitals.set(hp.id, { ...hp }));
    SEED_RESOURCES.forEach((res) => this.resources.set(res.id, { ...res }));
    SEED_INCIDENTS.forEach((inc) => this.rescueIncidents.set(inc.id, { ...inc }));
    SEED_ASSIGNMENTS.forEach((asn) => this.resourceAssignments.set(asn.id, { ...asn }));
    SEED_ALERTS.forEach((alt) => this.alerts.set(alt.id, { ...alt }));
    SEED_RISK_HISTORY.forEach((hst) => this.riskHistory.set(hst.id, { ...hst }));
  }

  // Helper for generating unique ID
  public generateId(prefix: string): string {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }

  // 1. Users
  public getUsers(): UserEntity[] {
    return Array.from(this.users.values());
  }
  public getUserById(id: string): UserEntity | undefined {
    return this.users.get(id);
  }
  public createUser(user: Omit<UserEntity, 'id' | 'createdAt'>): UserEntity {
    const newUser: UserEntity = {
      ...user,
      id: this.generateId('USR'),
      createdAt: new Date().toISOString()
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  // 2. Risk Zones
  public getRiskZones(): RiskZoneEntity[] {
    return Array.from(this.riskZones.values());
  }
  public getRiskZoneById(id: string): RiskZoneEntity | undefined {
    return this.riskZones.get(id);
  }
  public createRiskZone(zone: Omit<RiskZoneEntity, 'id' | 'createdAt'>): RiskZoneEntity {
    const newZone: RiskZoneEntity = {
      ...zone,
      id: this.generateId('ZONE'),
      createdAt: new Date().toISOString()
    };
    this.riskZones.set(newZone.id, newZone);
    return newZone;
  }

  // 3. Hazards
  public getHazards(): HazardEntity[] {
    return Array.from(this.hazards.values());
  }
  public getHazardById(id: string): HazardEntity | undefined {
    return this.hazards.get(id);
  }
  public createHazard(hazard: Omit<HazardEntity, 'id' | 'createdAt'>): HazardEntity {
    const newHazard: HazardEntity = {
      ...hazard,
      id: this.generateId('HAZ'),
      createdAt: new Date().toISOString()
    };
    this.hazards.set(newHazard.id, newHazard);
    return newHazard;
  }

  // 4. Weather Observations
  public getWeatherObservations(): WeatherObservationEntity[] {
    return Array.from(this.weather.values());
  }
  public createWeatherObservation(obs: Omit<WeatherObservationEntity, 'id' | 'recordedAt'>): WeatherObservationEntity {
    const newObs: WeatherObservationEntity = {
      ...obs,
      id: this.generateId('WTH'),
      recordedAt: new Date().toISOString()
    };
    this.weather.set(newObs.id, newObs);
    return newObs;
  }

  // 5. Citizen Reports
  public getCitizenReports(): CitizenReportEntity[] {
    return Array.from(this.citizenReports.values());
  }
  public createCitizenReport(report: Omit<CitizenReportEntity, 'id' | 'createdAt' | 'status'>): CitizenReportEntity {
    const newReport: CitizenReportEntity = {
      ...report,
      id: this.generateId('REP'),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    this.citizenReports.set(newReport.id, newReport);
    return newReport;
  }
  public updateCitizenReportStatus(id: string, status: CitizenReportEntity['status']): CitizenReportEntity | undefined {
    const report = this.citizenReports.get(id);
    if (!report) return undefined;
    report.status = status;
    this.citizenReports.set(id, report);
    return report;
  }

  // 6. Roads
  public getRoads(): RoadEntity[] {
    return Array.from(this.roads.values());
  }
  public updateRoadStatus(id: string, status: RoadEntity['status'], waterDepthCm?: number, passability?: RoadEntity['passability']): RoadEntity | undefined {
    const road = this.roads.get(id);
    if (!road) return undefined;
    road.status = status;
    if (waterDepthCm !== undefined) road.waterDepthCm = waterDepthCm;
    if (passability) road.passability = passability;
    road.updatedAt = new Date().toISOString();
    this.roads.set(id, road);
    return road;
  }

  // 7. Shelters
  public getShelters(): ShelterEntity[] {
    return Array.from(this.shelters.values());
  }
  public createShelter(shelter: Omit<ShelterEntity, 'id' | 'createdAt'>): ShelterEntity {
    const newShelter: ShelterEntity = {
      ...shelter,
      id: this.generateId('SHL'),
      createdAt: new Date().toISOString()
    };
    this.shelters.set(newShelter.id, newShelter);
    return newShelter;
  }
  public updateShelterOccupancy(id: string, occupancy: number): ShelterEntity | undefined {
    const shelter = this.shelters.get(id);
    if (!shelter) return undefined;
    shelter.occupancy = occupancy;
    if (shelter.occupancy >= shelter.capacity) {
      shelter.status = 'Full';
    } else if (shelter.status === 'Full' && shelter.occupancy < shelter.capacity) {
      shelter.status = 'Open';
    }
    this.shelters.set(id, shelter);
    return shelter;
  }

  // 8. Hospitals
  public getHospitals(): HospitalEntity[] {
    return Array.from(this.hospitals.values());
  }
  public updateHospitalBeds(id: string, availableBeds: number, icuBeds?: number): HospitalEntity | undefined {
    const hospital = this.hospitals.get(id);
    if (!hospital) return undefined;
    hospital.availableBeds = availableBeds;
    if (icuBeds !== undefined) hospital.icuBeds = icuBeds;
    this.hospitals.set(id, hospital);
    return hospital;
  }

  // 9. Resources
  public getResources(): ResourceEntity[] {
    return Array.from(this.resources.values());
  }
  public updateResourceStatus(id: string, status: ResourceEntity['status'], availableUnits?: number): ResourceEntity | undefined {
    const res = this.resources.get(id);
    if (!res) return undefined;
    res.status = status;
    if (availableUnits !== undefined) res.availableUnits = availableUnits;
    this.resources.set(id, res);
    return res;
  }

  // 10. Rescue Incidents
  public getIncidents(): RescueIncidentEntity[] {
    return Array.from(this.rescueIncidents.values());
  }
  public createIncident(inc: Omit<RescueIncidentEntity, 'id' | 'createdAt'>): RescueIncidentEntity {
    const newInc: RescueIncidentEntity = {
      ...inc,
      id: this.generateId('INC'),
      createdAt: new Date().toISOString()
    };
    this.rescueIncidents.set(newInc.id, newInc);
    return newInc;
  }
  public updateIncidentDispatch(id: string, unitsDispatched: number, status?: RescueIncidentEntity['status'], assignee?: string): RescueIncidentEntity | undefined {
    const inc = this.rescueIncidents.get(id);
    if (!inc) return undefined;
    inc.unitsDispatched = unitsDispatched;
    if (status) inc.status = status;
    if (assignee) inc.assignee = assignee;
    this.rescueIncidents.set(id, inc);
    return inc;
  }

  // 11. Resource Assignments
  public getAssignments(): ResourceAssignmentEntity[] {
    return Array.from(this.resourceAssignments.values());
  }
  public createAssignment(asn: Omit<ResourceAssignmentEntity, 'id' | 'assignedAt'>): ResourceAssignmentEntity {
    const newAsn: ResourceAssignmentEntity = {
      ...asn,
      id: this.generateId('ASN'),
      assignedAt: new Date().toISOString()
    };
    this.resourceAssignments.set(newAsn.id, newAsn);
    return newAsn;
  }

  // 12. Alerts
  public getAlerts(): AlertEntity[] {
    return Array.from(this.alerts.values());
  }
  public createAlert(alert: Omit<AlertEntity, 'id' | 'issuedAt'>): AlertEntity {
    const newAlert: AlertEntity = {
      ...alert,
      id: this.generateId('ALT'),
      issuedAt: new Date().toISOString()
    };
    this.alerts.set(newAlert.id, newAlert);
    return newAlert;
  }

  // 13. Risk History
  public getRiskHistory(): RiskHistoryEntity[] {
    return Array.from(this.riskHistory.values());
  }
}

// Global Singleton Instance
export const dbStore = new PostGISDataStore();
