/**
 * Single source of truth for business details.
 * Everything on the site (pages, footer, structured data, forms) reads from here,
 * so a change made once is reflected everywhere.
 *
 * Values marked `TODO(owner)` are assumptions or placeholders that the café
 * needs to confirm before launch. See README.md › "Before going live".
 */

export const site = {
  name: 'Dear Friends Coffee Bar & Eatery',
  shortName: 'Dear Friends',
  tagline: 'Good food, great coffee and a place to catch up.',

  // Set SITE_URL in Vercel (e.g. https://www.yourdomain.co.nz). Used for canonical
  // URLs, Open Graph tags and sitemap.xml. On Vercel without SITE_URL, the
  // project's own vercel.app address is used. TODO(owner): confirm the domain.
  // null when no address is known (e.g. a local build): absolute-URL tags and
  // sitemap.xml are then left out rather than pointing at a made-up domain.
  url:
    (
      process.env.SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
      ''
    ).replace(/\/$/, '') || null,

  // Keep search engines out until the site has its real domain (demo / preview),
  // or when NOINDEX=true is set explicitly.
  noindex: process.env.NOINDEX === 'true' || !process.env.SITE_URL,

  // Online booking/enquiry requests are OFF unless BOTH are true:
  //   ONLINE_BOOKINGS=true  (deliberate switch)  AND  Supabase is configured.
  // While off: nothing is stored, the forms show "Online booking isn't live yet"
  // and submitting never shows a confirmation. Must match api/_lib/supabase.js.
  onlineRequests:
    process.env.ONLINE_BOOKINGS === 'true' &&
    Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),

  address: {
    street: '132 Kitchener Road',
    suburb: 'Milford',
    city: 'Auckland',
    postcode: '0620',
    region: 'Auckland',
    country: 'NZ',
    countryName: 'New Zealand',
  },

  // Exact coordinates improve local SEO. Left empty rather than guessed.
  // TODO(owner): copy from the café's Google Business Profile, e.g. { lat: -36.77, lng: 174.76 }
  geo: null,

  phone: {
    display: '021 885 361',
    e164: '+6421885361',
  },
  // Confirmed by the client as the customer contact number for the website.

  email: null, // TODO(owner): add a public contact email, e.g. 'hello@yourdomain.co.nz'

  // Verified Google Business Profile link (e.g. the "Ask for reviews" link from
  // the profile dashboard). Left empty until the café supplies it; the reviews
  // call-to-action shows as plain text until then. Never guess this URL.
  googleBusinessUrl: null,

  instagram: {
    handle: '@dearfriendsmilford',
    url: 'https://www.instagram.com/dearfriendsmilford/',
  },

  // Google Maps links that work without an API key.
  maps: {
    query: 'Dear Friends Coffee Bar & Eatery, 132 Kitchener Road, Milford, Auckland 0620',
    get directionsUrl() {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(this.query)}`;
    },
    get placeUrl() {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.query)}`;
    },
    get embedUrl() {
      return `https://www.google.com/maps?q=${encodeURIComponent(this.query)}&output=embed`;
    },
  },

  hours: {
    summary: 'Monday–Sunday',
    open: '06:00',
    close: '16:00',
    display: '6:00am–4:00pm',
    // schema.org format
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    // TODO(owner): public holiday hours, if different.
  },

  booking: {
    // TODO(owner): confirm all of these with the café.
    firstTime: '07:00', // earliest bookable time
    lastTime: '14:30', // latest bookable time (kitchen needs time before 4pm close)
    intervalMinutes: 30,
    maxGuests: 10, // larger groups are directed to the functions enquiry
    maxDaysAhead: 60,
  },

  // Off by default, so demos and the live site look finished.
  // Set SHOW_PLACEHOLDERS=true to see yellow boxes marking where client
  // content (reviews, photos, story, function details) is still missing.
  showPlaceholders: process.env.SHOW_PLACEHOLDERS === 'true',
};

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/functions', label: 'Functions' },
  { href: '/contact', label: 'Contact' },
];
