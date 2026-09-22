import { html, raw } from '../lib/html.js';
import { site, nav } from '../config/site.js';
import { icons } from './icons.js';
import { addressBlock, callLink } from './ui.js';

/** schema.org CafeOrCoffeeShop — helps Google show hours, address and phone. */
export function localBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: site.name,
    telephone: site.phone.e164,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.suburb,
      addressRegion: site.address.region,
      postalCode: site.address.postcode,
      addressCountry: site.address.country,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: site.hours.days,
        opens: site.hours.open,
        closes: site.hours.close,
      },
    ],
    servesCuisine: ['Cafe', 'Breakfast', 'Brunch', 'Coffee'],
    acceptsReservations: 'True',
    sameAs: [site.instagram.url],
  };
  if (site.url) {
    Object.assign(data, {
      '@id': `${site.url}/#cafe`,
      url: `${site.url}/`,
      image: [`${site.url}/images/og-dear-friends.jpg`],
      logo: `${site.url}/images/logo-roundel-512.png`,
      hasMenu: `${site.url}/menu`,
    });
  }
  if (site.geo) data.geo = { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng };
  if (site.email) data.email = site.email;
  // JSON in a script tag: escape "<" so the content can never close the tag early.
  return raw(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);
}

function header(path) {
  const link = (item) =>
    html`<li><a href="${item.href}" ${path === item.href ? raw('aria-current="page"') : ''}>${item.label}</a></li>`;
  return html`<header class="site-header" data-header>
  <div class="site-header__inner wrap">
    <a class="brand" href="/" aria-label="${site.shortName}, home">
      <img class="brand__mark" src="/images/logo-roundel-96.png" srcset="/images/logo-roundel-96.png 1x, /images/logo-roundel-192.png 2x" width="44" height="44" alt="">
      <span class="brand__name">${site.shortName}</span>
    </a>
    <nav class="site-nav" aria-label="Main">
      <ul class="site-nav__list" id="site-nav-list">${nav.map(link)}</ul>
    </nav>
    <div class="site-header__actions">
      <a class="btn btn--light btn--small site-header__book" href="/reservations" ${path === '/reservations' ? raw('aria-current="page"') : ''}>Book a table</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav-list" data-nav-toggle>
        <span class="nav-toggle__open">${icons.menu}<span class="visually-hidden">Open menu</span></span>
        <span class="nav-toggle__close">${icons.close}<span class="visually-hidden">Close menu</span></span>
      </button>
    </div>
  </div>
</header>`;
}

function footer() {
  const year = new Date().getFullYear();
  return html`<footer class="site-footer">
  <div class="wrap site-footer__grid">
    <div class="site-footer__brand">
      <img src="/images/logo-roundel-192.png" width="96" height="96" alt="${site.name} logo" loading="lazy">
      <p class="site-footer__tagline">${site.tagline}</p>
    </div>
    <div>
      <h2 class="site-footer__heading">Find us</h2>
      ${addressBlock()}
      <p><a href="${site.maps.directionsUrl}" rel="noopener" target="_blank">Get directions<span class="visually-hidden"> (opens Google Maps)</span></a></p>
    </div>
    <div>
      <h2 class="site-footer__heading">Open</h2>
      <p>${site.hours.summary}<br>${site.hours.display}</p>
      <p><a href="tel:${site.phone.e164}">${site.phone.display}</a></p>
      ${site.email ? html`<p><a href="mailto:${site.email}">${site.email}</a></p>` : ''}
    </div>
    <div>
      <h2 class="site-footer__heading">Explore</h2>
      <ul class="site-footer__links">
        ${nav.filter((n) => n.href !== '/').map((n) => html`<li><a href="${n.href}">${n.label}</a></li>`)}
        <li><a href="/reservations">Reservations</a></li>
        <li><a href="${site.instagram.url}" rel="noopener" target="_blank">Instagram ${site.instagram.handle}</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap site-footer__base">
    <p>© ${year} ${site.name}, Milford, Auckland</p>
  </div>
</footer>`;
}

/** Sticky call / book bar shown on small screens only. */
function mobileBar(path) {
  if (path === '/reservations') return '';
  return html`<div class="mobile-bar" aria-label="Quick actions">
  ${callLink('mobile-bar__call', 'Call')}
  <a class="mobile-bar__book" href="/reservations">${icons.calendar}<span>Book a table</span></a>
</div>`;
}

/**
 * Full HTML document.
 * @param {object} p
 * @param {string} p.path       URL path, e.g. '/menu'
 * @param {string} p.title      page-specific title (site name is appended)
 * @param {string} p.description meta description (aim for 120–160 characters)
 * @param {*} p.body            page markup
 * @param {string[]} [p.scripts] extra client modules to load
 * @param {string} [p.bodyClass]
 * @param {boolean} [p.noindex]   keep the page out of search results
 */
export function layout({ path, title, description, body, scripts = [], bodyClass = '', noindex = false }) {
  const fullTitle = path === '/' ? `${site.name} | Café in Milford, Auckland` : `${title} | ${site.name}, Milford`;
  const canonical = site.url ? `${site.url}${path === '/' ? '/' : path}` : null;
  const ogImage = `${site.url ?? ''}/images/og-dear-friends.jpg`;
  return html`<!doctype html>
<html lang="en-NZ">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${fullTitle}</title>
<meta name="description" content="${description}">
${noindex || site.noindex ? raw('<meta name="robots" content="noindex">') : ''}
${canonical ? html`<link rel="canonical" href="${canonical}">` : ''}
<meta name="theme-color" content="#23272d">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${description}">
${canonical ? html`<meta property="og:url" content="${canonical}">` : ''}
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_NZ">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/fonts/Gloock-Regular.woff" as="font" type="font/woff" crossorigin>
<link rel="preload" href="/fonts/InstrumentSans-Regular.woff" as="font" type="font/woff" crossorigin>
<link rel="stylesheet" href="/assets/main.css">
${localBusinessJsonLd()}
</head>
<body class="${bodyClass}">
<a class="skip-link" href="#main">Skip to content</a>
${header(path)}
<main id="main">
${body}
</main>
${footer()}
${mobileBar(path)}
<script type="module" src="/assets/main.js"></script>
${scripts.map((s) => html`<script type="module" src="/assets/${s}"></script>`)}
</body>
</html>`;
}
