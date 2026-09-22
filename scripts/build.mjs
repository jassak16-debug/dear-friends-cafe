/**
 * Static build: renders every page to plain HTML in /dist (fast, SEO-friendly,
 * works with JavaScript off) and copies assets. No dependencies.
 *
 *   npm run build            → dist/
 *   SITE_URL=https://… npm run build   (set in Vercel for production)
 */
import { mkdir, rm, writeFile, readFile, cp, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from '../src/config/site.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const pages = [
  { path: '/', file: 'index.html', module: 'index.js', priority: '1.0' },
  { path: '/menu', file: 'menu.html', module: 'menu.js', priority: '0.9' },
  { path: '/reservations', file: 'reservations.html', module: 'reservations.js', priority: '0.9' },
  { path: '/about', file: 'about.html', module: 'about.js', priority: '0.7' },
  { path: '/gallery', file: 'gallery.html', module: 'gallery.js', priority: '0.6' },
  { path: '/functions', file: 'functions.html', module: 'functions.js', priority: '0.7' },
  { path: '/contact', file: 'contact.html', module: 'contact.js', priority: '0.8' },
  { path: null, file: '404.html', module: 'not-found.js' },
];

// Very small, safe CSS minifier (comments + whitespace only).
const minifyCss = (css) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();

async function build() {
  const started = Date.now();
  await rm(dist, { recursive: true, force: true });
  await mkdir(join(dist, 'assets'), { recursive: true });

  // Static files (images, fonts, favicons).
  await cp(join(root, 'public'), dist, { recursive: true });

  // Styles.
  const css = await readFile(join(root, 'src/styles/main.css'), 'utf8');
  await writeFile(join(dist, 'assets/main.css'), minifyCss(css));

  // Client scripts + the shared validation module they import.
  for (const f of await readdir(join(root, 'src/client'))) {
    await cp(join(root, 'src/client', f), join(dist, 'assets', f));
  }
  await cp(join(root, 'src/lib/validation.js'), join(dist, 'assets/validation.js'));

  // Pages.
  let placeholders = 0;
  for (const page of pages) {
    const { default: render } = await import(join(root, 'src/pages', page.module));
    const out = String(render());
    placeholders += (out.match(/class="placeholder[ "]/g) || []).length;
    await writeFile(join(dist, page.file), out);
  }

  // SEO files.
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages
    .filter((p) => p.path)
    .map((p) => `  <url><loc>${site.url}${p.path === '/' ? '/' : p.path}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority></url>`)
    .join('\n');
  if (site.url) await writeFile(
    join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  await writeFile(
    join(dist, 'robots.txt'),
    site.noindex
      ? 'User-agent: *\nDisallow: /\n'
      : `User-agent: *\nAllow: /\nDisallow: /api/\n${site.url ? `\nSitemap: ${site.url}/sitemap.xml\n` : ''}`,
  );

  console.log(`✓ Built ${pages.length} pages to dist/ in ${Date.now() - started}ms`);
  if (!process.env.SITE_URL) console.warn(`! SITE_URL is not set: ${site.url ? `using ${site.url}` : 'no public address known, so sitemap.xml and absolute URLs are omitted'}; site is noindex.`);
  if (!site.onlineRequests) console.warn('! Online booking is OFF (demo mode): forms show "please call" and nothing is stored.');
  console.log(site.showPlaceholders ? `! ${placeholders} placeholder block(s) visible (SHOW_PLACEHOLDERS=true).` : '✓ Placeholders hidden.');
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
