const LOCAL_PRODUCT_PREFIX = '/media/products/';

/** Normalize image paths from StockInventory for <img src>. */
export function resolveProductImagePath(raw: string | undefined | null): string {
  const path = String(raw || '').trim();
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;

  let local = path.startsWith('/') ? path : `/${path}`;
  const fileName = local.split('/').pop() || '';
  if (local.startsWith(LOCAL_PRODUCT_PREFIX) && fileName && !/\.[a-z0-9]{2,5}$/i.test(fileName)) {
    local = `${local}.jpg`;
  }
  return local;
}
