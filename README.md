# Dear Friends Coffee Bar & Eatery: website

Website for **Dear Friends Coffee Bar & Eatery**, 132 Kitchener Road, Milford, Auckland 0620, New Zealand.
Phone 021 885 361, open Monday–Sunday, 6:00am–4:00pm.

It's a static site with two small server functions for form submissions. It has no framework and no npm dependencies. It needs Node.js 20+ and deploys to Vercel.

> ## ⚠️ Online booking is NOT live
> This is a **client demo**. The Reservations and Functions forms can be tried, but **nothing is stored, nothing is booked and nothing is confirmed.**
> Both pages tell visitors: *"Online booking isn't live yet. To book a table, please call 021 885 361."*
> Turning real bookings on needs Supabase **and** a deliberate switch (`ONLINE_BOOKINGS=true`), plus the work listed in sections C and E.

## Quick start

```bash
node -v          # 20 or later; nothing else to install
npm run dev      # build + local server with /api on http://localhost:3000
npm run build    # production build into dist/
npm test         # 15 automated tests (booking rules, API, demo-mode safety)
```

---

## A. Already working

- **Pages:** Home, Menu, About, Gallery, Functions, Reservations, Contact and 404.
- **Responsive layout:** tested at 320, 375, 430, 768, 1024 and 1440px, with no horizontal scrolling.
- **Navigation:** header nav, keyboard-accessible mobile menu, skip link, and a mobile **Call / Book a table** bar.
- **Menu:** the full menu transcribed from the café's printed menus (5 food and 7 drink categories), with sticky category navigation, a dietary key and the allergen note.
- **Reviews:** three genuine Google reviews (Zoe Hiini, Iain Guthrie, Andrea Williams), reproduced word for word, labelled "Google review", with no star ratings.
- **Phone:** every call link is `tel:+6421885361` (021 885 361). The old landline appears nowhere in the project.
- **Links:** Google Maps directions and "open in Maps" links, the Instagram link (@dearfriendsmilford) and the gallery lightbox.
- **Validation:** forms are checked in the browser and on the server with the same rules (Auckland time zone).
- **SEO:**
  - Titles, descriptions and Open Graph tags.
  - `CafeOrCoffeeShop` structured data with the address, phone, hours and Instagram. Reviews are deliberately not in the structured data, since Google disallows self-published review markup.
  - `robots.txt`, and `sitemap.xml` generated at build time when a web address is known.
- **Performance:** responsive WebP images, self-hosted fonts and no third-party scripts.
- **Accessibility:** WCAG AA contrast, visible focus rings and reduced-motion support.
- **Privacy:** faces of passers-by and diners in the storefront photo are softened, and the photo of identifiable customers was removed.

## B. Demo-only

- **Booking and enquiry forms:** they run in fallback mode. Submitting shows "Online booking isn't live yet… Nothing has been booked. Please call 021 885 361." The details stay in the form.
- **Search engines are kept out:** pages are `noindex` and `robots.txt` disallows everything until `SITE_URL` is set.
- **Missing client content is hidden, not faked** (story, function details, more photos). To review the gaps, run with `SHOW_PLACEHOLDERS=true` and yellow boxes mark each one.
- **Reviews call to action:** "Been in to see us? Read more reviews or share your experience on Google." It's plain text for now, because no verified Google Business Profile link has been supplied. It becomes a link automatically once `googleBusinessUrl` is set (section K).
- **Google Maps embed:** built with the standard key-free embed URL. It could not be viewed in the offline test environment, so check it on the first deploy.

## C. Requires Supabase (or a booking provider)

- **Storing requests:** the code and database schema are ready; see G and H.
- **Notifying the café of new requests: NOT BUILT.** Without this, staff would have to check the Supabase dashboard.
- **Confirming bookings with guests: NOT BUILT.** Requests are saved as `requested`. Staff confirm manually, and no automatic confirmation email is sent.
- **Availability:** there is no table-capacity checking. It's a request model, not real-time availability.
- **Rate limiting:** only a honeypot and validation. Add Vercel Firewall rules if spam appears.

## D. Requires client information

| Needed | Where it goes |
|---|---|
| Verified Google Business Profile link (e.g. its "Ask for reviews" link) | `src/config/site.js` → `googleBusinessUrl` |
| High-resolution / vector logo (current one is 418px) | `public/images/logo-roundel-*.png`, favicons |
| Interior photos; larger food and drink photos (supplied ones are 386–864px) | see J |
| Written permission for all photos, including any from listing/review sites | n/a |
| Permission to quote the three reviewers (Google reviews are public, but confirming is good practice) | n/a |
| Café story (who runs it, since when) | `src/pages/about.js` |
| Booking rules: times (assumed 7:00am–2:30pm), max party (assumed 10), days ahead (assumed 60) | `src/config/site.js` → `booking` |
| How guests are told their booking is confirmed | `src/client/forms.js` → `reservationSuccess` |
| Public holiday hours, public email address, domain, map pin | `src/config/site.js` |
| Function details (capacity, minimum spend, packages), only if offered | `src/pages/functions.js` |
| Privacy statement (see E) | new page |

## E. Must be completed before production

1. **Domain:** connect it in Vercel and set `SITE_URL`. This also lifts `noindex`.
2. **Online booking:** complete section L, including café notifications. Otherwise, launch deliberately in "please call" mode.
3. **Privacy statement:** the forms collect names, phone numbers and emails, so a statement is required under the NZ Privacy Act 2020.
4. **Photo and review permissions:** confirm them.
5. **Content:** supply the section D items. Check with `SHOW_PLACEHOLDERS=true`.
6. **Google Business Profile:** make sure it shows 021 885 361. The physical shop sign still shows an older landline.
7. **Checks on the live URL:** map embed, social preview and Google's Rich Results Test.

---

## F. Deploy to Vercel

1. Push this folder to a Git repository (e.g. GitHub).
2. In Vercel, choose **Add New → Project**, import the repo and use the **Other** preset. The build command (`npm run build`), output (`dist`) and `api/` functions come from `vercel.json`.
3. **Demo:** deploy with **no environment variables**. The site uses the project's `vercel.app` address automatically, generates `sitemap.xml`, and stays `noindex` with bookings off.
4. **Launch:** add `SITE_URL=https://your-real-domain` and connect the domain under Settings → Domains.

| Variable | Default | Purpose |
|---|---|---|
| `SITE_URL` | unset | Real public URL. While unset, the site is `noindex` |
| `NOINDEX` | unset | `true` forces `noindex`, e.g. on a staging domain |
| `SHOW_PLACEHOLDERS` | off | `true` shows yellow boxes where client content is missing |
| `ONLINE_BOOKINGS` | off | Must be `true` (together with the Supabase keys) before any request is stored |
| `SUPABASE_URL` | unset | `https://<project-ref>.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | unset | Server-only secret. Never expose it to the browser |
| `ALLOWED_ORIGIN` | unset | Optional: only accept form posts from this origin |

For local testing, copy `.env.example` to `.env.local`. `npm run dev` reads it.

## G. Supabase setup

1. Create a project at supabase.com in the **Sydney** region.
2. Open **SQL Editor**, paste in `supabase/schema.sql` and run it. This creates `reservations` and `function_enquiries` with Row Level Security on and no public access.
3. Under **Project Settings → API**, copy the Project URL and the `service_role` key.
4. Add them in Vercel as `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. **This alone does not turn bookings on**; see L.

## H. Booking system setup

- **How it works:** the form posts to `/api/reservations` (enquiries go to `/api/enquiries`). The server re-validates, then inserts a row with `status = 'requested'`.
- **Status flow:** `requested` → `confirmed` / `declined` → `completed` / `cancelled` / `no-show`. The website only ever creates `requested`, and staff move rows on in Supabase → Table Editor.
- **What the guest sees:** "Booking request sent. It isn't confirmed yet. We'll contact you… to confirm." This is never presented as a confirmed booking.
- **Café notifications (required before going live):**
  - **Simplest:** a Supabase Database Webhook on `reservations` inserts, sent to Zapier/Make and then on as email or SMS to the café.
  - **In code:** send an email (e.g. with Resend) in `api/reservations.js` at the `TODO(next step)` comment.
- **Using a booking provider instead** (ResDiary, Tock, etc.): replace the form in `src/pages/reservations.js` with the provider's widget or link, and allow its domain in the Content Security Policy in `vercel.json`.

## I. Update menu items

Everything is in **`src/data/menu.js`**, transcribed from the printed menus.

- `foodMenu` and `drinksMenu` list the categories in page order.
- Item fields: `name`, `price` (as printed, e.g. `'29.5'`), `description`, `tags` (`[{ code: 'GFI', optional: true }]`), `variants`, `extras` and `halfPrice`.
- Sized drinks use `layout: 'sized'` with `prices` matching `sizes`.
- The home page features some dishes by exact name (`src/pages/index.js`). If you rename an item, update it there too. The build stops with a clear error if a name doesn't match.

Commit and push; Vercel rebuilds.

## J. Replace photos

1. Export WebP files at a few widths, e.g. `interior-480.webp`, `interior-800.webp` and `interior-1600.webp`. Never upscale.
2. Put them in `public/images/`.
3. Register the set in `src/data/images.json`: `"interior": { "width": 1600, "height": 1200, "widths": [480, 800, 1600] }`.
4. Use it in `src/data/gallery.js` with alt text describing what's actually shown, and add it to `galleryOrder` if it belongs in the gallery.

**Rules:**
- Only name a menu item in a caption if the photo really is that dish.
- Don't publish identifiable customers without permission (soften faces as was done for `hero-storefront`).
- The pancake photo isn't on the current menu, so don't label it as one.

**Special files:** `hero-storefront-*` is the home page hero; `og-dear-friends.jpg` (1200×630) is the social preview.

## K. Update business information

**`src/config/site.js`** is the single source for:
- name, address, phone and hours
- Instagram and `googleBusinessUrl`
- booking rules, email and map pin

The header, footer, contact page, mobile bar, forms, notices and structured data all read from it.

- **Reviews:** `src/data/reviews.js`. Real reviews only, word for word.
- **Page text:** `src/pages/*.js`.
- **Colours and type:** the tokens at the top of `src/styles/main.css`.

## L. Enable production booking

Do these in order, and only when the café is ready to handle online requests:

1. Complete **G**: Supabase project, schema and keys in Vercel.
2. Set up **café notifications** (see H) and test that they arrive.
3. Confirm the **booking rules** and the **confirmation process** with the café, and update `site.js` and the success message if needed.
4. Publish a **privacy statement**.
5. In Vercel, set **`ONLINE_BOOKINGS=true`** and redeploy. The "isn't live yet" notices disappear, and requests are stored as `requested`.
6. Make a real test booking on the live site and check the row in Supabase and the café notification.
7. To switch off again, remove `ONLINE_BOOKINGS` and redeploy. The site returns to "please call" mode immediately.

---

## Project structure

```
api/                    Vercel serverless functions
  reservations.js       POST /api/reservations
  enquiries.js          POST /api/enquiries
  _lib/                 HTTP helpers, Supabase REST client
public/                 Copied as-is: images/, fonts/ (Gloock, Instrument Sans, OFL), favicons
scripts/build.mjs       Renders pages to dist/, copies assets, writes sitemap.xml + robots.txt
scripts/dev.mjs         Local server with clean URLs and /api
src/config/site.js      Business details and booking rules
src/data/               Menu, photos, reviews, image sizes
src/components/         Layout (head/SEO/header/footer), menu, forms, shared sections
src/pages/              One file per page
src/client/             Browser scripts (nav, menu scroll-spy, lightbox, forms)
src/lib/                HTML templating; validation shared by browser and server
src/styles/main.css     All styles
supabase/schema.sql     Database tables and security
tests/                  node:test suites
vercel.json             Build settings, headers, caching, CSP
```

`dist/` is generated. It isn't committed and is rebuilt on every deploy.

`dist/` is generated on every build. The copy in this package is the demo build, included for review. `sitemap.xml` is produced at deploy time, once a public address is known.

## Fonts and licences

Gloock and Instrument Sans are self-hosted under the SIL Open Font License (see `public/fonts/*-OFL.txt`).
