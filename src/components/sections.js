import { html } from '../lib/html.js';
import { site } from '../config/site.js';
import { reviews } from '../data/reviews.js';
import { icons } from './icons.js';
import { addressBlock, button, callLink, placeholder } from './ui.js';

/** Google Map embed (no API key needed) with address, hours and directions. */
export function locationSection({ headingLevel = 2, title = 'Find us on Kitchener Road' } = {}) {
  const H = `h${headingLevel}`;
  return html`<section class="location" aria-labelledby="location-title">
  <div class="wrap location__grid">
    <div class="location__info">
      <${H} class="section-title" id="location-title">${title}</${H}>
      <p class="location__lede">In Milford, with seating inside and out.</p>
      <dl class="info-list">
        <div><dt>${icons.pin}<span>Address</span></dt><dd>${addressBlock()}</dd></div>
        <div><dt>${icons.clock}<span>Hours</span></dt><dd>${site.hours.summary}<br>${site.hours.display}</dd></div>
        <div><dt>${icons.phone}<span>Phone</span></dt><dd><a href="tel:${site.phone.e164}">${site.phone.display}</a></dd></div>
      </dl>
      <div class="btn-row">
        <a class="btn btn--solid" href="${site.maps.directionsUrl}" target="_blank" rel="noopener">Get directions<span class="visually-hidden"> (opens Google Maps)</span></a>
        ${callLink()}
      </div>
    </div>
    <div class="location__map">
      <iframe title="Map showing Dear Friends at 132 Kitchener Road, Milford" src="${site.maps.embedUrl}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      <a class="location__map-link" href="${site.maps.placeUrl}" target="_blank" rel="noopener">Open in Google Maps</a>
    </div>
  </div>
</section>`;
}

/** Closing call to action. */
export function bookingCta({ title = 'Save a table for your next catch-up', text = 'Book online in a minute or two, or give us a call.' } = {}) {
  return html`<section class="cta-band" aria-labelledby="cta-title">
  <div class="wrap cta-band__inner">
    <h2 class="cta-band__title" id="cta-title">${title}</h2>
    <p class="cta-band__text">${text}</p>
    <div class="btn-row btn-row--center">
      ${button('/reservations', 'Book a table', { variant: 'light' })}
      ${callLink('btn btn--ghost-light')}
    </div>
  </div>
</section>`;
}

export function instagramSection() {
  return html`<section class="instagram" aria-labelledby="instagram-title">
  <div class="wrap instagram__inner">
    <div>
      <h2 class="section-title" id="instagram-title">Follow along on Instagram</h2>
      <p>Keep up with what’s happening at Dear Friends at <a href="${site.instagram.url}" target="_blank" rel="noopener">${site.instagram.handle}</a>.</p>
    </div>
    <a class="btn btn--outline" href="${site.instagram.url}" target="_blank" rel="noopener">${icons.instagram}<span>${site.instagram.handle}</span></a>
  </div>
  <div class="wrap">
    ${placeholder(
      'Instagram feed',
      'Optional: connect a feed service (e.g. Behold or SnapWidget) to show recent posts here, or keep this as a link only.',
    )}
  </div>
</section>`;
}

/**
 * Customer reviews (src/data/reviews.js): real Google reviews only.
 * The "share your experience" line links to the café's Google Business Profile
 * only when a verified URL is set in site.googleBusinessUrl; otherwise it's text.
 */
export function reviewsSection() {
  if (!reviews.length && !site.showPlaceholders) return '';
  const google = site.googleBusinessUrl;
  return html`<section class="reviews" aria-labelledby="reviews-title">
  <div class="wrap">
    <h2 class="section-title" id="reviews-title">What our guests say</h2>
    ${reviews.length
      ? html`<ul class="reviews__list" role="list">${reviews.map(
          (r) => html`<li>
        <figure class="review">
          <blockquote class="review__quote"><p>${r.quote}</p></blockquote>
          <figcaption class="review__by"><span class="review__name">${r.author}</span><span class="review__source">${r.source}</span></figcaption>
        </figure>
      </li>`,
        )}</ul>`
      : placeholder('Customer reviews', 'Add genuine reviews (with permission) to src/data/reviews.js.')}
    <div class="reviews__cta">
      <p class="reviews__cta-title">Been in to see us?</p>
      <p>${google
        ? html`<a class="text-link" href="${google}" target="_blank" rel="noopener">Read more reviews or share your experience on Google<span class="visually-hidden"> (opens in a new tab)</span></a>`
        : 'Read more reviews or share your experience on Google.'}</p>
    </div>
  </div>
</section>`;
}
