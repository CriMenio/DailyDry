/**
 * Local dev: writes to public/media/products (via repo when running vite).
 * Production: forwards to Apps Script (Google Drive) when APPS_SCRIPT_URL is set.
 */
exports.handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: JSON.stringify({ ok: false, error: 'Method not allowed' }) };
  }

  const scriptUrl = process.env.APPS_SCRIPT_URL;
  if (!scriptUrl) {
    return {
      statusCode: 503,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: false,
        error: 'Image upload on live site requires APPS_SCRIPT_URL. Or upload while running npm run dev.',
      }),
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const res = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'uploadProductImage',
        adminToken: payload.adminToken,
        fileName: payload.fileName,
        mimeType: payload.mimeType,
        data: payload.data,
      }),
      redirect: 'follow',
    });
    const text = await res.text();
    return {
      statusCode: 200,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: String(err.message || err) }),
    };
  }
};
