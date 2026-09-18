export const SITE_ORIGIN = 'https://dailydry.in';

export const SITE_NAME = 'Daily Dry';

export const DEFAULT_META_DESCRIPTION =
  'Daily Dry — premium dry fruits and nuts, carefully packed and delivered across India.';

export function canonicalUrl(pathname: string): string {
  let path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  return path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
}
