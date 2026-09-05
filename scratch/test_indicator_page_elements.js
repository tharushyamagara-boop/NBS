const http = require('http');

function checkIndicator(indicatorId) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000/indicator/${indicatorId}`, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, body });
      });
    }).on('error', reject);
  });
}

async function verifyAll() {
  console.log('=== VERIFYING SECTION 7.2 INDICATOR PAGES ===\n');

  const testIds = ['area_restored_ha', 'flood_risk_reduction', 'trees_planted', 'green_jobs_created'];

  for (const id of testIds) {
    console.log(`--- Checking Indicator Page: /indicator/${id} ---`);
    const res = await checkIndicator(id);
    const body = res.body;

    console.log(`HTTP Status: ${res.status}`);

    // 1. Plain-language explanation
    const hasPlainLang = body.includes('What is this indicator') || 
                         body.includes('mypeg-chart-subtitle') ||
                         body.includes('definition');
    console.log(`1. Plain-Language Explanation: ${hasPlainLang ? 'YES ✓' : 'NO ✗'}`);

    // 2. "Why this matters" narrative
    const hasWhyMatters = body.includes('Why This Matters') || 
                          body.includes('Why does this indicator matter') || 
                          body.includes('why_matters') ||
                          body.includes('Relevance to Kigali') ||
                          body.includes('Kuki iki gipimo');
    console.log(`2. "Why This Matters" Narrative: ${hasWhyMatters ? 'YES ✓' : 'NO ✗'}`);

    // 3. Simple visualization (chart or map)
    const hasChart = body.includes('mypeg-indicator-line-chart') || body.includes('Graph & Data');
    const hasMap = body.includes('Micro-Catchment Map') || body.includes('CatchmentMap');
    console.log(`3. Simple Visualization:`);
    console.log(`   - Time-Series Chart (Chart.js): ${hasChart ? 'YES ✓' : 'NO ✗'}`);
    console.log(`   - Interactive GIS Map: ${hasMap ? 'YES ✓' : 'NO ✗'}`);

    // 4. Data source and update information
    const hasDataSource = body.includes('Data Source') || body.includes('data_source_citation');
    const hasUpdateInfo = body.includes('Date of Latest Update') || body.includes('Bi-Annual') || body.includes('2025');
    console.log(`4. Data Source & Update Information:`);
    console.log(`   - Data Source Citation: ${hasDataSource ? 'YES ✓' : 'NO ✗'}`);
    console.log(`   - Update Information / Frequency: ${hasUpdateInfo ? 'YES ✓' : 'NO ✗'}`);

    console.log('');
  }

  console.log('=== SECTION 7.2 VERIFICATION COMPLETED ===');
}

verifyAll().catch(console.error);
