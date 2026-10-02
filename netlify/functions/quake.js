const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { Accept: 'application/json' }, timeout: 8000 }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('timeout', () => req.destroy(new Error('連線氣象署逾時')));
    req.on('error', reject);
  });
}

exports.handler = async () => {
  const key = process.env.CWA_API_KEY;
  if (!key) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: 'false', error: '尚未設定 CWA_API_KEY' }),
    };
  }

  const url =
    'https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0015-001' +
    `?Authorization=${encodeURIComponent(key.trim())}&format=JSON&limit=10`;

  try {
    const { status, body } = await get(url);
    return {
      statusCode: status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=60',
      },
      body,
    };
  } catch (e) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: 'false', error: String(e.message || e), code: e.code || null }),
    };
  }
};
