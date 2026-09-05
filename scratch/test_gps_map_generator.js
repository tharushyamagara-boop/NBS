const fs = require('fs');
const path = require('path');
const http = require('http');

function request(url, options = {}, data = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port || 80,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let parsedBody = body;
        try {
          parsedBody = JSON.parse(body);
        } catch (e) {}
        resolve({ status: res.statusCode, headers: res.headers, body: parsedBody });
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runGpsVerification() {
  console.log('========================================================');
  console.log('🚀 SUNCASA NbS GPS Telemetry & Map Generator Test Suite');
  console.log('========================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
    }
  }

  // TEST 1: Check indicators API returns all 14 indicators with GPS points
  console.log('\n--- 1. Testing Indicators API for GPS coordinates ---');
  const resInds = await request('http://localhost:3000/api/indicators');
  assert(resInds.status === 200, `GET /api/indicators returned 200 (Got ${resInds.status})`);
  const indicatorsList = resInds.body?.data || resInds.body;
  assert(Array.isArray(indicatorsList) && indicatorsList.length >= 14, `Returned ${indicatorsList?.length} indicators`);

  let allHaveGps = true;
  let totalWaypoints = 0;
  for (const ind of indicatorsList) {
    if (!ind.gps_coordinates || !Array.isArray(ind.gps_coordinates) || ind.gps_coordinates.length === 0) {
      allHaveGps = false;
      console.error(`Indicator ${ind.id} is missing gps_coordinates!`);
    } else {
      totalWaypoints += ind.gps_coordinates.length;
    }
  }
  assert(allHaveGps, `All 14 indicators have GPS waypoints configured (Total waypoints: ${totalWaypoints})`);

  // TEST 2: Validate GPS point schema and Kigali bounds
  console.log('\n--- 2. Validating GPS schema and Kigali spatial boundary ---');
  const sampleInd = indicatorsList.find(i => i.id === 'area_restored_ha');
  assert(sampleInd !== undefined, 'Found indicator area_restored_ha');
  assert(sampleInd.gps_coordinates.length > 0, `area_restored_ha has ${sampleInd.gps_coordinates?.length} GPS waypoints`);

  const firstPt = sampleInd.gps_coordinates[0];
  assert(typeof firstPt.lat === 'number' && firstPt.lat >= -2.15 && firstPt.lat <= -1.85, 
    `Latitude ${firstPt.lat} is valid within Kigali Lower Nyabarongo region`);
  assert(typeof firstPt.lng === 'number' && firstPt.lng >= 29.85 && firstPt.lng <= 30.25, 
    `Longitude ${firstPt.lng} is valid within Kigali region`);
  assert(typeof firstPt.name === 'string' && firstPt.name.length > 0, `Point has site name: "${firstPt.name}"`);
  assert(typeof firstPt.value === 'number', `Point has metric value: ${firstPt.value}`);

  // TEST 3: Test Admin GPS Map Generator via PATCH API
  console.log('\n--- 3. Testing Admin GPS Map Generation & Persistence ---');
  const originalWaypoints = [...sampleInd.gps_coordinates];
  const testWaypoint = {
    id: `gps-test-${Date.now()}`,
    name: 'Nyabarongo Automated Test Station',
    name_rw: 'Ibiro bipima Nyabarongo',
    lat: -1.9754,
    lng: 30.0482,
    value: 777,
    sector: 'Mageragere',
    district: 'Nyarugenge',
    status: 'Active',
    notes: 'Generated via Admin GPS Map Generator Automated Test'
  };

  const updatedWaypoints = [...originalWaypoints, testWaypoint];
  const patchRes = await request('http://localhost:3000/api/indicators/area_restored_ha', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  }, {
    gps_coordinates: updatedWaypoints
  });

  assert(patchRes.status === 200, `PATCH /api/indicators/area_restored_ha succeeded (Status ${patchRes.status})`);
  const returnedInd = patchRes.body.data || patchRes.body.indicator || patchRes.body;
  assert(returnedInd && returnedInd.gps_coordinates && returnedInd.gps_coordinates.length === updatedWaypoints.length,
    `Returned indicator has ${returnedInd?.gps_coordinates?.length} waypoints after addition`);

  // Verify persistence in indicators.json on disk
  const diskData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/indicators.json'), 'utf8'));
  const diskInd = diskData.indicators.find(i => i.id === 'area_restored_ha');
  const foundOnDisk = diskInd.gps_coordinates.some(pt => pt.name === 'Nyabarongo Automated Test Station');
  assert(foundOnDisk, 'Test GPS waypoint was successfully written and persisted to indicators.json on disk');

  // TEST 4: Clean up test waypoint
  console.log('\n--- 4. Cleaning up test GPS node ---');
  const revertRes = await request('http://localhost:3000/api/indicators/area_restored_ha', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  }, {
    gps_coordinates: originalWaypoints
  });
  assert(revertRes.status === 200, `Reverted indicator waypoints (Status ${revertRes.status})`);
  const revertedInd = revertRes.body.data || revertRes.body.indicator || revertRes.body;
  assert(revertedInd && revertedInd.gps_coordinates && revertedInd.gps_coordinates.length === originalWaypoints.length,
    `Waypoints reverted to original count: ${originalWaypoints.length}`);

  console.log('\n========================================================');
  console.log(`Results: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
  console.log('========================================================');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runGpsVerification().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
