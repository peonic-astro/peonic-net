// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://peonic.net',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    server: { allowedHosts: ['brain.lan', 'localhost', '192.168.68.5'] },
  },
  image: {
    // Sharp handles AVIF/WebP generation
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
