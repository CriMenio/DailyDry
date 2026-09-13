/**
 * Product image upload (local dev → public/media/products; production → Apps Script / Drive).
 */
const UPLOAD_URL = '/upload-product-image';

/** Raw file from disk — we compress before upload. */
const MAX_SOURCE_BYTES = 25 * 1024 * 1024;
/** After compression, payload must stay reasonable for JSON + Apps Script. */
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_DIMENSION = 1600;

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

function formatMb(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read image'));
    };
    img.src = url;
  });
}

async function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Resize large photos so uploads succeed and shop assets stay lightweight.
 */
async function prepareProductImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file (PNG, JPG, WebP)');
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error(`Image is too large (${formatMb(file.size)} MB). Use a file under ${formatMb(MAX_SOURCE_BYTES)} MB.`);
  }

  if (file.type === 'image/gif') {
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new Error(`GIF must be ${formatMb(MAX_UPLOAD_BYTES)} MB or smaller (yours is ${formatMb(file.size)} MB).`);
    }
    return file;
  }

  if (file.size <= MAX_UPLOAD_BYTES) {
    try {
      const img = await loadImageFromFile(file);
      if (Math.max(img.naturalWidth, img.naturalHeight) <= MAX_DIMENSION) {
        return file;
      }
    } catch {
      return file;
    }
  }

  const img = await loadImageFromFile(file);
  let width = img.naturalWidth;
  let height = img.naturalHeight;
  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
  width = Math.max(1, Math.round(width * scale));
  height = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not process image in this browser');
  }
  ctx.drawImage(img, 0, 0, width, height);

  const preferWebp = file.type === 'image/png' || file.type === 'image/webp';
  let mime = preferWebp ? 'image/webp' : 'image/jpeg';
  let quality = 0.88;
  let blob: Blob | null = null;

  for (let attempt = 0; attempt < 6; attempt++) {
    blob = await canvasToBlob(canvas, mime, quality);
    if (!blob) break;
    if (blob.size <= MAX_UPLOAD_BYTES) break;
    quality -= 0.12;
    if (quality < 0.45 && mime === 'image/webp') {
      mime = 'image/jpeg';
      quality = 0.85;
    }
  }

  if (!blob) {
    throw new Error('Could not compress image — try a JPG or smaller file.');
  }
  if (blob.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `Image is still too large after resize (${formatMb(blob.size)} MB). Try a smaller photo or crop it.`
    );
  }

  const ext = mime === 'image/webp' ? '.webp' : '.jpg';
  const stem = file.name.replace(/\.[^.]+$/, '') || 'product';
  return new File([blob], `${stem}${ext}`, { type: mime });
}

export async function uploadProductImageFile(file: File): Promise<string> {
  const prepared = await prepareProductImage(file);

  const ext = prepared.name.includes('.') ? prepared.name.slice(prepared.name.lastIndexOf('.')) : '.jpg';
  const safeName = `product-${Date.now()}${ext.replace(/[^a-zA-Z0-9.]/g, '')}`;
  const data = await readFileAsBase64(prepared);
  const adminToken = localStorage.getItem('dailydry-admin-token');

  const res = await fetch(UPLOAD_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: safeName,
      mimeType: prepared.type,
      data,
      adminToken: adminToken || undefined,
    }),
  });

  const text = await res.text();
  let json: { ok?: boolean; path?: string; error?: string };
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error('Upload failed. Restart npm run dev and try again.');
  }

  if (!res.ok || !json.ok || !json.path) {
    throw new Error(json.error || 'Upload failed');
  }

  return json.path;
}
