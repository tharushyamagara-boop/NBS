const http = require('http');

function fetchPage(urlPath) {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000' + urlPath, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, html: data }));
    }).on('error', reject);
  });
}

async function verify() {
  console.log('--- Verifying Pages Render & HTTP Status ---');

  const pages = ['/', '/admin', '/indicator/area_restored_ha', '/indicator/flood_risk_reduction'];
  for (const page of pages) {
    const res = await fetchPage(page);
    console.log(`Page: ${page} -> Status ${res.status}, Length: ${res.html.length} bytes`);
    if (res.status !== 200) {
      console.error(`Error on ${page}: status ${res.status}`);
    }
  }

  // Check home page contains civic story cards
  const home = await fetchPage('/');
  const hasStories = home.html.includes('Mpazi') || home.html.includes('civic-stories');
  console.log(`Home page contains civic stories: ${hasStories ? 'YES ✓' : 'NO ✗'}`);

  // Check admin page contains new navigation items
  const admin = await fetchPage('/admin');
  const hasAdmin = admin.html.includes('SUNCASA Admin Portal');
  console.log(`Admin page renders console: ${hasAdmin ? 'YES ✓' : 'NO ✗'}`);
}

verify().catch(console.error);
