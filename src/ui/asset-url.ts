/// <reference types="vite/client" />

/**
 * Resolves a path from `public/` against the deployment base URL so the build
 * works from a subdirectory (GitHub Pages project site, itch.io) as well as
 * from the domain root.
 */
export const assetUrl = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.startsWith('/') ? path.slice(1) : path}`;
