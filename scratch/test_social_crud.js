const http = require('http');

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
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
        } catch {
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

async function testCrud() {
  console.log('--- Testing Social Share Links CRUD ---');

  // 1. GET public
  const publicRes = await request('GET', '/api/social-links');
  console.log('1. Public GET /api/social-links:', publicRes.status, 'Count:', publicRes.body?.count);
  if (publicRes.status !== 200 || !publicRes.body?.success) {
    throw new Error('Failed to get public social links');
  }

  // 2. GET admin
  const adminRes = await request('GET', '/api/admin/social-links');
  console.log('2. Admin GET /api/admin/social-links:', adminRes.status, 'Count:', adminRes.body?.count);
  if (adminRes.status !== 200 || !adminRes.body?.success) {
    throw new Error('Failed to get admin social links');
  }

  // 3. POST new social link (WhatsApp)
  const newSocial = {
    id: 'whatsapp_test',
    name: 'WhatsApp Test',
    icon: '💬',
    bg_color: '#25d366',
    text_color: '#ffffff',
    share_type: 'template',
    url_template: 'https://api.whatsapp.com/send?text={title}%20{url}',
    is_active: true,
    order: 10,
  };
  const postRes = await request('POST', '/api/admin/social-links', newSocial);
  console.log('3. POST /api/admin/social-links (WhatsApp):', postRes.status, postRes.body?.message);
  if (postRes.status !== 200 || !postRes.body?.success) {
    throw new Error('Failed to create social link: ' + JSON.stringify(postRes.body));
  }

  // 4. Verify it appears in public GET
  const verifyPublic = await request('GET', '/api/social-links');
  const found = (verifyPublic.body?.data || []).find((s) => s.id === 'whatsapp_test');
  console.log('4. Verification in public API:', found ? 'FOUND ✓' : 'NOT FOUND ✗');
  if (!found) throw new Error('New item not in public list');

  // 5. PUT edit social link
  const putRes = await request('PUT', '/api/admin/social-links', {
    id: 'whatsapp_test',
    name: 'WhatsApp Updated',
    bg_color: '#128c7e',
  });
  console.log('5. PUT /api/admin/social-links:', putRes.status, putRes.body?.message);
  if (putRes.status !== 200 || !putRes.body?.success) {
    throw new Error('Failed to update social link');
  }

  // 6. DELETE social link
  const delRes = await request('DELETE', '/api/admin/social-links?id=whatsapp_test');
  console.log('6. DELETE /api/admin/social-links:', delRes.status, delRes.body?.message);
  if (delRes.status !== 200 || !delRes.body?.success) {
    throw new Error('Failed to delete social link');
  }

  // 7. Verify deletion
  const verifyDel = await request('GET', '/api/social-links');
  const stillThere = (verifyDel.body?.data || []).find((s) => s.id === 'whatsapp_test');
  console.log('7. Verification after delete:', stillThere ? 'STILL THERE ✗' : 'REMOVED ✓');
  if (stillThere) throw new Error('Item was not deleted');

  console.log('\nAll Social Share Links CRUD Tests PASSED successfully!');
}

testCrud().catch((err) => {
  console.error('Test FAILED:', err);
  process.exit(1);
});
