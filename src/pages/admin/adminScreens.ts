export type AdminScreen = 'overview' | 'stock' | 'shipping' | 'retail' | 'customer' | 'onlineOrders';

export const ADMIN_SCREENS: { id: AdminScreen; label: string; description: string }[] = [
  { id: 'overview', label: 'Stock dashboard', description: 'Products & live stock' },
  { id: 'stock', label: 'StockInventory', description: 'Products in sheet' },
  { id: 'shipping', label: 'Shipping', description: 'Delivery fees & free shipping' },
  { id: 'onlineOrders', label: 'Online orders', description: 'Website checkout — status only' },
  { id: 'retail', label: 'RetailsOrder', description: 'Offline — manual entry' },
  { id: 'customer', label: 'CustomerOrder', description: 'Offline — manual entry' },
];
