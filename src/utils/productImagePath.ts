const LOCAL_PRODUCT_PREFIX = '/media/products/';

/** Pull Google Drive file id from common share / uc URLs. */
export function extractGoogleDriveFileId(url: string): string | null {
  const trimmed = url.trim();
  const patterns = [
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
    /\/open\?id=([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

/** Use thumbnail endpoint — reliable in <img> on shop + admin preview. */
export function googleDriveImageUrl(fileId: string, size = 1600): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}

/** Normalize image paths from StockInventory for <img src>. */
export function resolveProductImagePath(raw: string | undefined | null): string {
  const path = String(raw || '').trim();
  if (!path) return '';

  if (/^https?:\/\//i.test(path)) {
    const driveId = extractGoogleDriveFileId(path);
    if (driveId) return googleDriveImageUrl(driveId);
    return path;
  }

  let local = path.startsWith('/') ? path : `/${path}`;
  const fileName = local.split('/').pop() || '';
  if (local.startsWith(LOCAL_PRODUCT_PREFIX) && fileName && !/\.[a-z0-9]{2,5}$/i.test(fileName)) {
    local = `${local}.jpg`;
  }
  return local;
}
