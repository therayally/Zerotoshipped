import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Built straight into the website; `app/` keeps bundles apart from the admin panel's `assets/`.
  build: { chunkSizeWarningLimit: 900, assetsDir: 'app', assetsInlineLimit: 0 },
});
