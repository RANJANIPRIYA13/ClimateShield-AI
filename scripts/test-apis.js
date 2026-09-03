const http = require('http');

function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {})
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (postData) req.write(postData);
    req.end();
  });
}

async function runApiTests() {
  console.log('🧪 Starting Full ClimateShield AI Backend API Test Suite...\n');

  let passed = 0;
  let failed = 0;

  const testCases = [
    { name: 'GET /api/health', path: '/api/health', method: 'GET' },
    { name: 'GET /api/users', path: '/api/users', method: 'GET' },
    {
      name: 'POST /api/users (Create Citizen)',
      path: '/api/users',
      method: 'POST',
      body: { name: 'Kavitha S.', email: 'kavitha.s@chennai.org', role: 'Citizen', phone: '+91 98400 99887' }
    },
    { name: 'GET /api/risk-zones', path: '/api/risk-zones', method: 'GET' },
    {
      name: 'POST /api/risk-zones (Create Sector)',
      path: '/api/risk-zones',
      method: 'POST',
      body: { name: 'Chennai Central Station Sector', sectorCode: 'CHN-CEN-08', baseRiskLevel: 'Warning', population: 150000 }
    },
    { name: 'GET /api/hazards', path: '/api/hazards', method: 'GET' },
    {
      name: 'POST /api/hazards (Record Flood)',
      path: '/api/hazards',
      method: 'POST',
      body: {
        title: 'Velachery Lake Runoff',
        category: 'Flood',
        severity: 'Critical',
        probability: 90,
        impactScore: 9.0,
        zoneId: 'ZONE-CHN-01',
        locationName: 'Velachery Bypass',
        latitude: 12.978,
        longitude: 80.221,
        trend: 'increasing'
      }
    },
    { name: 'GET /api/weather', path: '/api/weather', method: 'GET' },
    {
      name: 'POST /api/weather (Log Station)',
      path: '/api/weather',
      method: 'POST',
      body: { zoneId: 'ZONE-CHN-01', temperatureC: 28.5, rainfallMmHr: 50.0, humidityPct: 95, riverLevelM: 5.1, windSpeedKmh: 45 }
    },
    { name: 'GET /api/citizen-reports', path: '/api/citizen-reports', method: 'GET' },
    {
      name: 'POST /api/citizen-reports (Submit Hazard Report)',
      path: '/api/citizen-reports',
      method: 'POST',
      body: {
        userName: 'Ramesh K.',
        category: 'Waterlogging',
        locationName: 'T Nagar Usman Road',
        latitude: 13.041,
        longitude: 80.234,
        urgency: 'Critical',
        description: 'Road water depth 2.5ft near shopping complex'
      }
    },
    { name: 'GET /api/roads', path: '/api/roads', method: 'GET' },
    {
      name: 'PATCH /api/roads (Update Passability)',
      path: '/api/roads',
      method: 'PATCH',
      body: { id: 'RD-CHN-01', status: 'Flooded', waterDepthCm: 85, passability: 'Boats Only' }
    },
    { name: 'GET /api/shelters', path: '/api/shelters', method: 'GET' },
    {
      name: 'PATCH /api/shelters (Update Occupancy)',
      path: '/api/shelters',
      method: 'PATCH',
      body: { id: 'SHL-CHN-01', occupancy: 520 }
    },
    { name: 'GET /api/hospitals', path: '/api/hospitals', method: 'GET' },
    {
      name: 'PATCH /api/hospitals (Update Beds)',
      path: '/api/hospitals',
      method: 'PATCH',
      body: { id: 'HSP-CHN-01', availableBeds: 28, icuBeds: 6 }
    },
    { name: 'GET /api/resources', path: '/api/resources', method: 'GET' },
    {
      name: 'PATCH /api/resources (Update Readiness)',
      path: '/api/resources',
      method: 'PATCH',
      body: { id: 'RES-CHN-101', status: 'Deployed', availableUnits: 6 }
    },
    { name: 'GET /api/incidents', path: '/api/incidents', method: 'GET' },
    {
      name: 'POST /api/incidents (Log Rescue Incident)',
      path: '/api/incidents',
      method: 'POST',
      body: {
        title: 'Velachery Apartment Boat Rescue',
        type: 'Evacuation',
        priority: 'Critical',
        status: 'In Progress',
        zoneId: 'ZONE-CHN-01',
        location: 'Lake View 3rd Street',
        description: 'Rescue boats extracting 12 families',
        unitsDispatched: 3
      }
    },
    { name: 'GET /api/assignments', path: '/api/assignments', method: 'GET' },
    {
      name: 'POST /api/assignments (Assign Boat)',
      path: '/api/assignments',
      method: 'POST',
      body: { incidentId: 'INC-CHN-801', resourceId: 'RES-CHN-101', unitsAssigned: 3 }
    },
    { name: 'GET /api/alerts', path: '/api/alerts', method: 'GET' },
    {
      name: 'POST /api/alerts (Broadcast Siren)',
      path: '/api/alerts',
      method: 'POST',
      body: {
        headline: 'MASS EVACUATION: Velachery Zone 1 Lowlands',
        level: 'Critical',
        issuer: 'GCC EOC Command',
        actionRequired: 'Evacuate ground floors immediately',
        affectedZones: ['Velachery', 'Perungudi']
      }
    },
    { name: 'GET /api/risk-history', path: '/api/risk-history', method: 'GET' },
    {
      name: 'POST /api/risk/calculate (Velachery AI Risk Model)',
      path: '/api/risk/calculate',
      method: 'POST',
      body: { zoneId: 'ZONE-CHN-01' }
    },
    {
      name: 'POST /api/risk/calculate (Batch All Chennai Sectors)',
      path: '/api/risk/calculate',
      method: 'POST',
      body: {}
    },
    {
      name: 'POST /api/citizen-reports/verify (Verify Report Credibility)',
      path: '/api/citizen-reports/verify',
      method: 'POST',
      body: { reportId: 'REP-CHN-501' }
    },
    {
      name: 'POST /api/routes/calculate (Calculate Safe Evacuation Routes)',
      path: '/api/routes/calculate',
      method: 'POST',
      body: { origin: 'Velachery Lowlands (Zone 4)', destination: 'Velachery Community Hall Shelter' }
    },
    {
      name: 'POST /api/copilot/chat (Execute Copilot AI Query)',
      path: '/api/copilot/chat',
      method: 'POST',
      body: { message: 'Which areas need immediate evacuation?' }
    },
    {
      name: 'POST /api/simulation (Execute Flood Escalation Scenario)',
      path: '/api/simulation',
      method: 'POST',
      body: { scenario: 'FLOOD_ESCALATION' }
    },
    { name: 'POST /api/seed (Reseed Database)', path: '/api/seed', method: 'POST' }
  ];

  for (const tc of testCases) {
    try {
      const res = await makeRequest(tc.path, tc.method, tc.body);
      if (res.status >= 200 && res.status < 300 && res.data.success) {
        console.log(`✅ [PASS] ${tc.name} -> Code ${res.status}`);
        passed++;
      } else {
        console.error(`❌ [FAIL] ${tc.name} -> Code ${res.status}:`, res.data);
        failed++;
      }
    } catch (err) {
      console.error(`❌ [FAIL] ${tc.name} -> Network error:`, err.message);
      failed++;
    }
  }

  console.log(`\n========================================`);
  console.log(`📊 Test Results: ${passed} PASSED, ${failed} FAILED (Total: ${testCases.length})`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runApiTests();
