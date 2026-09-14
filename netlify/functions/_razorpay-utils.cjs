const crypto = require('crypto');

function getRazorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set on Netlify');
  }
  return { keyId, keySecret };
}

function razorpayAuthHeader(keyId, keySecret) {
  const token = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  return `Basic ${token}`;
}

function verifyPaymentSignature(orderId, paymentId, signature, keySecret) {
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(String(signature || ''), 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function buildPaymentToken(paymentId, razorpayOrderId, amountPaise, keySecret) {
  const message = `${paymentId}|${razorpayOrderId}|${amountPaise}`;
  return crypto.createHmac('sha256', keySecret).update(message).digest('hex');
}

function jsonResponse(statusCode, body, cors) {
  return {
    statusCode,
    headers: { ...cors, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

module.exports = {
  getRazorpayCredentials,
  razorpayAuthHeader,
  verifyPaymentSignature,
  buildPaymentToken,
  jsonResponse,
  corsHeaders,
};
