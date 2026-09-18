import type {
  ApiUser,
  CustomerOrderOfflineRow,
  InventoryRow,
  OrderLine,
  OrderRecord,
  RetailOrderRow,
  ReviewRecord,
  StoreSettings,
} from '../types/api';
import { DEFAULT_STORE_SHIPPING } from '../config/commerce';

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '/api';

async function request<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const token = localStorage.getItem('dailydry-token')?.trim() || undefined;
  const adminToken = localStorage.getItem('dailydry-admin-token')?.trim() || undefined;

  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action,
      token: token || undefined,
      adminToken: adminToken || undefined,
      ...payload,
    }),
  });

  const text = await res.text();
  let data: { ok?: boolean; error?: string; [key: string]: unknown };
  try {
    data = JSON.parse(text);
  } catch {
    const hint =
      text.includes('Sign in') || res.status === 401
        ? ' Google Apps Script must be deployed with Who has access: Anyone (redeploy Web app).'
        : '';
    throw new Error(
      'Server returned an invalid response. Check .env VITE_APPS_SCRIPT_URL and restart npm run dev.' +
        hint
    );
  }

  if (!res.ok || data.ok === false) {
    const msg = data.error || `Request failed (${res.status})`;
    if (
      adminToken &&
      /admin session|admin not signed|could not decode|invalid admin/i.test(String(msg))
    ) {
      localStorage.removeItem('dailydry-admin-token');
    }
    throw new Error(msg);
  }

  return data as T;
}

export async function registerUser(input: {
  name: string;
  mobile: string;
  email: string;
  address: string;
  password: string;
}): Promise<{ user: ApiUser; token: string }> {
  return request('register', input);
}

export async function loginUser(mobile: string, password: string): Promise<{ user: ApiUser; token: string }> {
  return request('login', { mobile, password });
}

export async function requestPasswordReset(
  mobile: string,
  email: string
): Promise<{ message: string }> {
  const data = await request<{ message?: string }>('requestPasswordReset', { mobile, email });
  return { message: data.message || 'Reset code sent to your email' };
}

export async function completePasswordReset(input: {
  mobile: string;
  email: string;
  code: string;
  newPassword: string;
}): Promise<{ message: string }> {
  const data = await request<{ message?: string }>('completePasswordReset', {
    mobile: input.mobile,
    email: input.email,
    code: input.code,
    newPassword: input.newPassword,
  });
  return { message: data.message || 'Password updated' };
}

export async function fetchInventory(): Promise<{ inventory: InventoryRow[]; storeSettings: StoreSettings }> {
  const data = await request<{ inventory: InventoryRow[]; storeSettings?: StoreSettings }>('getInventory');
  const storeSettings = data.storeSettings;
  return {
    inventory: data.inventory || [],
    storeSettings: {
      shippingFee: Number(storeSettings?.shippingFee) || DEFAULT_STORE_SHIPPING.shippingFee,
      freeShippingMin: Number(storeSettings?.freeShippingMin) || DEFAULT_STORE_SHIPPING.freeShippingMin,
    },
  };
}

export async function placeOrder(input: {
  address: string;
  items: OrderLine[];
  orderAmount: number;
  shippingCharges: number;
  totalAmount: number;
  paymentMethod?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  paymentToken?: string;
}): Promise<{ order: OrderRecord }> {
  return request('createOrder', input);
}

export async function fetchMyOrders(): Promise<OrderRecord[]> {
  const data = await request<{ orders: OrderRecord[] }>('getMyOrders');
  return data.orders || [];
}

export async function fetchTrackOrder(orderNumber: string): Promise<OrderRecord> {
  const ref = orderNumber.trim();
  const load = () =>
    request<{ order?: OrderRecord }>('trackOrder', {
      orderNumber: ref,
    });

  let lastErr: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const data = await load();
      if (data.order) return data.order;
      lastErr = new Error(
        'Order not found. Check the order number or bill number from your confirmation email.'
      );
    } catch (err) {
      lastErr = err instanceof Error ? err : new Error('Could not track order');
      const msg = lastErr.message.toLowerCase();
      const retryable =
        msg.includes('invalid response') ||
        msg.includes('request failed') ||
        msg.includes('failed to fetch') ||
        msg.includes('network');
      if (attempt === 0 && retryable) {
        await new Promise((r) => setTimeout(r, 600));
        continue;
      }
      throw lastErr;
    }
  }
  throw lastErr || new Error('Order not found');
}

export async function submitReview(input: {
  productName?: string;
  rating: number;
  text: string;
  fullName?: string;
}): Promise<void> {
  const payload: Record<string, unknown> = {
    rating: input.rating,
    text: input.text,
    fullName: input.fullName,
  };
  const product = input.productName?.trim();
  if (product) payload.productName = product;
  await request('submitReview', payload);
}

function mergeReviewsById(lists: ReviewRecord[][]): ReviewRecord[] {
  const byId = new Map<string, ReviewRecord>();
  for (const list of lists) {
    for (const r of list) {
      if (r?.reviewId) byId.set(String(r.reviewId), r);
    }
  }
  return [...byId.values()].sort((a, b) => Number(b.reviewId) - Number(a.reviewId));
}

async function fetchReviewsLegacyMerged(): Promise<ReviewRecord[]> {
  const lists: ReviewRecord[][] = [];
  const tryList = async (params: Record<string, unknown>) => {
    try {
      const data = await request<{ reviews: ReviewRecord[] }>('getReviews', params);
      lists.push(data.reviews || []);
    } catch {
      /* older deployments expose different getReviews filters */
    }
  };
  await tryList({ productName: '' });
  await tryList({ productName: 'undefined' });
  await tryList({});
  return mergeReviewsById(lists);
}

export async function fetchFeaturedReviews(): Promise<ReviewRecord[]> {
  try {
    const data = await request<{ reviews: ReviewRecord[] }>('getFeaturedReviews');
    return data.reviews || [];
  } catch {
    return fetchReviewsLegacyMerged();
  }
}

export async function fetchProductReviews(productName: string): Promise<ReviewRecord[]> {
  const data = await request<{ reviews: ReviewRecord[] }>('getReviews', { productName });
  return data.reviews || [];
}

export async function submitContactForm(input: {
  customerName: string;
  mobile: string;
  address?: string;
  email?: string;
  remarks: string;
}): Promise<void> {
  await request('submitContact', input);
}

export async function adminLogin(userName: string, password: string): Promise<{ adminToken: string }> {
  return request('adminLogin', { userName, password });
}

export async function adminFetchOrders(): Promise<OrderRecord[]> {
  const data = await request<{ orders: OrderRecord[] }>('adminGetOrders');
  return data.orders || [];
}

export async function adminUpdateOrderStatus(orderNumber: string, orderStatus: string): Promise<void> {
  await request('adminUpdateOrderStatus', { orderNumber, orderStatus });
}

export async function adminUpdateStoreSettings(input: {
  shippingFee: number;
  freeShippingMin: number;
}): Promise<StoreSettings> {
  const data = await request<{ storeSettings: StoreSettings }>('adminUpdateStoreSettings', input);
  return data.storeSettings;
}

export async function adminFetchStoreSettings(): Promise<StoreSettings> {
  const data = await request<{ storeSettings: StoreSettings }>('adminGetStoreSettings');
  return data.storeSettings;
}

export async function adminUpdateInventory(
  rows: {
    sheetId?: string;
    productName: string;
    originalProductName?: string;
    category: string;
    sellerType?: string;
    stock: number;
    mrp?: number;
    offerPrice?: number | '';
    imagePath?: string;
    weight?: string;
    enabled: boolean;
    remarks1?: string;
    remarks2?: string;
  }[]
): Promise<void> {
  await request('adminUpdateInventory', { rows });
}

export async function adminFetchRetailOrders(): Promise<RetailOrderRow[]> {
  const data = await request<{ rows: RetailOrderRow[] }>('adminGetRetailOrders');
  return data.rows || [];
}

export async function adminFetchCustomerOrdersOffline(): Promise<CustomerOrderOfflineRow[]> {
  const data = await request<{ rows: CustomerOrderOfflineRow[] }>('adminGetCustomerOrdersOffline');
  return data.rows || [];
}

export async function adminSaveRetailOrder(row: Record<string, string | number>): Promise<void> {
  await request('adminAppendRetailOrder', { row });
}

export async function adminSaveCustomerOrderOffline(row: Record<string, string | number>): Promise<void> {
  await request('adminAppendCustomerOrderOffline', { row });
}
