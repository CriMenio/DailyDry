const {
  getRazorpayCredentials,
  verifyPaymentSignature,
  buildPaymentToken,
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

  const razorpayOrderId = String(body.razorpay_order_id || body.razorpayOrderId || '').trim();
  const razorpayPaymentId = String(body.razorpay_payment_id || body.razorpayPaymentId || '').trim();
  const signature = String(body.razorpay_signature || body.razorpaySignature || '').trim();
  const amountPaise = Number(body.amountPaise);

  if (!razorpayOrderId || !razorpayPaymentId || !signature) {
    return jsonResponse(400, { ok: false, error: 'Missing payment fields' }, cors);
  }
  if (!Number.isFinite(amountPaise) || amountPaise < 100) {
    return jsonResponse(400, { ok: false, error: 'Invalid amount' }, cors);
  }

  try {
    const { keySecret } = getRazorpayCredentials();
    const valid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, signature, keySecret);
    if (!valid) {
      return jsonResponse(400, { ok: false, error: 'Payment verification failed' }, cors);
    }

    const paymentToken = buildPaymentToken(
      razorpayPaymentId,
      razorpayOrderId,
      Math.round(amountPaise),
      keySecret
    );

    return jsonResponse(
      200,
      {
        ok: true,
        paymentToken,
        razorpayPaymentId,
        razorpayOrderId,
      },
      cors
    );
  } catch (err) {
    return jsonResponse(500, { ok: false, error: String(err.message || err) }, cors);
  }
};
