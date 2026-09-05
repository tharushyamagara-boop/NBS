const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

function request(method, urlPath, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== SUNCASA ADMIN EDITORS VERIFICATION SUITE ===\n');
  let failures = 0;

  // -------------------------------------------------------------
  // Test 1: GET /api/admin/landing-stories
  // -------------------------------------------------------------
  try {
    console.log('Test 1: Fetching landing stories...');
    const res = await request('GET', '/api/admin/landing-stories');
    if (res.status === 200 && res.body.success && Array.isArray(res.body.data)) {
      console.log(`  ✓ Passed: Found ${res.body.data.length} landing stories.`);
      const storyIds = res.body.data.map((s) => s.id);
      console.log(`    Stories: ${storyIds.join(', ')}`);
      if (!storyIds.includes('mpazi-flood')) {
        console.error('  ✗ Failed: mpazi-flood missing from stories.');
        failures++;
      }
    } else {
      console.error('  ✗ Failed to fetch landing stories:', res);
      failures++;
    }
  } catch (err) {
    console.error('  ✗ Test 1 error:', err.message);
    failures++;
  }

  // -------------------------------------------------------------
  // Test 2: PUT /api/admin/landing-stories (Edit Landing Story)
  // -------------------------------------------------------------
  try {
    console.log('\nTest 2: Updating landing story via PUT...');
    const getRes = await request('GET', '/api/admin/landing-stories');
    const firstStory = getRes.body.data[0];
    const originalTitle = firstStory.en.title;

    const testUpdatedTitle = originalTitle + ' [VERIFIED]';
    const putRes = await request('PUT', '/api/admin/landing-stories', {
      story: {
        ...firstStory,
        en: {
          ...firstStory.en,
          title: testUpdatedTitle,
        },
      },
    });

    if (putRes.status === 200 && putRes.body.success) {
      console.log('  ✓ API returned 200 success for landing story update.');

      // Verify file on disk
      const filePath = path.join(__dirname, '../src/data/landing_stories.json');
      const onDisk = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const foundOnDisk = onDisk.find((s) => s.id === firstStory.id);
      if (foundOnDisk && foundOnDisk.en.title === testUpdatedTitle) {
        console.log('  ✓ Disk verification passed: landing_stories.json accurately updated.');
      } else {
        console.error('  ✗ Disk verification failed:', foundOnDisk?.en?.title);
        failures++;
      }

      // Revert change
      await request('PUT', '/api/admin/landing-stories', {
        story: {
          ...firstStory,
          en: {
            ...firstStory.en,
            title: originalTitle,
          },
        },
      });
      console.log('  ✓ Reverted test mutation on landing story.');
    } else {
      console.error('  ✗ Failed PUT /api/admin/landing-stories:', putRes);
      failures++;
    }
  } catch (err) {
    console.error('  ✗ Test 2 error:', err.message);
    failures++;
  }

  // -------------------------------------------------------------
  // Test 3: PATCH /api/indicators/[id] (Edit Indicator & Disk Sync)
  // -------------------------------------------------------------
  try {
    console.log('\nTest 3: Editing indicator via PATCH and checking disk persistence...');
    const getInd = await request('GET', '/api/indicators/area_restored_ha');
    const originalCurrent = getInd.body.data.current_2025;
    const originalDef = getInd.body.data.definition;

    const testCurrent = 999;
    const patchRes = await request('PATCH', '/api/indicators/area_restored_ha', {
      current_2025: testCurrent,
      definition: 'Total Area Restored and Managed through NbS [LIVE_EDIT]',
    });

    if (patchRes.status === 200 && patchRes.body.success) {
      console.log('  ✓ PATCH returned 200 with updated indicator data.');

      // Check src/data/indicators.json on disk
      const indPath = path.join(__dirname, '../src/data/indicators.json');
      const rawInd = JSON.parse(fs.readFileSync(indPath, 'utf-8'));
      const matched = rawInd.indicators.find((i) => i.id === 'area_restored_ha');

      if (matched && matched.current_2025 === testCurrent) {
        console.log(`  ✓ Disk verification passed: indicators.json current_2025 = ${testCurrent}.`);
      } else {
        console.error('  ✗ Disk verification failed:', matched?.current_2025);
        failures++;
      }

      // Revert change
      await request('PATCH', '/api/indicators/area_restored_ha', {
        current_2025: originalCurrent,
        definition: originalDef,
      });
      console.log('  ✓ Reverted indicator test mutation.');
    } else {
      console.error('  ✗ Failed PATCH /api/indicators/area_restored_ha:', patchRes);
      failures++;
    }
  } catch (err) {
    console.error('  ✗ Test 3 error:', err.message);
    failures++;
  }

  // -------------------------------------------------------------
  // Test 4: GET & PUT /api/admin/indicator-stories (3 Questions)
  // -------------------------------------------------------------
  try {
    console.log('\nTest 4: Editing indicator 3-question narratives via PUT...');
    const getNarr = await request('GET', '/api/admin/indicator-stories?id=flood_risk_reduction');
    if (getNarr.status === 200 && getNarr.body.success && getNarr.body.data) {
      console.log('  ✓ Fetched existing narrative for flood_risk_reduction.');
      const originalWhatEn = getNarr.body.data.en.what_is;

      const testWhatEn = originalWhatEn + ' [TEST_NARRATIVE]';
      const putNarr = await request('PUT', '/api/admin/indicator-stories', {
        indicatorId: 'flood_risk_reduction',
        narrative: {
          en: {
            what_is: testWhatEn,
          },
        },
      });

      if (putNarr.status === 200 && putNarr.body.success) {
        console.log('  ✓ PUT returned 200 success for indicator narrative.');

        // Verify disk
        const narrPath = path.join(__dirname, '../src/data/locales/indicator_narratives.json');
        const onDiskNarr = JSON.parse(fs.readFileSync(narrPath, 'utf-8'));
        if (onDiskNarr['flood_risk_reduction']?.en?.what_is === testWhatEn) {
          console.log('  ✓ Disk verification passed: indicator_narratives.json updated.');
        } else {
          console.error('  ✗ Disk verification failed:', onDiskNarr['flood_risk_reduction']?.en?.what_is);
          failures++;
        }

        // Revert
        await request('PUT', '/api/admin/indicator-stories', {
          indicatorId: 'flood_risk_reduction',
          narrative: {
            en: {
              what_is: originalWhatEn,
            },
          },
        });
        console.log('  ✓ Reverted indicator narrative test mutation.');
      } else {
        console.error('  ✗ PUT /api/admin/indicator-stories failed:', putNarr);
        failures++;
      }
    } else {
      console.error('  ✗ GET /api/admin/indicator-stories failed:', getNarr);
      failures++;
    }
  } catch (err) {
    console.error('  ✗ Test 4 error:', err.message);
    failures++;
  }

  console.log(`\n=== TEST RESULTS: ${failures === 0 ? 'ALL PASSED ✓' : `${failures} FAILURES ✗`} ===`);
  process.exit(failures === 0 ? 0 : 1);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
