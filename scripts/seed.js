const http = require('http');

async function triggerSeed() {
  console.log('🌱 Triggering ClimateShield AI database seed script...');

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/seed',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log('✅ Seed response code:', res.statusCode);
      try {
        const json = JSON.parse(data);
        console.log('📊 Reseed Summary:', JSON.stringify(json.data || json, null, 2));
      } catch (e) {
        console.log('Output:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.error('❌ Failed to reach seed endpoint (Ensure dev server is running on port 3000):', e.message);
  });

  req.end();
}

triggerSeed();
