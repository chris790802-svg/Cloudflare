export async function onRequestGet({ env }) {
  if (!env.CWA_API_KEY) {
    return new Response(JSON.stringify({ success: 'false', error: '尚未設定 CWA_API_KEY' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url =
    'https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0015-001' +
    `?Authorization=${encodeURIComponent(env.CWA_API_KEY)}&format=JSON&limit=10`;

  const res = await fetch(url, { cf: { cacheTtl: 60, cacheEverything: true } });

  return new Response(res.body, {
    status: res.status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
    },
  });
}
