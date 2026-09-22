/**
 * Local preview: builds the site, serves dist/ with clean URLs, and runs the
 * /api functions exactly as Vercel would. No dependencies.
 *
 *   npm run dev   → http://localhost:3000
 *
 * Without SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY the API answers 503 and the
 * forms show the "please call us" message. Put them in .env.local to test storage.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envFile = join(root, '.env.local');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

execFileSync(process.execPath, [join(root, 'scripts/build.mjs')], { stdio: 'inherit', env: process.env });

const dist = join(root, 'dist');
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json',
};

async function tryFile(p) {
  try { return (await stat(p)).isFile() ? p : null; } catch { return null; }
}

const port = Number(process.env.PORT) || 3000;
createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith('/api/')) {
    const name = url.pathname.slice(5).replace(/[^a-z-]/g, '');
    const file = join(root, 'api', `${name}.js`);
    if (!existsSync(file)) { res.statusCode = 404; return res.end('Not found'); }
    const { default: handler } = await import(pathToFileURL(file).href);
    return handler(req, res);
  }
  const clean = decodeURIComponent(url.pathname).replace(/\.\.+/g, '');
  const file =
    (await tryFile(join(dist, clean))) ||
    (await tryFile(join(dist, `${clean}.html`))) ||
    (await tryFile(join(dist, clean, 'index.html')));
  if (!file) {
    res.statusCode = 404;
    res.setHeader('Content-Type', types['.html']);
    return res.end(await readFile(join(dist, '404.html')));
  }
  res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
  res.end(await readFile(file));
}).listen(port, () => console.log(`→ http://localhost:${port}`));
