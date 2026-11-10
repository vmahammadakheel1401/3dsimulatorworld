import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'maplibre-worker-handler',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = (req.url || '').split('?')[0];
          if (url === '/maplibre-gl-worker.mjs' || url.endsWith('/maplibre-gl-worker.mjs')) {
            const workerPath = path.resolve('node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs');
            if (fs.existsSync(workerPath)) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
              res.setHeader('Access-Control-Allow-Origin', '*');
              fs.createReadStream(workerPath).pipe(res);
              return;
            }
          }
          next();
        });
      },
      async closeBundle() {
        const outDir = path.resolve('dist');
        if (!fs.existsSync(outDir)) return;
        const workerSrc = path.resolve('node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs');
        if (fs.existsSync(workerSrc)) {
          fs.copyFileSync(workerSrc, path.join(outDir, 'maplibre-gl-worker.mjs'));
        }
        if (fs.existsSync('renders')) {
          fs.cpSync('renders', path.join(outDir, 'renders'), { recursive: true });
        }
        if (fs.existsSync('src/assets')) {
          fs.cpSync('src/assets', path.join(outDir, 'src/assets'), { recursive: true });
        }
      },
    },
  ],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
