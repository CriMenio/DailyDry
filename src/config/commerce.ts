/** Free shipping when subtotal is strictly above this amount (₹999 → free at ₹1000+). */
export const FREE_SHIPPING_MIN = 999;
export const SHIPPING_FEE = 49;

/** Customer support / WhatsApp (10-digit mobile, no +91). */
export const STORE_PHONE = '7710955102';
export const STORE_PHONE_DISPLAY = '+91 77109 55102';
export const STORE_PHONE_TEL = `tel:+91${STORE_PHONE}`;
export const STORE_WHATSAPP_URL = `https://wa.me/91${STORE_PHONE}`;

export const STORE_ADDRESS = 'Kalamboli Sector 14, Navi Mumbai, Maharashtra 400001';

export const STORE_INSTAGRAM_HANDLE = '@dailydry.co';
export const STORE_INSTAGRAM_URL =
  'https://www.instagram.com/dailydry.co?stkn=MWpzbmRkdGQ2OW8zcQ==';

export const ORDER_STATUSES = [
  'Order Placed',
  'Out For Delivery',
  'Arrived',
  'Delivered',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function calcShipping(subtotal: number): number {
  return subtotal > FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
}

export function lowStockMessage(stock: number): string | null {
  if (stock <= 0) return 'Out of stock';
  if (stock < 10) return `Only ${stock} items left`;
  return null;
}
