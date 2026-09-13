export type AdminScreen = 'overview' | 'stock' | 'retail' | 'customer' | 'onlineOrders';

export const ADMIN_SCREENS: { id: AdminScreen; label: string; description: string }[] = [
  { id: 'overview', label: 'Stock dashboard', description: 'Products & live stock' },
  { id: 'stock', label: 'StockInventory', description: 'Products in sheet' },
  { id: 'onlineOrders', label: 'Online orders', description: 'Track website checkout' },
  { id: 'retail', label: 'RetailsOrder', description: 'Offline retail visits' },
  { id: 'customer', label: 'CustomerOrder', description: 'Offline customer orders' },
];
