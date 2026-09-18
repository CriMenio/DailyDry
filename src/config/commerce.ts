/** Fallback when sheet settings are unavailable (matches StoreSettings defaults). */
export const DEFAULT_STORE_SHIPPING = {
  shippingFee: 49,
  freeShippingMin: 999,
} as const;

export type StoreShippingSettings = {
  shippingFee: number;
  freeShippingMin: number;
};

/** @deprecated Use storeSettings from InventoryContext */
export const FREE_SHIPPING_MIN = DEFAULT_STORE_SHIPPING.freeShippingMin;
/** @deprecated Use storeSettings from InventoryContext */
export const SHIPPING_FEE = DEFAULT_STORE_SHIPPING.shippingFee;

/** Customer support / WhatsApp (10-digit mobile, no +91). */
export const STORE_PHONE = '8655933503';
export const STORE_PHONE_DISPLAY = '+91 86559 33503';
export const STORE_PHONE_TEL = `tel:+91${STORE_PHONE}`;
export const STORE_WHATSAPP_URL = `https://wa.me/91${STORE_PHONE}`;

export const STORE_EMAIL = 'daildryofficial@gmail.com';
export const STORE_EMAIL_MAILTO = `mailto:${STORE_EMAIL}`;

/** Pre-filled WhatsApp message for customer to confirm a placed order with the store. */
export function buildOrderConfirmWhatsAppUrl(order: {
  orderNumber: string;
  billNumber: string;
  customerName: string;
  mobile: string;
  address: string;
  items: { name: string; quantity: number; unitPrice: number }[];
  orderAmount: number;
  shippingCharges: number;
  totalAmount: number;
  paymentStatus?: string;
}): string {
  const lines = order.items.map(
    (line) => `• ${line.name} × ${line.quantity} — ₹${line.unitPrice * line.quantity}`
  );
  const payment =
    order.paymentStatus === 'COD' || !order.paymentStatus
      ? 'Cash on delivery (COD)'
      : order.paymentStatus === 'Paid'
        ? 'Paid online'
        : order.paymentStatus;

  const text = [
    'Hello Daily Dry, I placed an order on your website. Please confirm.',
    '',
    `Order: ${order.orderNumber}`,
    `Bill: ${order.billNumber}`,
    `Name: ${order.customerName}`,
    `Mobile: ${order.mobile}`,
    `Address: ${order.address}`,
    '',
    'Items:',
    ...lines,
    '',
    `Subtotal: ₹${order.orderAmount}`,
    `Shipping: ₹${order.shippingCharges}`,
    `Total: ₹${order.totalAmount}`,
    `Payment: ${payment}`,
  ].join('\n');

  return `${STORE_WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
}

export const STORE_ADDRESS = 'Kalamboli Sector 14, Navi Mumbai, Maharashtra 400001';

export const STORE_INSTAGRAM_HANDLE = '@dailydry.co';
export const STORE_INSTAGRAM_URL = 'https://www.instagram.com/dailydry.co/';

/** Update these if your profile URLs differ. */
export const STORE_FACEBOOK_URL = 'https://www.facebook.com/dailydry.co';
export const STORE_TWITTER_URL = 'https://x.com/dailydry.co';
export const STORE_YOUTUBE_URL = 'https://www.youtube.com/@dailydry.co';

export const STORE_SOCIAL_LINKS = [
  { id: 'facebook', label: 'Facebook', href: STORE_FACEBOOK_URL },
  { id: 'instagram', label: 'Instagram', href: STORE_INSTAGRAM_URL },
  { id: 'twitter', label: 'Twitter', href: STORE_TWITTER_URL },
  { id: 'youtube', label: 'Youtube', href: STORE_YOUTUBE_URL },
] as const;

export const ORDER_STATUSES = [
  'Order Placed',
  'Out For Delivery',
  'Arrived',
  'Delivered',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function calcShipping(
  subtotal: number,
  settings: StoreShippingSettings = DEFAULT_STORE_SHIPPING
): number {
  return subtotal > settings.freeShippingMin ? 0 : settings.shippingFee;
}

/** Customer-facing: free when subtotal is strictly above this amount. */
export function freeShippingThresholdLabel(settings: StoreShippingSettings): string {
  return String(settings.freeShippingMin);
}

export function shippingPolicySummary(settings: StoreShippingSettings): string {
  const fee = settings.shippingFee;
  const min = settings.freeShippingMin;
  return `Free shipping on orders above ₹${min}. Orders at ₹${min} or below have a flat ₹${fee} delivery charge.`;
}

export function lowStockMessage(stock: number): string | null {
  if (stock <= 0) return 'Out of stock';
  if (stock < 10) return `Only ${stock} items left`;
  return null;
}
