const {
  getRazorpayCredentials,
  razorpayAuthHeader,
  jsonResponse,
  corsHeaders,
} = require('./_razorpay-utils.cjs');

exports.handler = async (event) => {
  const cors = corsHeaders;

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { ok: false, error: 'Method not allowed' }, cors);
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { ok: false, error: 'Invalid JSON body' }, cors);
  }

  const amountPaise = Number(body.amountPaise);
  if (!Number.isFinite(amountPaise) || amountPaise < 100) {
    return jsonResponse(400, { ok: false, error: 'Invalid amount' }, cors);
  }

  try {
    const { keyId, keySecret } = getRazorpayCredentials();
    const receipt = String(body.receipt || `dailydry-${Date.now()}`).slice(0, 40);

    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: razorpayAuthHeader(keyId, keySecret),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amountPaise),
        currency: 'INR',
        receipt,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const msg = data.error?.description || data.error?.reason || 'Could not create Razorpay order';
      return jsonResponse(502, { ok: false, error: msg }, cors);
    }

    return jsonResponse(
      200,
      {
        ok: true,
        orderId: data.id,
        amount: data.amount,
        currency: data.currency,
        keyId,
      },
      cors
    );
  } catch (err) {
    return jsonResponse(500, { ok: false, error: String(err.message || err) }, cors);
  }
};
