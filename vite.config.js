import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  // Vite's SPA fallback otherwise serves the Home for the slashless URL.
  // Static hosts can serve dist/catalogo/index.html as a directory index.
  plugins: [{
    name: 'catalog-directory-route',
    configureServer(server) { server.middlewares.use(catalogRoute); },
    configurePreviewServer(server) { server.middlewares.use(catalogRoute); },
  }],
  build: {
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        catalog: fileURLToPath(new URL('./catalogo/index.html', import.meta.url)),
      },
    },
  },
});

function catalogRoute(request, response, next) {
  const url = new URL(request.url, 'http://localhost');
  if (url.pathname === '/catalogo' || url.pathname === '/catalogo/') {
    request.url = `/catalogo/index.html${url.search}`;
  }
  next();
}
