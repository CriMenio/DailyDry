/** Online checkout orders — keep in sync with Apps Script adminUpdateOrderStatus */
export const ORDER_TRACKING_STEPS = [
  'Order Placed',
  'Dispatch',
  'Out for Delivery',
  'Delivered',
] as const;

export type OrderTrackingStep = (typeof ORDER_TRACKING_STEPS)[number];

export const PAYMENT_METHOD_COD = 'COD' as const;
export const PAYMENT_METHOD_RAZORPAY = 'RAZORPAY' as const;
/** @deprecated Use PAYMENT_METHOD_RAZORPAY — kept for labels */
export const PAYMENT_METHOD_UPI = 'RAZORPAY' as const;

export function formatPaymentStatusLabel(paymentStatus: string): string {
  const s = paymentStatus.trim();
  if (s === 'COD') return 'Cash on delivery';
  if (s === 'Paid' || s.toLowerCase() === 'paid') return 'Paid online';
  return s;
}

export function orderStepIndex(status: string): number {
  const normalized = status.trim().toLowerCase();
  const idx = ORDER_TRACKING_STEPS.findIndex((s) => s.toLowerCase() === normalized);
  if (idx >= 0) return idx;
  if (normalized.includes('deliver') && !normalized.includes('out')) return 3;
  if (normalized.includes('out for')) return 2;
  if (normalized.includes('dispatch')) return 1;
  return 0;
}

export function isAllowedOrderStatus(status: string): boolean {
  return ORDER_TRACKING_STEPS.some((s) => s.toLowerCase() === status.trim().toLowerCase());
}
