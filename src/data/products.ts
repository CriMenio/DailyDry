import { categoryImages, productImages, pouchProductImages, instagramImages } from './media';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  weight: string;
  badge?: string;
  /** From StockInventory SellerType — drives Best Sellers / New Arrivals on home. */
  sellerType?: 'best-seller' | 'new-arrival';
  /** Sheet row is listed on shop (Remarks1 ≠ DISABLED). */
  listed?: boolean;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export const categories: Category[] = [
  { id: '1', name: 'Almonds', slug: 'almonds', image: categoryImages.almonds },
  { id: '2', name: 'Cashews', slug: 'cashews', image: categoryImages.cashews },
  { id: '3', name: 'Raisins', slug: 'raisins', image: categoryImages.raisins },
  { id: '4', name: 'Muesli', slug: 'muesli', image: categoryImages.muesli },
  { id: '5', name: 'Dry Fruit Mix', slug: 'dry-fruit-mix', image: categoryImages['dry-fruit-mix'] },
  { id: '6', name: 'Walnuts', slug: 'walnuts', image: categoryImages.walnuts },
];

/** Map sheet Category cell to shop filter slug (almonds, cashews, …). */
export function normalizeCategorySlug(value: string): string {
  const v = value.trim().toLowerCase();
  if (!v) return 'dry-fruit-mix';
  const match = categories.find(
    (c) => c.slug === v || c.name.toLowerCase() === v || c.slug.replace(/-/g, ' ') === v.replace(/-/g, ' ')
  );
  return match?.slug ?? v.replace(/\s+/g, '-');
}

export function categoryLabel(slug: string): string {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}

/** Sheet SellerType → home section slug. */
export function normalizeSellerType(value: string): 'best-seller' | 'new-arrival' | undefined {
  const v = value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (v === 'bestseller' || v === 'best') return 'best-seller';
  if (v === 'newarrival' || v === 'new') return 'new-arrival';
  return undefined;
}

export function sellerTypeSheetValue(slug: string): string {
  if (slug === 'best-seller') return 'Best Seller';
  if (slug === 'new-arrival') return 'New Arrival';
  return '';
}

export const SELLER_TYPE_FORM_OPTIONS = [
  { value: '', label: 'None — not in home highlights' },
  { value: 'best-seller', label: 'Best Seller' },
  { value: 'new-arrival', label: 'New Arrival' },
] as const;

export function sellerTypeFormValue(rowValue: string): string {
  const n = normalizeSellerType(rowValue);
  return n ?? '';
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Almonds',
    category: 'almonds',
    price: 299,
    originalPrice: 349,
    rating: 4.8,
    reviews: 125,
    image: productImages.almonds,
    description: 'Handpicked California almonds, rich in protein and healthy fats. Perfect for snacking or adding to your daily diet.',
    weight: '250g',
    badge: 'Best Seller',
    inStock: true,
  },
  {
    id: '2',
    name: 'Roasted Cashews',
    category: 'cashews',
    price: 349,
    rating: 4.7,
    reviews: 98,
    image: productImages.cashews,
    description: 'Crunchy roasted cashews with a buttery flavor. Lightly salted for the perfect taste.',
    weight: '250g',
    inStock: true,
  },
  {
    id: '3',
    name: 'Golden Kishmish',
    category: 'raisins',
    price: 199,
    rating: 4.6,
    reviews: 87,
    image: productImages.raisins,
    description: 'Sweet and plump golden raisins sourced from the finest vineyards. A natural energy booster.',
    weight: '200g',
    inStock: true,
  },
  {
    id: '4',
    name: 'Premium Muesli Mix',
    category: 'muesli',
    price: 399,
    originalPrice: 449,
    rating: 4.9,
    reviews: 156,
    image: productImages.muesli,
    description: 'A wholesome blend of oats, nuts, dried fruits, and seeds. Your perfect breakfast companion.',
    weight: '500g',
    badge: 'New',
    inStock: true,
  },
  {
    id: '5',
    name: 'Dry Fruit Mix',
    category: 'dry-fruit-mix',
    price: 449,
    rating: 4.8,
    reviews: 203,
    image: productImages.mix,
    description: 'A luxurious mix of almonds, cashews, raisins, pistachios, and more. Ideal for gifting.',
    weight: '300g',
    badge: 'Popular',
    inStock: true,
  },
  {
    id: '6',
    name: 'Premium Walnuts',
    category: 'walnuts',
    price: 379,
    rating: 4.7,
    reviews: 76,
    image: productImages.walnuts,
    description: 'Brain-boosting walnuts packed with omega-3 fatty acids. Fresh and crunchy.',
    weight: '250g',
    inStock: true,
  },
  {
    id: '7',
    name: 'Pistachios',
    category: 'almonds',
    price: 499,
    rating: 4.9,
    reviews: 112,
    image: productImages.pistachios,
    description: 'Premium roasted pistachios with a delightful crunch. Rich in antioxidants.',
    weight: '200g',
    inStock: true,
  },
  {
    id: '8',
    name: 'Dates (Medjool)',
    category: 'raisins',
    price: 299,
    rating: 4.5,
    reviews: 64,
    image: productImages.dates,
    description: 'Soft and sweet Medjool dates. A natural sweetener and energy source.',
    weight: '250g',
    inStock: true,
  },
  {
    id: '9',
    name: 'Trail Mix',
    category: 'dry-fruit-mix',
    price: 329,
    rating: 4.6,
    reviews: 91,
    image: productImages.mix,
    description: 'Perfect on-the-go snack mix with nuts, seeds, and dried berries.',
    weight: '200g',
    inStock: true,
  },
  {
    id: '10',
    name: 'Organic Almonds',
    category: 'almonds',
    price: 399,
    rating: 4.8,
    reviews: 54,
    image: productImages.almonds,
    description: 'Certified organic almonds with no preservatives. Pure and natural.',
    weight: '250g',
    badge: 'Organic',
    inStock: true,
  },
  {
    id: '11',
    name: 'Premium Almonds Nuts',
    category: 'almonds',
    price: 299,
    originalPrice: 349,
    rating: 4.9,
    reviews: 142,
    image: pouchProductImages.almonds,
    description: 'Daily Dry premium almonds in a hygienic stand-up pouch. Rich in protein and healthy fats.',
    weight: '200g',
    badge: 'Best Seller',
    inStock: true,
  },
  {
    id: '12',
    name: 'Premium Cashew Nuts',
    category: 'cashews',
    price: 349,
    rating: 4.8,
    reviews: 118,
    image: pouchProductImages.cashews,
    description: 'Fresh & tasty whole cashews. Premium quality, hygienically packed.',
    weight: '200g',
    badge: 'Best Seller',
    inStock: true,
  },
  {
    id: '13',
    name: 'Premium Dry Fruit Mix Nuts',
    category: 'dry-fruit-mix',
    price: 449,
    originalPrice: 499,
    rating: 4.9,
    reviews: 186,
    image: pouchProductImages.dryFruitMix,
    description: 'A luxurious mix of almonds, cashews, raisins, pistachios and more. Ideal for gifting.',
    weight: '200g',
    badge: 'Popular',
    inStock: true,
  },
  {
    id: '14',
    name: 'Premium Almonds Nuts',
    category: 'almonds',
    price: 299,
    originalPrice: 349,
    rating: 4.8,
    reviews: 125,
    image: pouchProductImages.almonds,
    description: 'Daily Dry premium almonds in a hygienic stand-up pouch. Rich in protein and healthy fats.',
    weight: '200g',
    badge: 'Best Seller',
    inStock: true,
  },
  {
    id: '15',
    name: 'Premium Almonds & Cashews Nut Mix',
    category: 'dry-fruit-mix',
    price: 349,
    rating: 4.7,
    reviews: 98,
    image: pouchProductImages.almondCashewMix,
    description: 'A perfect blend of premium almonds and cashews. Fresh, crunchy, and hygienically packed.',
    weight: '250g',
    inStock: true,
  },
  {
    id: '16',
    name: 'Premium Muesli Mix',
    category: 'muesli',
    price: 399,
    originalPrice: 449,
    rating: 4.9,
    reviews: 156,
    image: pouchProductImages.muesli,
    description: 'A wholesome blend of oats, nuts, dried fruits, and seeds. Your perfect breakfast companion.',
    weight: '200g',
    badge: 'New',
    inStock: true,
  },
  {
    id: '17',
    name: 'Premium Golden Kishmish',
    category: 'raisins',
    price: 199,
    rating: 4.6,
    reviews: 87,
    image: pouchProductImages.kishmish,
    description: 'Sweet and plump golden raisins sourced from the finest vineyards. A natural energy booster.',
    weight: '250g',
    inStock: true,
  },
];

export const testimonials = [
  {
    id: '1',
    name: 'Priya Sharma',
    rating: 5,
    text: 'Daily Dry products are simply amazing! Fresh, crunchy and full of taste. My family loves them!',
  },
  {
    id: '2',
    name: 'Rahul Mehta',
    rating: 5,
    text: 'Ordered the dry fruit mix for Diwali gifting. Beautiful packaging and premium quality. Highly recommended!',
  },
  {
    id: '3',
    name: 'Anita Desai',
    rating: 4,
    text: 'Love their muesli mix! Great for breakfast and the delivery was super fast. Will order again.',
  },
];

export const instagramPosts = instagramImages;

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

/** When StockInventory has rows, the shop uses them instead of the static list. */
let shopCatalogFromSheet: Product[] | null = null;

export function setShopCatalogFromSheet(list: Product[] | null) {
  shopCatalogFromSheet = list && list.length > 0 ? list : null;
}

export function getShopProducts(): Product[] {
  return shopCatalogFromSheet ?? products;
}

export function inventoryRowToProduct(row: {
  sheetId: string;
  productName: string;
  category: string;
  sellerType?: string;
  mrp: number;
  imagePath: string;
  weight?: string;
  remarks1: string;
  remarks2: string;
  stock: number;
  enabled: boolean;
}): Product {
  const category = normalizeCategorySlug(row.category);
  const sellerType = normalizeSellerType(row.sellerType || '');
  const badge =
    sellerType === 'best-seller' ? 'Best Seller' : sellerType === 'new-arrival' ? 'New Arrival' : undefined;
  return {
    id: `s-${row.sheetId}`,
    name: row.productName,
    category,
    price: row.mrp,
    rating: 4.5,
    reviews: 0,
    image: row.imagePath || productImages.almonds,
    description: row.productName,
    weight: row.weight?.trim() || '',
    badge,
    sellerType,
    listed: row.enabled,
    inStock: row.enabled && row.stock > 0,
  };
}

export function getProductById(id: string): Product | undefined {
  return getShopProducts().find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  const list = getShopProducts();
  if (category === 'all') return list;
  return list.filter((p) => p.category === category);
}

const bestSellerIds = ['11', '12', '13'];
const newArrivalIds = ['14', '15', '16', '17'];

export function getBestSellers(): Product[] {
  const list = getShopProducts();
  if (shopCatalogFromSheet) {
    return list.filter((p) => p.listed !== false && p.sellerType === 'best-seller');
  }
  return bestSellerIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);
}

export function getNewArrivals(): Product[] {
  const list = getShopProducts();
  if (shopCatalogFromSheet) {
    return list.filter((p) => p.listed !== false && p.sellerType === 'new-arrival');
  }
  return newArrivalIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);
}
