export interface RiskItem {
  id: string;
  title: string;
  category: 'Flood' | 'Heatwave' | 'Hurricane' | 'Wildfire' | 'Storm Surge';
  severity: 'Critical' | 'Warning' | 'Advisory' | 'Safe';
  probability: number; // percentage
  impactScore: number; // 1-10
  location: string;
  coordinates: { lat: number; lng: number };
  trend: 'increasing' | 'stable' | 'decreasing';
  lastUpdated: string;
  affectedPopulation: number;
  description: string;
}

export interface KpiMetric {
  id: string;
  label: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  subtext: string;
  iconName: 'ShieldAlert' | 'Users' | 'Home' | 'Truck' | 'Activity' | 'Zap';
}

export interface IncidentItem {
  id: string;
  title: string;
  type: 'Infrastructure' | 'Medical' | 'Evacuation' | 'Environmental';
  priority: 'Critical' | 'Warning' | 'Advisory' | 'Safe';
  status: 'Unassigned' | 'In Progress' | 'Resolved' | 'Dispatched';
  location: string;
  reportedTime: string;
  assignee: string;
  description: string;
  unitsDispatched: number;
}

export interface ShelterItem {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  status: 'Open' | 'Full' | 'Standby' | 'Closed';
  occupancy: number;
  capacity: number;
  facilities: string[];
  contactPhone: string;
  accessible: boolean;
  distanceKm: number;
}

export interface ResourceItem {
  id: string;
  name: string;
  category: 'Vehicles' | 'Medical Supplies' | 'Power Systems' | 'Water & Food' | 'Personnel';
  status: 'Ready' | 'Deployed' | 'Maintenance' | 'Depleted';
  totalUnits: number;
  availableUnits: number;
  depotLocation: string;
  lastMaintenance: string;
}

export interface AlertItem {
  id: string;
  headline: string;
  level: 'Critical' | 'Warning' | 'Advisory' | 'Safe';
  issuer: string;
  issuedAt: string;
  expiresAt: string;
  affectedZones: string[];
  actionRequired: string;
  broadcastChannels: string[];
}

// SAMPLE MOCK DATA
export const MOCK_RISKS: RiskItem[] = [
  {
    id: 'RISK-01',
    title: 'Coastal Flash Storm Surge',
    category: 'Storm Surge',
    severity: 'Critical',
    probability: 88,
    impactScore: 9.2,
    location: 'North Bay Waterfront District Zone 4',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    trend: 'increasing',
    lastUpdated: '5 mins ago',
    affectedPopulation: 42500,
    description: 'High tide combined with 65 mph wind gusts threatening sea wall breach. Water inundation predicted to reach 4.2ft above baseline.'
  },
  {
    id: 'RISK-02',
    title: 'Urban Heat Island Extreme Wave',
    category: 'Heatwave',
    severity: 'Warning',
    probability: 74,
    impactScore: 7.8,
    location: 'Metro Central & East Industrial Sector',
    coordinates: { lat: 37.7833, lng: -122.4167 },
    trend: 'increasing',
    lastUpdated: '12 mins ago',
    affectedPopulation: 118000,
    description: 'Ambient temperatures projected to hit 106°F with power grid transformer stress index exceeding 85% capacity.'
  },
  {
    id: 'RISK-03',
    title: 'River Basin Flooding Overflow',
    category: 'Flood',
    severity: 'Critical',
    probability: 91,
    impactScore: 8.9,
    location: 'Pine Creek Valley & Lowland Suburbs',
    coordinates: { lat: 37.76, lng: -122.44 },
    trend: 'increasing',
    lastUpdated: '2 mins ago',
    affectedPopulation: 29400,
    description: 'Upstream dam discharge combined with sustained heavy rainfall. Creek levels rising 8 inches per hour.'
  },
  {
    id: 'RISK-04',
    title: 'Hillside Debris Flow & Wildfire Pocket',
    category: 'Wildfire',
    severity: 'Warning',
    probability: 62,
    impactScore: 6.5,
    location: 'Ridge Line Canyon Reserve',
    coordinates: { lat: 37.75, lng: -122.43 },
    trend: 'stable',
    lastUpdated: '25 mins ago',
    affectedPopulation: 8300,
    description: 'Dry vegetation combined with shifting dry winds. Perimeter containment currently at 45%.'
  },
  {
    id: 'RISK-05',
    title: 'Sub-Basin Groundwater Seepage',
    category: 'Flood',
    severity: 'Advisory',
    probability: 35,
    impactScore: 4.1,
    location: 'South Commercial Corridor',
    coordinates: { lat: 37.74, lng: -122.41 },
    trend: 'decreasing',
    lastUpdated: '40 mins ago',
    affectedPopulation: 14000,
    description: 'Localized storm drain backups in underground garage structures. Minimal structural damage risk.'
  }
];

export const MOCK_KPIS: KpiMetric[] = [
  {
    id: 'KPI-1',
    label: 'Active Climate Threats',
    value: 5,
    change: '+2 in 6h',
    changeType: 'negative',
    subtext: '2 Critical, 2 Warning, 1 Advisory',
    iconName: 'ShieldAlert'
  },
  {
    id: 'KPI-2',
    label: 'Population at Risk',
    value: '212,200',
    change: '+14% vs avg',
    changeType: 'negative',
    subtext: '42.5k in Immediate Evacuation Zone',
    iconName: 'Users'
  },
  {
    id: 'KPI-3',
    label: 'Shelter Capacity Ready',
    value: '78.4%',
    change: '4,850 open beds',
    changeType: 'positive',
    subtext: '12 active shelters operational',
    iconName: 'Home'
  },
  {
    id: 'KPI-4',
    label: 'Deployed Response Assets',
    value: '142 / 185',
    change: '76% utilization',
    changeType: 'neutral',
    subtext: '34 High-clearance vehicles en route',
    iconName: 'Truck'
  },
  {
    id: 'KPI-5',
    label: 'System Risk Index',
    value: '8.4 / 10',
    change: 'HIGH STRESS',
    changeType: 'negative',
    subtext: 'EOC Level 2 Activation Active',
    iconName: 'Activity'
  }
];

export const MOCK_INCIDENTS: IncidentItem[] = [
  {
    id: 'INC-8091',
    title: 'Main Street Bridge Submersion Risk',
    type: 'Infrastructure',
    priority: 'Critical',
    status: 'In Progress',
    location: 'Main St & 4th Avenue Bridge',
    reportedTime: '10 mins ago',
    assignee: 'Rapid Response Unit 4',
    description: 'Bridge structural sensors detecting high water pressure and debris accumulation around piers.',
    unitsDispatched: 3
  },
  {
    id: 'INC-8092',
    title: 'Senior Living Facility Power Outage',
    type: 'Medical',
    priority: 'Critical',
    status: 'Dispatched',
    location: 'Oakridge Senior Residence',
    reportedTime: '18 mins ago',
    assignee: 'Emergency Medical Task Force B',
    description: 'Backup generator failure reported during high heat wave. 84 residents require cooling support.',
    unitsDispatched: 5
  },
  {
    id: 'INC-8093',
    title: 'Substation Transformer Overheat Warning',
    type: 'Infrastructure',
    priority: 'Warning',
    status: 'In Progress',
    location: 'East Grid Substation 12',
    reportedTime: '30 mins ago',
    assignee: 'Utility Tech Dispatch',
    description: 'Thermal imaging shows core transformer at 94°C. Load shed protocols initiated.',
    unitsDispatched: 2
  },
  {
    id: 'INC-8094',
    title: 'Flash Flood Roadway Blockade',
    type: 'Evacuation',
    priority: 'Warning',
    status: 'Unassigned',
    location: 'Route 101 South Bound Exit 14',
    reportedTime: '45 mins ago',
    assignee: 'Unassigned',
    description: 'Standing water of 2.5ft blocking egress corridor for South District residents.',
    unitsDispatched: 0
  }
];

export const MOCK_SHELTERS: ShelterItem[] = [
  {
    id: 'SHL-01',
    name: 'Central Civic Center Evacuation Complex',
    address: '500 Community Way, Metro Central',
    coordinates: { lat: 37.775, lng: -122.418 },
    status: 'Open',
    occupancy: 420,
    capacity: 1200,
    facilities: ['Backup Power', 'Medical Station', 'Pet Friendly', 'Hot Meals', 'WiFi'],
    contactPhone: '(555) 019-2831',
    accessible: true,
    distanceKm: 1.4
  },
  {
    id: 'SHL-02',
    name: 'Lincoln High School Emergency Shelter',
    address: '1200 Highland Ave, North District',
    coordinates: { lat: 37.785, lng: -122.425 },
    status: 'Open',
    occupancy: 610,
    capacity: 850,
    facilities: ['Backup Power', 'Showers', 'Child Care', 'DME Supplies'],
    contactPhone: '(555) 019-7723',
    accessible: true,
    distanceKm: 2.8
  },
  {
    id: 'SHL-03',
    name: 'St. Jude Community Arena',
    address: '880 Harbor Blvd, Eastside',
    coordinates: { lat: 37.765, lng: -122.405 },
    status: 'Full',
    occupancy: 500,
    capacity: 500,
    facilities: ['Backup Power', 'Medical Unit', 'Hot Meals'],
    contactPhone: '(555) 019-9941',
    accessible: true,
    distanceKm: 4.1
  },
  {
    id: 'SHL-04',
    name: 'Westside Youth Center Standby Hub',
    address: '430 Parkside Drive, Westside',
    coordinates: { lat: 37.755, lng: -122.445 },
    status: 'Standby',
    occupancy: 0,
    capacity: 400,
    facilities: ['Backup Power', 'Basic Supplies'],
    contactPhone: '(555) 019-3312',
    accessible: true,
    distanceKm: 5.6
  }
];

export const MOCK_RESOURCES: ResourceItem[] = [
  {
    id: 'RES-101',
    name: 'High-Clearance Rescue Trucks (4x4)',
    category: 'Vehicles',
    status: 'Ready',
    totalUnits: 28,
    availableUnits: 12,
    depotLocation: 'Central EOC Logistics Depot',
    lastMaintenance: '2026-08-28'
  },
  {
    id: 'RES-102',
    name: 'Mobile Cooling & HVAC Trailer Units',
    category: 'Power Systems',
    status: 'Deployed',
    totalUnits: 15,
    availableUnits: 3,
    depotLocation: 'North District Staging Area',
    lastMaintenance: '2026-08-30'
  },
  {
    id: 'RES-103',
    name: 'Emergency Sandbag Automated Fillers',
    category: 'Water & Food',
    status: 'Ready',
    totalUnits: 40,
    availableUnits: 34,
    depotLocation: 'Public Works Yard 2',
    lastMaintenance: '2026-09-01'
  },
  {
    id: 'RES-104',
    name: 'Tactical Swift-Water Rescue Boats',
    category: 'Vehicles',
    status: 'Ready',
    totalUnits: 18,
    availableUnits: 6,
    depotLocation: 'Harbor Fire Station 9',
    lastMaintenance: '2026-08-25'
  },
  {
    id: 'RES-105',
    name: 'Mobile Solar Battery Microgrids (100kW)',
    category: 'Power Systems',
    status: 'Ready',
    totalUnits: 10,
    availableUnits: 4,
    depotLocation: 'Energy Staging Ground',
    lastMaintenance: '2026-08-29'
  }
];

export const MOCK_ALERTS: AlertItem[] = [
  {
    id: 'ALT-991',
    headline: 'IMMEDIATE EVACUATION ORDER: Lowland Flood Zone 4',
    level: 'Critical',
    issuer: 'County Emergency Operations Command',
    issuedAt: '15 mins ago',
    expiresAt: 'In 12 hours',
    affectedZones: ['North Bay District', 'Zone 4 Waterfront', 'Pine Creek Lowlands'],
    actionRequired: 'Move immediately to higher ground or seek shelter at Central Civic Center (500 Community Way). Bring essential medication and identification.',
    broadcastChannels: ['EAS Signal', 'SMS Cell Broadcast', 'ClimateShield Siren Net']
  },
  {
    id: 'ALT-992',
    headline: 'EXTREME HEAT & POWER CONSERVATION ADVISORY',
    level: 'Warning',
    issuer: 'State Meteorological & Energy Board',
    issuedAt: '45 mins ago',
    expiresAt: 'Today at 21:00',
    affectedZones: ['Metro Central', 'East Industrial Sector'],
    actionRequired: 'Pre-cool homes before 2 PM. Avoid heavy power appliances. Cooling centers are open across all public libraries.',
    broadcastChannels: ['Public Portal', 'SMS Alerts', 'EOC Broadcast']
  },
  {
    id: 'ALT-993',
    headline: 'WATER UTILITY CONTAMINATION ADVISORY - BOIL WATER NOTICE',
    level: 'Advisory',
    issuer: 'Municipal Water Safety Division',
    issuedAt: '2 hours ago',
    expiresAt: 'Until further notice',
    affectedZones: ['Eastside District', 'Sector 7'],
    actionRequired: 'Boil tap water for at least 1 minute before drinking or cooking due to flood runoff near Pumping Station 3.',
    broadcastChannels: ['Public Portal', 'Web Alert']
  }
];
