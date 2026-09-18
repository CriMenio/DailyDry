import { DEFAULT_META_DESCRIPTION } from '../config/site';

export type StaticPageSeo = {
  title: string;
  description?: string;
};

/** Indexable marketing / policy pages (path → meta). */
export const STATIC_PAGE_SEO: Record<string, StaticPageSeo> = {
  '/': {
    title: 'Premium Dry Fruits & Nuts',
    description: DEFAULT_META_DESCRIPTION,
  },
  '/shop': {
    title: 'Shop All Products',
    description:
      'Browse premium almonds, cashews, walnuts, mixes, and more. Fresh stock with pan-India delivery from Daily Dry.',
  },
  '/about': {
    title: 'About Us',
    description:
      'Learn about Daily Dry — our story, quality standards, and commitment to premium dry fruits and nuts.',
  },
  '/contact': {
    title: 'Contact',
    description: 'Get in touch with Daily Dry for orders, bulk enquiries, and customer support.',
  },
  '/bulk-orders': {
    title: 'Bulk Orders',
    description: 'Corporate and bulk dry fruit orders with custom packing and pricing from Daily Dry.',
  },
  '/track-order': {
    title: 'Track Order',
    description: 'Track your Daily Dry order status with your order ID and contact details.',
  },
  '/terms': {
    title: 'Terms & Conditions',
    description: 'Terms and conditions for using dailydry.in and placing orders with Daily Dry.',
  },
  '/privacy': {
    title: 'Privacy Policy',
    description: 'How Daily Dry collects, uses, and protects your personal information.',
  },
  '/shipping-policy': {
    title: 'Shipping Policy',
    description: 'Delivery timelines, shipping charges, and service areas for Daily Dry orders.',
  },
  '/refund-policy': {
    title: 'Refund & Cancellation Policy',
    description: 'Refund, return, and cancellation rules for Daily Dry purchases.',
  },
};

const NO_INDEX_PREFIXES = ['/admin'];
const NO_INDEX_PATHS = new Set([
  '/cart',
  '/wishlist',
  '/checkout',
  '/account',
  '/login',
  '/register',
  '/forgot-password',
]);

export function shouldNoIndex(pathname: string): boolean {
  if (NO_INDEX_PATHS.has(pathname)) return true;
  return NO_INDEX_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function isProductDetailPath(pathname: string): boolean {
  return /^\/product\/[^/]+/.test(pathname);
}
