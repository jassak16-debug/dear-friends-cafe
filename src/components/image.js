import { html } from '../lib/html.js';
import images from '../data/images.json' with { type: 'json' };

/**
 * Responsive <img> with srcset, intrinsic size (prevents layout shift)
 * and lazy loading by default.
 *
 * @param {{src: string, alt: string}} photo  base name in /public/images + alt text
 * @param {object} opts
 * @param {string} [opts.sizes]   CSS sizes attribute
 * @param {boolean} [opts.eager]  load immediately (use for the hero only)
 * @param {string} [opts.className]
 */
export function picture(photo, { sizes = '100vw', eager = false, className = '' } = {}) {
  const meta = images[photo.src];
  if (!meta) throw new Error(`No image set for "${photo.src}". Add it to src/data/images.json.`);
  const srcset = meta.widths.map((w) => `/images/${photo.src}-${w}.webp ${w}w`).join(', ');
  const fallbackW = meta.widths.find((w) => w >= 800) ?? meta.widths.at(-1);
  return html`<img class="${className}" src="/images/${photo.src}-${fallbackW}.webp" srcset="${srcset}" sizes="${sizes}" width="${meta.width}" height="${meta.height}" alt="${photo.alt}" ${eager ? html`fetchpriority="high"` : html`loading="lazy"`} decoding="async">`;
}
