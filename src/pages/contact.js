import { html } from '../lib/html.js';
import { site } from '../config/site.js';
import { layout } from '../components/layout.js';
import { icons } from '../components/icons.js';
import { pageIntro, callLink, addressBlock, button } from '../components/ui.js';
import { locationSection, bookingCta } from '../components/sections.js';

export default function contact() {
  const body = html`${pageIntro('Contact')}
<section class="contact">
  <div class="wrap contact__grid">
    <div class="contact__card">
      <h2 class="contact__heading">${icons.pin}<span>Visit</span></h2>
      ${addressBlock({ country: true })}
      <a class="text-link" href="${site.maps.directionsUrl}" target="_blank" rel="noopener">Get directions<span class="visually-hidden"> (opens Google Maps)</span></a>
    </div>
    <div class="contact__card">
      <h2 class="contact__heading">${icons.clock}<span>Hours</span></h2>
      <p>${site.hours.summary}<br>${site.hours.display}</p>
    </div>
    <div class="contact__card">
      <h2 class="contact__heading">${icons.phone}<span>Call</span></h2>
      <p class="contact__phone"><a href="tel:${site.phone.e164}">${site.phone.display}</a></p>
      ${callLink('btn btn--solid contact__call', 'Tap to call')}
    </div>
    <div class="contact__card">
      <h2 class="contact__heading">${icons.instagram}<span>Instagram</span></h2>
      <p><a href="${site.instagram.url}" target="_blank" rel="noopener">${site.instagram.handle}</a></p>
      ${site.email ? html`<p><a href="mailto:${site.email}">${site.email}</a></p>` : ''}
    </div>
  </div>
  <div class="wrap btn-row contact__actions">
    ${button('/reservations', 'Book a table')}
    ${button('/functions', 'Functions enquiry', { variant: 'outline' })}
  </div>
</section>
${locationSection({ title: 'Map' })}
${bookingCta()}`;
  return layout({
    path: '/contact',
    title: 'Contact & Location',
    description: `Contact Dear Friends Coffee Bar & Eatery: 132 Kitchener Road, Milford, Auckland 0620. Phone ${site.phone.display}. Open ${site.hours.summary} ${site.hours.display}.`,
    body,
  });
}
