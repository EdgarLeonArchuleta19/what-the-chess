import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Serves the untouched 2019 `mipagina/` directory during development
 * and copies it into `dist/mipagina/` during build so the original files
 * never have to be moved or modified in the repository.
 */
function preserveMiPaginaPlugin(): Plugin {
  const miPaginaDir = path.resolve(__dirname, 'mipagina');

  const mimeTypes: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.mp4': 'video/mp4',
  };

  return {
    name: 'preserve-mipagina-easter-egg',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();
        const cleanUrl = req.url.split('?')[0];
        const matchIdx = cleanUrl.indexOf('/mipagina/');
        if (matchIdx === -1 && !cleanUrl.endsWith('/mipagina')) {
          return next();
        }
        const subPath = cleanUrl.endsWith('/mipagina')
          ? 'index.html'
          : cleanUrl.slice(matchIdx + '/mipagina/'.length) || 'index.html';

        const filePath = path.join(miPaginaDir, decodeURIComponent(subPath));
        if (!filePath.startsWith(miPaginaDir)) {
          return next();
        }

        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
          fs.createReadStream(filePath).pipe(res);
          return;
        }
        next();
      });
    },
    closeBundle() {
      const destDir = path.resolve(__dirname, 'dist', 'mipagina');
      if (fs.existsSync(miPaginaDir)) {
        fs.mkdirSync(destDir, { recursive: true });
        for (const entry of fs.readdirSync(miPaginaDir)) {
          const srcFile = path.join(miPaginaDir, entry);
          const destFile = path.join(destDir, entry);
          if (fs.statSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, destFile);
          }
        }
      }
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), preserveMiPaginaPlugin()],
});
