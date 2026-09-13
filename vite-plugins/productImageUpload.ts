import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

const UPLOAD_ROUTE = '/upload-product-image';

/** Dev only: save admin product images to public/media/products */
export function productImageUploadPlugin(): Plugin {
  return {
    name: 'product-image-upload',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url !== UPLOAD_ROUTE || req.method !== 'POST') {
          next();
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const payload = JSON.parse(body) as {
              fileName?: string;
              mimeType?: string;
              data?: string;
            };
            if (!payload.data || !payload.fileName) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: false, error: 'Missing file data' }));
              return;
            }

            const safeName = payload.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
            const dir = path.join(process.cwd(), 'public', 'media', 'products');
            fs.mkdirSync(dir, { recursive: true });
            const filePath = path.join(dir, safeName);
            fs.writeFileSync(filePath, Buffer.from(payload.data, 'base64'));

            const publicPath = `/media/products/${safeName}`;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true, path: publicPath }));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({ ok: false, error: err instanceof Error ? err.message : 'Upload failed' })
            );
          }
        });
      });
    },
  };
}
