/**
 * Product images: Google Drive (live + local dev with .env) or public/media/products (offline dev only).
 */
const LOCAL_UPLOAD_URL = '/upload-product-image';

/** Raw file from disk — we compress before upload. */
const MAX_SOURCE_BYTES = 25 * 1024 * 1024;
/** After compression, payload must stay reasonable for JSON + Apps Script. */
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_DIMENSION = 1600;

type UploadPayload = {
  fileName: string;
  mimeType: string;
  data: string;
  adminToken?: string;
};

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

async function parseUploadResponse(res: Response, text: string): Promise<string> {
  let json: { ok?: boolean; path?: string; error?: string };
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error('Upload failed — server returned an invalid response.');
  }
  if (!res.ok || !json.ok || !json.path) {
    throw new Error(json.error || 'Upload failed');
  }
  return json.path;
}

async function uploadViaLocalDisk(payload: UploadPayload): Promise<string> {
  const res = await fetch(LOCAL_UPLOAD_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  return parseUploadResponse(res, text);
}

async function uploadViaAppsScript(payload: UploadPayload): Promise<string> {
  const errors: string[] = [];

  const apiRes = await fetch('/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'uploadProductImage',
      adminToken: payload.adminToken,
      fileName: payload.fileName,
      mimeType: payload.mimeType,
      data: payload.data,
    }),
  });
  const apiText = await apiRes.text();
  try {
    return await parseUploadResponse(apiRes, apiText);
  } catch (err) {
    errors.push(err instanceof Error ? err.message : 'API upload failed');
  }

  const fnRes = await fetch(LOCAL_UPLOAD_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const fnText = await fnRes.text();
  try {
    return await parseUploadResponse(fnRes, fnText);
  } catch (err) {
    errors.push(err instanceof Error ? err.message : 'Upload endpoint failed');
  }

  throw new Error(errors.join(' · '));
}

export async function uploadProductImageFile(file: File): Promise<string> {
  const prepared = await prepareProductImage(file);

  const ext = prepared.name.includes('.') ? prepared.name.slice(prepared.name.lastIndexOf('.')) : '.jpg';
  const safeName = `product-${Date.now()}${ext.replace(/[^a-zA-Z0-9.]/g, '')}`;
  const data = await readFileAsBase64(prepared);
  const adminToken = localStorage.getItem('dailydry-admin-token') || undefined;

  const payload: UploadPayload = {
    fileName: safeName,
    mimeType: prepared.type,
    data,
    adminToken,
  };

  const useCloud =
    Boolean(import.meta.env.VITE_APPS_SCRIPT_URL) || !import.meta.env.DEV;

  if (useCloud) {
    return uploadViaAppsScript(payload);
  }

  try {
    return await uploadViaLocalDisk(payload);
  } catch {
    return uploadViaAppsScript(payload);
  }
}
