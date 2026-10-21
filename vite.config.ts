import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

function apiDevMiddleware(): Plugin {
  const handler = async (req: any, res: any, next: any) => {
    if (req.url?.startsWith('/api/tutor')) {
      let body = '';
      req.on('data', (chunk: any) => {
        body += chunk;
      });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
        } catch {
          req.body = {};
        }
        res.status = (code: number) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data: any) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };
        const tutor = await import('./api/tutor');
        await tutor.default(req, res);
      });
      return;
    }

    if (req.url?.startsWith('/api/compile')) {
      let body = '';
      req.on('data', (chunk: any) => {
        body += chunk;
      });
      req.on('end', async () => {
        try {
          req.body = body ? JSON.parse(body) : {};
        } catch {
          req.body = {};
        }
        res.status = (code: number) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data: any) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };
        const compile = await import('./api/compile');
        await compile.default(req, res);
      });
      return;
    }

    next();
  };

  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    apiDevMiddleware(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'Learn Arduino Pro',
        short_name: 'ArduinoPro',
        description: 'Advanced interactive Arduino learning platform and in-browser simulator',
        theme_color: '#16B8B0',
        background_color: '#FAF8F5',
        display: 'standalone',
        orientation: 'landscape-primary',
        icons: [
          {
            src: '/favicon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,svg,png,wasm}']
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: ['avr8js', 'three', '@react-three/fiber', '@react-three/drei']
  }
});
