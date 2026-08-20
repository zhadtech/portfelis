// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

// Read PUBLIC_* from .env files and from the real environment (CI sets them as
// repository variables). Astro's own `import.meta.env` is not available this early.
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'PUBLIC_');

// https://astro.build/config
export default defineConfig({
  output: 'static',

  // Deployed as a GitHub Pages *project* site, so everything lives under a base path.
  // Never hardcode these anywhere else — internal links go through src/lib/paths.ts.
  site: env.PUBLIC_SITE_URL || 'https://example.github.io',
  base: env.PUBLIC_BASE_PATH || '/portfelis',

  markdown: {
    shikiConfig: {
      // Light-only theme, deliberately low-contrast so code blocks sit quietly in the page.
      theme: 'min-light',
      wrap: true,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
