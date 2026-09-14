export interface ApiUser {
  userId: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
}

export interface InventoryRow {
  sheetId: string;
  productName: string;
  category: string;
  sellerType: string;
  stock: number;
  mrp: number;
  imagePath: string;
  weight: string;
  remarks1: string;
  remarks2: string;
  enabled: boolean;
}

export interface StoreSettings {
  shippingFee: number;
  freeShippingMin: number;
}

export interface OrderLine {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderRecord {
  orderId: string;
  orderNumber: string;
  billNumber: string;
  userId?: string;
  customerName: string;
  mobile: string;
  email?: string;
  address: string;
  items: OrderLine[];
  orderAmount: number;
  shippingCharges: number;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  orderPlacedAt?: string;
}

export interface ReviewRecord {
  reviewId: string;
  fullName: string;
  rating: number;
  text: string;
}

export interface RetailOrderRow {
  sheetId: string;
  billNo: string;
  shopNameCustomer: string;
  mobile: string;
  whatsApp: string;
  area: string;
  address: string;
  shopType: string;
  visitDate: string;
  status: string;
  productName: string;
  qty: string;
  alFree: string;
  caFree: string;
  orderAmount: string;
  payment: string;
  paymentStatus: string;
  paymentDueDate: string;
  lastFollowUp: string;
  remarks1: string;
  remarks2: string;
}

export interface CustomerOrderOfflineRow {
  sheetId: string;
  customerName: string;
  mobileNumber: string;
  address: string;
  emailId: string;
  orderNumber: string;
  billNumber: string;
  productDescription: string;
  quantity: string;
  orderAmount: string;
  shippingCharges: string;
  totalAmount: string;
  paymentStatus: string;
  orderStatus: string;
}
