export interface EmergencyResourceItem {
  id: string;
  name: string;
  category: 'Shelter' | 'Hospital' | 'Food Center' | 'Water Station' | 'Charging Station';
  address: string;
  sectorName: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  capacity: number;
  occupied: number;
  available: number;
  medicalSupport: string;
  accessibility: string;
  status: 'Open' | 'Ready' | 'Full' | 'Standby' | 'Closed';
  contactPhone: string;
  facilities: string[];
}

export const CHENNAI_EMERGENCY_RESOURCES: EmergencyResourceItem[] = [
  // 1. Shelters
  {
    id: 'RES-SHL-01',
    name: 'Velachery Community Hall Emergency Shelter',
    category: 'Shelter',
    address: 'Inner Ring Road, Vijayanagar, Velachery',
    sectorName: 'Velachery',
    latitude: 12.9750,
    longitude: 80.2220,
    distanceKm: 0.8,
    capacity: 800,
    occupied: 480,
    available: 320,
    medicalSupport: '24/7 First Aid Desk & Emergency Physician',
    accessibility: 'Wheelchair & Ramp Accessible',
    status: 'Open',
    contactPhone: '+91 44 2243 0011',
    facilities: ['Generator Power', 'Hot Meals', 'Water Purifier', 'Medical Desk']
  },
  {
    id: 'RES-SHL-02',
    name: 'Kotturpuram Community High School Shelter',
    category: 'Shelter',
    address: 'River View Road, Kotturpuram, Adyar',
    sectorName: 'Adyar',
    latitude: 13.0140,
    longitude: 80.2430,
    distanceKm: 2.4,
    capacity: 750,
    occupied: 620,
    available: 130,
    medicalSupport: 'Mobile Medical Response Team',
    accessibility: 'Ground Floor Accessible',
    status: 'Open',
    contactPhone: '+91 44 2441 5522',
    facilities: ['Backup Power', 'DME Supplies', 'Child Care']
  },
  {
    id: 'RES-SHL-03',
    name: 'Perungudi World Trade Center Relief Hub',
    category: 'Shelter',
    address: 'OMR Main Road, Perungudi',
    sectorName: 'Perungudi',
    latitude: 12.9620,
    longitude: 80.2450,
    distanceKm: 3.5,
    capacity: 1000,
    occupied: 0,
    available: 1000,
    medicalSupport: 'Standby Medical Van',
    accessibility: 'Full Barrier-Free Access',
    status: 'Standby',
    contactPhone: '+91 44 4390 1200',
    facilities: ['Solar Microgrid', 'WiFi', 'Showers']
  },

  // 2. Hospitals
  {
    id: 'RES-HSP-01',
    name: 'Apollo Speciality Hospital Velachery',
    category: 'Hospital',
    address: '100 Feet Road, Karaikudi Nagar, Velachery',
    sectorName: 'Velachery',
    latitude: 12.9810,
    longitude: 80.2180,
    distanceKm: 1.2,
    capacity: 250,
    occupied: 216,
    available: 34,
    medicalSupport: 'Full Tertiary Care & 8 ICU Beds',
    accessibility: 'Elevator & Stretcher Ramps',
    status: 'Open',
    contactPhone: '+91 44 2244 7788',
    facilities: ['ICU', 'Oxygen Generator', 'Power Backup', 'Trauma Bay']
  },
  {
    id: 'RES-HSP-02',
    name: 'Fortis Malar Hospital Adyar',
    category: 'Hospital',
    address: '52 1st Main Rd, Gandhi Nagar, Adyar',
    sectorName: 'Adyar',
    latitude: 13.0070,
    longitude: 80.2560,
    distanceKm: 2.8,
    capacity: 180,
    occupied: 161,
    available: 19,
    medicalSupport: 'Cardiac & Critical Care Center',
    accessibility: 'Full Disability Compliance',
    status: 'Open',
    contactPhone: '+91 44 4289 2222',
    facilities: ['ICU', 'Emergency Ward', 'Blood Bank']
  },

  // 3. Food Centers
  {
    id: 'RES-FD-01',
    name: 'GCC Amma Community Kitchen Velachery',
    category: 'Food Center',
    address: 'Vijayanagar Bus Terminus, Velachery',
    sectorName: 'Velachery',
    latitude: 12.9770,
    longitude: 80.2210,
    distanceKm: 0.5,
    capacity: 5000,
    occupied: 3200,
    available: 1800,
    medicalSupport: 'Basic First Aid Kit',
    accessibility: 'Ground Floor Ramp',
    status: 'Open',
    contactPhone: '+91 44 2243 9900',
    facilities: ['Hot Rice Meals', 'Drinking Water Packets', 'Infant Food']
  },
  {
    id: 'RES-FD-02',
    name: 'T Nagar Central Relief Kitchen',
    category: 'Food Center',
    address: 'Usman Road Commercial Hub, T Nagar',
    sectorName: 'T Nagar',
    latitude: 13.0420,
    longitude: 80.2350,
    distanceKm: 4.1,
    capacity: 4000,
    occupied: 1500,
    available: 2500,
    medicalSupport: 'Volunteers Stationed',
    accessibility: 'Street Level Access',
    status: 'Open',
    contactPhone: '+91 44 2434 5511',
    facilities: ['Food Packets', 'Clean Water Tanks']
  },

  // 4. Water Stations
  {
    id: 'RES-WT-01',
    name: 'Metro Water Pumping & Sandbag Station 4',
    category: 'Water Station',
    address: 'Inner Ring Road, Velachery',
    sectorName: 'Velachery',
    latitude: 12.9730,
    longitude: 80.2190,
    distanceKm: 0.9,
    capacity: 20000,
    occupied: 6000,
    available: 14000,
    medicalSupport: 'Water Testing Sanitation Desk',
    accessibility: 'Drive-Thru Vehicle Tanker Access',
    status: 'Ready',
    contactPhone: '+91 44 2245 1122',
    facilities: ['Purified Water Tankers', 'Sandbag Fillers', 'Chlorine Tablets']
  },
  {
    id: 'RES-WT-02',
    name: 'Perungudi Buckingham Canal Water Depot',
    category: 'Water Station',
    address: 'OMR Toll Plaza Area, Perungudi',
    sectorName: 'Perungudi',
    latitude: 12.9640,
    longitude: 80.2440,
    distanceKm: 3.2,
    capacity: 15000,
    occupied: 4000,
    available: 11000,
    medicalSupport: 'Sanitation Officer On Site',
    accessibility: 'Heavy Machinery Access',
    status: 'Ready',
    contactPhone: '+91 44 2496 3300',
    facilities: ['20L Can Dispenser', 'Emergency Water Cans']
  },

  // 5. Charging Stations
  {
    id: 'RES-CHG-01',
    name: 'TNEB Mobile Solar Power & Charging Hub',
    category: 'Charging Station',
    address: 'Kathipara Junction Staging Ground, Guindy',
    sectorName: 'Guindy',
    latitude: 13.0080,
    longitude: 80.2040,
    distanceKm: 2.1,
    capacity: 500,
    occupied: 180,
    available: 320,
    medicalSupport: 'None',
    accessibility: 'Ramp Access',
    status: 'Ready',
    contactPhone: '+91 44 2250 8811',
    facilities: ['250kW Solar Microgrid', '50 Multi-Port Power Outlets', 'Satellite Phone Charging']
  },
  {
    id: 'RES-CHG-02',
    name: 'OMR IT Park Solar Battery Charging Station',
    category: 'Charging Station',
    address: 'Taramani Link Road, Perungudi',
    sectorName: 'Perungudi',
    latitude: 12.9710,
    longitude: 80.2380,
    distanceKm: 2.9,
    capacity: 400,
    occupied: 110,
    available: 290,
    medicalSupport: 'None',
    accessibility: 'Wheelchair Friendly',
    status: 'Ready',
    contactPhone: '+91 44 4390 5500',
    facilities: ['100kW Battery Bank', 'USB-C Fast Chargers']
  }
];
