import { defineConfig } from 'vite';

// `base: './'` keeps every emitted asset reference relative, so the same build
// runs at a domain root and under a subpath (GitHub Pages project site,
// itch.io HTML upload) without a rebuild.
export default defineConfig({
  base: './',
});
