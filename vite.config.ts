import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { productImageUploadPlugin } from './vite-plugins/productImageUpload';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const scriptUrl = env.VITE_APPS_SCRIPT_URL;

  return {
    plugins: [react(), productImageUploadPlugin()],
    server: scriptUrl
      ? {
          proxy: {
            '/api': {
              target: scriptUrl,
              changeOrigin: true,
              secure: true,
              rewrite: () => '',
            },
          },
        }
      : undefined,
  };
});
