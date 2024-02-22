import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import lighthouse from "astro-lighthouse";

// https://astro.build/config
export default defineConfig({
  site: 'https://spinline.xyz',
  integrations: [mdx(), sitemap(), lighthouse()]
});