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

// 1. Chennai Risk Zones (7 Required Chennai Sectors)
export const SEED_RISK_ZONES: RiskZoneEntity[] = [
  {
    id: 'ZONE-CHN-01',
    name: 'Velachery Lowlands & Pallikaranai Basin',
    city: 'Chennai',
    sectorCode: 'CHN-VEL-01',
    baseRiskLevel: 'Critical',
    population: 185000,
    vulnerablePopulation: 24500,
    riskScore: 9.4,
    riskLevel: 'Critical',
    confidencePct: 96,
    rainfallMmHr: 52.4,
    waterLevelM: 1.85,
    elevationM: 2.1,
    historicalRisk: 'Extreme inundation in 2015 & 2023 monsoons',
    lastUpdated: '5 mins ago',
    category: 'Flood',
    contributingFactors: [
      'Pallikaranai marshland overflow channel restriction',
      'High tide backwater push from Kovalam creek',
      'Low elevation catchment basin (2.1m MSL)'
    ],
    recommendedAction: 'Evacuate all ground floor residents in Vijayanagar & Lake View Colony immediately to Velachery Community Shelter.',
    polygonCoords: [
      [12.970, 80.210],
      [12.990, 80.210],
      [12.990, 80.230],
      [12.970, 80.230]
    ],
    boundaryGeojson: {
      type: 'Polygon',
      coordinates: [[[80.21, 12.97], [80.23, 12.97], [80.23, 12.99], [80.21, 12.99], [80.21, 12.97]]]
    },
    createdAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'ZONE-CHN-02',
    name: 'Adyar River Basin & Kotturpuram',
    city: 'Chennai',
    sectorCode: 'CHN-ADY-02',
    baseRiskLevel: 'Critical',
    population: 142000,
    vulnerablePopulation: 17800,
    riskScore: 8.9,
    riskLevel: 'Critical',
    confidencePct: 94,
    rainfallMmHr: 44.0,
    waterLevelM: 2.20,
    elevationM: 3.4,
    historicalRisk: 'Riverbank overtopping during Chembarambakkam discharge',
    lastUpdated: '12 mins ago',
    category: 'Flood',
    contributingFactors: [
      'Chembarambakkam dam discharge at 14,000 cusecs',
      'Narrow river bend near Kotturpuram bridge',
      'Storm drain backflow into urban residential streets'
    ],
    recommendedAction: 'Deploy swift-water rescue teams along Turnbulls Road. Move elderly to Fortis Malar emergency ward.',
    polygonCoords: [
      [13.000, 80.240],
      [13.020, 80.240],
      [13.020, 80.260],
      [13.000, 80.260]
    ],
    boundaryGeojson: {
      type: 'Polygon',
      coordinates: [[[80.24, 13.00], [80.26, 13.00], [80.26, 13.02], [80.24, 13.02], [80.24, 13.00]]]
    },
    createdAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'ZONE-CHN-03',
    name: 'Guindy Industrial & Kathipara Hub',
    city: 'Chennai',
    sectorCode: 'CHN-GNY-03',
    baseRiskLevel: 'Warning',
    population: 98000,
    vulnerablePopulation: 9200,
    riskScore: 7.4,
    riskLevel: 'High',
    confidencePct: 91,
    rainfallMmHr: 31.5,
    waterLevelM: 0.65,
    elevationM: 12.0,
    historicalRisk: 'Kathipara underpass traffic blockage & urban heat island',
    lastUpdated: '18 mins ago',
    category: 'Heat',
    contributingFactors: [
      'Industrial concrete heat retention (41°C surface temp)',
      'Substation transformer thermal overload',
      'Kathipara cloverleaf waterlogging blockage'
    ],
    recommendedAction: 'Reroute heavy traffic from Kathipara inner ring road. Initiate load shed protocol for Phase 2 industrial feeders.',
    polygonCoords: [
      [13.000, 80.190],
      [13.020, 80.190],
      [13.020, 80.210],
      [13.000, 80.210]
    ],
    boundaryGeojson: {
      type: 'Polygon',
      coordinates: [[[80.19, 13.00], [80.21, 13.00], [80.21, 13.02], [80.19, 13.02], [80.19, 13.00]]]
    },
    createdAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'ZONE-CHN-04',
    name: 'T Nagar Commercial & Usman Corridor',
    city: 'Chennai',
    sectorCode: 'CHN-TNG-04',
    baseRiskLevel: 'Warning',
    population: 210000,
    vulnerablePopulation: 19500,
    riskScore: 7.8,
    riskLevel: 'High',
    confidencePct: 92,
    rainfallMmHr: 36.0,
    waterLevelM: 0.85,
    elevationM: 8.5,
    historicalRisk: 'Ranganathan Street urban flooding & commercial power trips',
    lastUpdated: '10 mins ago',
    category: 'Flood',
    contributingFactors: [
      'High urban density with minimal soil percolation',
      'Storm sewer capacity exceeded by 240%',
      'Commercial basement electrical panel submergence risk'
    ],
    recommendedAction: 'Deploy 100 HP mobile dewatering pumps at Usman flyover base. Issue power safety advisory for retail sector.',
    polygonCoords: [
      [13.030, 80.220],
      [13.050, 80.220],
      [13.050, 80.240],
      [13.030, 80.240]
    ],
    boundaryGeojson: {
      type: 'Polygon',
      coordinates: [[[80.22, 13.03], [80.24, 13.03], [80.24, 13.05], [80.22, 13.05], [80.22, 13.03]]]
    },
    createdAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'ZONE-CHN-05',
    name: 'Saidapet Riverbank & Subway Area',
    city: 'Chennai',
    sectorCode: 'CHN-SDP-05',
    baseRiskLevel: 'Critical',
    population: 115000,
    vulnerablePopulation: 16200,
    riskScore: 9.1,
    riskLevel: 'Critical',
    confidencePct: 95,
    rainfallMmHr: 48.0,
    waterLevelM: 1.40,
    elevationM: 4.2,
    historicalRisk: 'Complete subway submergence & rail corridor disruption',
    lastUpdated: '3 mins ago',
    category: 'Flood',
    contributingFactors: [
      'Saidapet vehicular subway low point (1.4m water depth)',
      'Adyar river channel overflow along West Jones Road',
      'Bridge structural stress under high current flow'
    ],
    recommendedAction: 'Close Saidapet subway to all traffic. Dispatch high-clearance military vehicles for stranded passenger extraction.',
    polygonCoords: [
      [13.010, 80.210],
      [13.030, 80.210],
      [13.030, 80.230],
      [13.010, 80.230]
    ],
    boundaryGeojson: {
      type: 'Polygon',
      coordinates: [[[80.21, 13.01], [80.23, 13.01], [80.23, 13.03], [80.21, 13.03], [80.21, 13.01]]]
    },
    createdAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'ZONE-CHN-06',
    name: 'Perungudi IT Corridor & Marshland Border',
    city: 'Chennai',
    sectorCode: 'CHN-PRG-06',
    baseRiskLevel: 'Warning',
    population: 165000,
    vulnerablePopulation: 14000,
    riskScore: 6.8,
    riskLevel: 'Moderate',
    confidencePct: 89,
    rainfallMmHr: 28.0,
    waterLevelM: 0.50,
    elevationM: 4.8,
    historicalRisk: 'OMR road waterlogging & IT park basement flooding',
    lastUpdated: '25 mins ago',
    category: 'Cyclone',
    contributingFactors: [
      'Gale wind gusts of 65 km/h along OMR expressway',
      'Perungudi lake overflow runoff into commercial parks',
      'Subsurface groundwater table saturation'
    ],
    recommendedAction: 'Open World Trade Center relief hub on standby. Monitor drainage outlets into Buckingham Canal.',
    polygonCoords: [
      [12.950, 80.230],
      [12.970, 80.230],
      [12.970, 80.250],
      [12.950, 80.250]
    ],
    boundaryGeojson: {
      type: 'Polygon',
      coordinates: [[[80.23, 12.95], [80.25, 12.95], [80.25, 12.97], [80.23, 12.97], [80.23, 12.95]]]
    },
    createdAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'ZONE-CHN-07',
    name: 'Tambaram Lowland & Lake Basin',
    city: 'Chennai',
    sectorCode: 'CHN-TBM-07',
    baseRiskLevel: 'Advisory',
    population: 230000,
    vulnerablePopulation: 21000,
    riskScore: 4.8,
    riskLevel: 'Low',
    confidencePct: 88,
    rainfallMmHr: 18.5,
    waterLevelM: 0.25,
    elevationM: 18.0,
    historicalRisk: 'Localized low-lying suburb drainage backup',
    lastUpdated: '35 mins ago',
    category: 'Landslide',
    contributingFactors: [
      'Hillside soil saturation near St. Thomas Mount periphery',
      'Storm sewer bottleneck at Tambaram railway station underpass',
      'Moderate sustained monsoon precipitation'
    ],
    recommendedAction: 'Maintain normal advisory level. Deploy clearing crews to Sanatorium drainage canals.',
    polygonCoords: [
      [12.910, 80.110],
      [12.930, 80.110],
      [12.930, 80.130],
      [12.910, 80.130]
    ],
    boundaryGeojson: {
      type: 'Polygon',
      coordinates: [[[80.11, 12.91], [80.13, 12.91], [80.13, 12.93], [80.11, 12.93], [80.11, 12.91]]]
    },
    createdAt: '2026-09-01T08:00:00Z'
  }
];

// 2. Users Entity Seed Data
export const SEED_USERS: UserEntity[] = [
  {
    id: 'USR-01',
    name: 'Karthik Subramanian',
    email: 'karthik.s@chennaicorp.gov.in',
    role: 'Authority',
    phone: '+91 98401 22334',
    zoneId: 'ZONE-CHN-01',
    createdAt: '2026-09-01T09:00:00Z'
  },
  {
    id: 'USR-02',
    name: 'Dr. Priya Sundaram',
    email: 'priya.sundaram@tndma.gov.in',
    role: 'Authority',
    phone: '+91 98402 33445',
    zoneId: 'ZONE-CHN-02',
    createdAt: '2026-09-01T09:15:00Z'
  },
  {
    id: 'USR-03',
    name: 'Inspector R. Venkatesh',
    email: 'venkatesh.r@ndrf.gov.in',
    role: 'Responder',
    phone: '+91 94440 11223',
    zoneId: 'ZONE-CHN-05',
    createdAt: '2026-09-01T09:30:00Z'
  },
  {
    id: 'USR-04',
    name: 'Anand Ramakrishnan',
    email: 'anand.velachery@gmail.com',
    role: 'Citizen',
    phone: '+91 98840 55667',
    zoneId: 'ZONE-CHN-01',
    createdAt: '2026-09-02T10:00:00Z'
  },
  {
    id: 'USR-05',
    name: 'Lakshmi Narayanan',
    email: 'lakshmi.adyar@yahoo.co.in',
    role: 'Citizen',
    phone: '+91 98410 77889',
    zoneId: 'ZONE-CHN-02',
    createdAt: '2026-09-02T11:20:00Z'
  }
];

// 3. Hazards Seed Data
export const SEED_HAZARDS: HazardEntity[] = [
  {
    id: 'HAZ-CHN-101',
    title: 'Pallikaranai Marshland Runoff Overflow',
    category: 'Flood',
    severity: 'Critical',
    probability: 92,
    impactScore: 9.4,
    zoneId: 'ZONE-CHN-01',
    locationName: 'Velachery Main Road & Lake View Colony',
    latitude: 12.9785,
    longitude: 80.2206,
    trend: 'increasing',
    affectedPopulation: 45000,
    description: 'Sustained monsoon discharge from Chembarambakkam spillway causing water accumulation up to 3.5ft in Velachery residential sectors.',
    createdAt: '2026-09-03T18:00:00Z'
  },
  {
    id: 'HAZ-CHN-102',
    title: 'Adyar River Bank Inundation',
    category: 'Waterlogging',
    severity: 'Critical',
    probability: 88,
    impactScore: 8.9,
    zoneId: 'ZONE-CHN-02',
    locationName: 'Kotturpuram Riverfront & Turnbulls Road',
    latitude: 13.0125,
    longitude: 80.2450,
    trend: 'increasing',
    affectedPopulation: 38000,
    description: 'Adyar River discharging at 24,000 cusecs. Water creeping into ground floors of low-lying apartment clusters.',
    createdAt: '2026-09-03T18:30:00Z'
  },
  {
    id: 'HAZ-CHN-103',
    title: 'Kathipara Junction Traffic Inundation',
    category: 'Waterlogging',
    severity: 'Warning',
    probability: 74,
    impactScore: 7.2,
    zoneId: 'ZONE-CHN-03',
    locationName: 'Guindy Kathipara Cloverleaf Underpass',
    latitude: 13.0067,
    longitude: 80.2025,
    trend: 'stable',
    affectedPopulation: 65000,
    description: 'Storm drain clogged by urban debris causing 40cm water stagnation on primary arterial feeder roads.',
    createdAt: '2026-09-03T19:00:00Z'
  },
  {
    id: 'HAZ-CHN-104',
    title: 'Usman Road Substation Transformer Thermal Stress',
    category: 'Heatwave',
    severity: 'Warning',
    probability: 68,
    impactScore: 6.8,
    zoneId: 'ZONE-CHN-04',
    locationName: 'T Nagar Commercial District Zone 4',
    latitude: 13.0418,
    longitude: 80.2341,
    trend: 'increasing',
    affectedPopulation: 85000,
    description: 'Ambient temperatures hitting 41°C combined with extreme peak commercial HVAC power demand.',
    createdAt: '2026-09-03T19:15:00Z'
  },
  {
    id: 'HAZ-CHN-105',
    title: 'Saidapet Subway Inundation Breach',
    category: 'Flood',
    severity: 'Critical',
    probability: 95,
    impactScore: 9.1,
    zoneId: 'ZONE-CHN-05',
    locationName: 'Saidapet Railway Subway & West Jones Road',
    latitude: 13.0210,
    longitude: 80.2230,
    trend: 'increasing',
    affectedPopulation: 29000,
    description: 'Water depth inside vehicular subway reached 1.4m. Roadway completely impassable.',
    createdAt: '2026-09-03T19:30:00Z'
  }
];

// 4. Weather Observations Seed Data
export const SEED_WEATHER: WeatherObservationEntity[] = [
  {
    id: 'WTH-CHN-01',
    zoneId: 'ZONE-CHN-01',
    temperatureC: 28.4,
    rainfallMmHr: 48.2,
    humidityPct: 94,
    riverLevelM: 4.85,
    windSpeedKmh: 42.5,
    recordedAt: '2026-09-03T22:00:00Z'
  },
  {
    id: 'WTH-CHN-02',
    zoneId: 'ZONE-CHN-02',
    temperatureC: 29.1,
    rainfallMmHr: 42.0,
    humidityPct: 91,
    riverLevelM: 5.20,
    windSpeedKmh: 38.0,
    recordedAt: '2026-09-03T22:00:00Z'
  },
  {
    id: 'WTH-CHN-03',
    zoneId: 'ZONE-CHN-03',
    temperatureC: 38.5,
    rainfallMmHr: 12.0,
    humidityPct: 78,
    riverLevelM: 2.10,
    windSpeedKmh: 24.0,
    recordedAt: '2026-09-03T22:00:00Z'
  }
];

// 5. Citizen Reports Seed Data
export const SEED_CITIZEN_REPORTS: CitizenReportEntity[] = [
  {
    id: 'REP-CHN-501',
    userId: 'USR-04',
    userName: 'Anand Ramakrishnan',
    category: 'Flash Flood / High Water Level',
    locationName: '100 Feet Road, Velachery (near Grand Mall)',
    latitude: 12.9790,
    longitude: 80.2215,
    status: 'Triaged',
    urgency: 'Critical',
    description: 'Water level reached 3 feet inside apartment basement parking. 15 vehicles submerged.',
    createdAt: '2026-09-03T20:10:00Z'
  },
  {
    id: 'REP-CHN-502',
    userId: 'USR-05',
    userName: 'Lakshmi Narayanan',
    category: 'Medical Assistance Needed',
    locationName: 'Gandhi Nagar 3rd Main Road, Adyar',
    latitude: 13.0080,
    longitude: 80.2510,
    status: 'Dispatched',
    urgency: 'Critical',
    description: 'Elderly diabetic patient trapped on 1st floor requires insulin and high-clearance vehicle evacuation.',
    createdAt: '2026-09-03T20:45:00Z'
  },
  {
    id: 'REP-CHN-503',
    userName: 'Srinivasan K.',
    category: 'Downed Power Line / Outage',
    locationName: 'Usman Road, T Nagar',
    latitude: 13.0405,
    longitude: 80.2330,
    status: 'Pending',
    urgency: 'Warning',
    description: 'Tree branch fell on distribution transformer, causing sparking and power trip.',
    createdAt: '2026-09-03T21:15:00Z'
  }
];

// 6. Roads Seed Data
export const SEED_ROADS: RoadEntity[] = [
  {
    id: 'RD-CHN-01',
    name: 'Velachery Main Road (Vijayanagar Junction)',
    zoneId: 'ZONE-CHN-01',
    status: 'Flooded',
    waterDepthCm: 75,
    passability: 'Boats Only',
    updatedAt: '2026-09-03T21:30:00Z'
  },
  {
    id: 'RD-CHN-02',
    name: 'Saidapet Railway Subway Road',
    zoneId: 'ZONE-CHN-05',
    status: 'Blocked',
    waterDepthCm: 140,
    passability: 'Impassable',
    updatedAt: '2026-09-03T21:40:00Z'
  },
  {
    id: 'RD-CHN-03',
    name: 'Inner Ring Road (Guindy to Jawaharlal Nehru Salai)',
    zoneId: 'ZONE-CHN-03',
    status: 'Restricted',
    waterDepthCm: 35,
    passability: '4x4 Only',
    updatedAt: '2026-09-03T21:45:00Z'
  },
  {
    id: 'RD-CHN-04',
    name: 'OMR Perungudi Expressway Corridor',
    zoneId: 'ZONE-CHN-06',
    status: 'Open',
    waterDepthCm: 10,
    passability: 'All Vehicles',
    updatedAt: '2026-09-03T21:50:00Z'
  }
];

// 7. Shelters Seed Data
export const SEED_SHELTERS: ShelterEntity[] = [
  {
    id: 'SHL-CHN-01',
    name: 'Velachery Community Hall Emergency Shelter',
    address: 'Inner Ring Road, Vijayanagar, Velachery',
    zoneId: 'ZONE-CHN-01',
    latitude: 12.9750,
    longitude: 80.2220,
    status: 'Open',
    occupancy: 480,
    capacity: 800,
    contactPhone: '+91 44 2243 0011',
    facilities: ['Generator Power', 'Medical Desk', 'Hot Meals', 'Water Purifier', 'Sanitation'],
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'SHL-CHN-02',
    name: 'Kotturpuram Community High School Shelter',
    address: 'River View Road, Kotturpuram, Adyar',
    zoneId: 'ZONE-CHN-02',
    latitude: 13.0140,
    longitude: 80.2430,
    status: 'Open',
    occupancy: 620,
    capacity: 750,
    contactPhone: '+91 44 2441 5522',
    facilities: ['Backup Power', 'DME Supplies', 'Child Care', 'Pet Friendly'],
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'SHL-CHN-03',
    name: 'Saidapet Government Model School Camp',
    address: 'Anna Salai, Saidapet',
    zoneId: 'ZONE-CHN-05',
    latitude: 13.0230,
    longitude: 80.2240,
    status: 'Full',
    occupancy: 500,
    capacity: 500,
    contactPhone: '+91 44 2435 8899',
    facilities: ['Generator Power', 'First Aid Station', 'Hot Meals'],
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'SHL-CHN-04',
    name: 'Perungudi World Trade Center Relief Hub',
    address: 'OMR Main Road, Perungudi',
    zoneId: 'ZONE-CHN-06',
    latitude: 12.9620,
    longitude: 80.2450,
    status: 'Standby',
    occupancy: 0,
    capacity: 1000,
    contactPhone: '+91 44 4390 1200',
    facilities: ['Solar Microgrid', 'WiFi', 'Showers', 'Large Vehicle Staging'],
    createdAt: '2026-09-01T10:00:00Z'
  }
];

// 8. Hospitals Seed Data
export const SEED_HOSPITALS: HospitalEntity[] = [
  {
    id: 'HSP-CHN-01',
    name: 'Apollo Speciality Hospital Velachery',
    address: '100 Feet Road, Karaikudi Nagar, Velachery',
    zoneId: 'ZONE-CHN-01',
    latitude: 12.9810,
    longitude: 80.2180,
    totalBeds: 250,
    availableBeds: 34,
    icuBeds: 8,
    powerBackup: true,
    contactPhone: '+91 44 2244 7788',
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'HSP-CHN-02',
    name: 'Fortis Malar Hospital Adyar',
    address: '52 1st Main Rd, Gandhi Nagar, Adyar',
    zoneId: 'ZONE-CHN-02',
    latitude: 13.0070,
    longitude: 80.2560,
    totalBeds: 180,
    availableBeds: 19,
    icuBeds: 4,
    powerBackup: true,
    contactPhone: '+91 44 4289 2222',
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'HSP-CHN-03',
    name: 'King Institute of Preventive Medicine & Research',
    address: 'Mount Poonamallee Rd, Guindy',
    zoneId: 'ZONE-CHN-03',
    latitude: 13.0110,
    longitude: 80.2080,
    totalBeds: 320,
    availableBeds: 68,
    icuBeds: 15,
    powerBackup: true,
    contactPhone: '+91 44 2250 1520',
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'HSP-CHN-04',
    name: 'Government Peripheral Hospital Saidapet',
    address: 'Anna Salai, Saidapet',
    zoneId: 'ZONE-CHN-05',
    latitude: 13.0240,
    longitude: 80.2220,
    totalBeds: 150,
    availableBeds: 12,
    icuBeds: 2,
    powerBackup: true,
    contactPhone: '+91 44 2434 1100',
    createdAt: '2026-09-01T10:00:00Z'
  }
];

// 9. Resources Seed Data
export const SEED_RESOURCES: ResourceEntity[] = [
  {
    id: 'RES-CHN-101',
    name: 'NDRF Inflatable Rescue Motor Boats (IRBs)',
    category: 'Vehicles',
    status: 'Deployed',
    totalUnits: 35,
    availableUnits: 8,
    depotLocation: 'Guindy NDRF Battalion Depot',
    lastMaintenance: '2026-08-30',
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'RES-CHN-102',
    name: 'Heavy Duty Dewatering Pumps (100 HP)',
    category: 'Water & Food',
    status: 'Ready',
    totalUnits: 60,
    availableUnits: 42,
    depotLocation: 'Chennai Corporation Central Yard',
    lastMaintenance: '2026-09-01',
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'RES-CHN-103',
    name: 'Mobile Solar Battery Microgrids (250kW)',
    category: 'Power Systems',
    status: 'Ready',
    totalUnits: 14,
    availableUnits: 5,
    depotLocation: 'TNEB Guindy Staging Base',
    lastMaintenance: '2026-08-28',
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'RES-CHN-104',
    name: 'High-Clearance Military Evacuation Trucks (6x6)',
    category: 'Vehicles',
    status: 'Ready',
    totalUnits: 25,
    availableUnits: 11,
    depotLocation: 'Tambaram Airforce Logistics Hub',
    lastMaintenance: '2026-09-02',
    createdAt: '2026-09-01T10:00:00Z'
  }
];

// 10. Rescue Incidents Seed Data
export const SEED_INCIDENTS: RescueIncidentEntity[] = [
  {
    id: 'INC-CHN-801',
    title: 'Velachery Apartment Complex Water Breach',
    type: 'Boat Evacuation',
    priority: 'Critical',
    severity: 'Critical',
    confidencePct: 96,
    peopleAffected: 120,
    vulnerablePeople: 28,
    waterLevelM: 1.85,
    incidentAgeMins: 45,
    distanceFromHelpKm: 0.8,
    infrastructureFailure: 'Subway Impassable & Power Outage',
    priorityRank: 'CRITICAL',
    priorityScore: 92,
    status: 'In Progress',
    zoneId: 'ZONE-CHN-01',
    location: 'Lake View Colony 2nd Street, Velachery',
    assignee: 'NDRF Swift-Water Squad 1',
    description: 'Ground floor submerged up to 1.85 meters. 28 elderly & infant residents requiring motorized inflatable boat extraction to Velachery Shelter.',
    unitsDispatched: 4,
    createdAt: '2026-09-03T19:40:00Z'
  },
  {
    id: 'INC-CHN-802',
    title: 'Saidapet Subway Stranded Bus Extraction',
    type: 'Subway Rescue',
    priority: 'Critical',
    severity: 'Critical',
    confidencePct: 94,
    peopleAffected: 22,
    vulnerablePeople: 6,
    waterLevelM: 1.40,
    incidentAgeMins: 60,
    distanceFromHelpKm: 2.4,
    infrastructureFailure: 'Saidapet Subway Submerged 140cm',
    priorityRank: 'CRITICAL',
    priorityScore: 88,
    status: 'Dispatched',
    zoneId: 'ZONE-CHN-05',
    location: 'Saidapet Railway Subway',
    assignee: 'Fire & Rescue Task Force 2',
    description: 'MTC Bus stuck in 1.4m standing water inside subway. 22 commuters trapped on roof requiring high-clearance truck extraction.',
    unitsDispatched: 3,
    createdAt: '2026-09-03T20:15:00Z'
  },
  {
    id: 'INC-CHN-803',
    title: 'Kotturpuram Senior Resident Oxygen Emergency',
    type: 'Medical Extraction',
    priority: 'High',
    severity: 'High',
    confidencePct: 91,
    peopleAffected: 4,
    vulnerablePeople: 2,
    waterLevelM: 0.85,
    incidentAgeMins: 25,
    distanceFromHelpKm: 1.5,
    infrastructureFailure: 'Local Transformer Station Tripped',
    priorityRank: 'HIGH',
    priorityScore: 68,
    status: 'In Progress',
    zoneId: 'ZONE-CHN-02',
    location: 'Turnbulls Road, Kotturpuram',
    assignee: '108 Emergency Medical Response',
    description: 'Power outage interrupted life-support oxygen concentrator. 108 ALS Ambulance & portable generator dispatched.',
    unitsDispatched: 2,
    createdAt: '2026-09-03T20:50:00Z'
  },
  {
    id: 'INC-CHN-804',
    title: 'Adyar Riverbank Residential Inundation',
    type: 'High Water Evacuation',
    priority: 'High',
    severity: 'High',
    confidencePct: 88,
    peopleAffected: 85,
    vulnerablePeople: 18,
    waterLevelM: 1.10,
    incidentAgeMins: 35,
    distanceFromHelpKm: 2.8,
    infrastructureFailure: 'Storm Drain Backflow Canal Overflow',
    priorityRank: 'HIGH',
    priorityScore: 62,
    status: 'Pending',
    zoneId: 'ZONE-CHN-02',
    location: 'Gandhi Nagar 4th Main Road, Adyar',
    assignee: 'Unassigned',
    description: 'River surge breaching residential compound walls. 18 vulnerable residents requiring evacuation staging.',
    unitsDispatched: 0,
    createdAt: '2026-09-03T21:10:00Z'
  }
];

// 11. Resource Assignments Seed Data
export const SEED_ASSIGNMENTS: ResourceAssignmentEntity[] = [
  {
    id: 'ASN-CHN-01',
    incidentId: 'INC-CHN-801',
    resourceId: 'RES-CHN-101',
    unitsAssigned: 4,
    status: 'Active',
    assignedAt: '2026-09-03T19:45:00Z'
  },
  {
    id: 'ASN-CHN-02',
    incidentId: 'INC-CHN-802',
    resourceId: 'RES-CHN-104',
    unitsAssigned: 2,
    status: 'Active',
    assignedAt: '2026-09-03T20:20:00Z'
  }
];

// 12. Alerts Seed Data
export const SEED_ALERTS: AlertEntity[] = [
  {
    id: 'ALT-CHN-901',
    headline: 'CRITICAL EVACUATION ADVISORY: Velachery Lowland Zone 1',
    level: 'Critical',
    issuer: 'Greater Chennai Corporation EOC Command',
    actionRequired: 'All ground floor residents in Vijayanagar & Lake View Colony must evacuate immediately to Velachery Shelter (Inner Ring Road). High tide storm surge incoming.',
    affectedZones: ['Velachery Lowlands', 'Pallikaranai Basin', 'Perungudi Border'],
    broadcastChannels: ['EAS Cell Broadcast', 'State Emergency Siren', 'ClimateShield App'],
    issuedAt: '2026-09-03T21:00:00Z',
    expiresAt: '2026-09-04T09:00:00Z'
  },
  {
    id: 'ALT-CHN-902',
    headline: 'ADYAR RIVER DISCHARGE WARNING: Kotturpuram & Saidapet',
    level: 'Warning',
    issuer: 'Tamil Nadu Disaster Management Authority (TNDMA)',
    actionRequired: 'Chembarambakkam surplus discharge increased to 12,000 cusecs. Keep away from Adyar riverbanks.',
    affectedZones: ['Adyar River Basin', 'Kotturpuram', 'Saidapet Riverbank'],
    broadcastChannels: ['Public Portal', 'SMS Broadcast', 'Radio Alerts'],
    issuedAt: '2026-09-03T21:30:00Z',
    expiresAt: '2026-09-04T12:00:00Z'
  }
];

// 13. Risk History Seed Data
export const SEED_RISK_HISTORY: RiskHistoryEntity[] = [
  {
    id: 'HST-CHN-01',
    zoneId: 'ZONE-CHN-01',
    riskScore: 9.4,
    waterLevelM: 4.85,
    powerOutagePct: 65,
    recordedAt: '2026-09-03T22:00:00Z'
  },
  {
    id: 'HST-CHN-02',
    zoneId: 'ZONE-CHN-02',
    riskScore: 8.9,
    waterLevelM: 5.20,
    powerOutagePct: 40,
    recordedAt: '2026-09-03T22:00:00Z'
  }
];
