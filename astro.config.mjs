// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import fs from 'node:fs';
import path from 'node:path';

// Read content frontmatter dates so the sitemap gets lastmod values
function buildDateMap() {
  const dateMap = {};
  const contentDir = './src/content';
  const sections = ['astrophotography', 'projects', 'claudes-corner', 'field-notes', 'workshop'];

  for (const section of sections) {
    const dir = path.join(contentDir, section);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
      const content = fs.readFileSync(path.join(dir, file), 'utf-8');
      const match = content.match(/^date:\s*(.+)$/m);
      if (match) {
        const slug = file.replace(/\.(md|mdx)$/, '');
        dateMap[`https://peonic.net/${section}/${slug}/`] = new Date(match[1].trim());
      }
    }
  }
  return dateMap;
}

const dateMap = buildDateMap();

export default defineConfig({
  site: 'https://peonic.net',
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        if (dateMap[item.url]) {
          item.lastmod = dateMap[item.url];
        }
        return item;
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    server: { allowedHosts: ['brain.lan', 'localhost', '192.168.68.5'] },
  },

  image: {
    // Sharp handles AVIF/WebP generation
    service: { entrypoint: 'astro/assets/services/sharp' },
  },

  adapter: cloudflare(),
});