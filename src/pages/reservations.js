import { html } from '../lib/html.js';
import { site } from '../config/site.js';
import { layout } from '../components/layout.js';
import { pageIntro, callLink, offlineNotice } from '../components/ui.js';
import { reservationForm } from '../components/forms.js';

export default function reservations() {
  const body = html`${pageIntro('Book a table', `Choose a date, time and number of guests. We’re open ${site.hours.summary}, ${site.hours.display}.`)}
<section class="form-page">
  <div class="wrap form-page__grid">
    <div class="form-page__form">
      <noscript><p class="notice">Online booking needs JavaScript. Please call us on <a href="tel:${site.phone.e164}">${site.phone.display}</a> to book.</p></noscript>
      ${offlineNotice('Online booking isn’t live yet. To book a table, please call')}
      ${reservationForm()}
    </div>
    <aside class="form-page__aside prose">
      <h2 class="section-title section-title--small">Prefer to call?</h2>
      <p>We’re happy to take bookings over the phone during opening hours.</p>
      ${callLink()}
      <h2 class="section-title section-title--small">Bigger group?</h2>
      <p>For more than ${site.booking.maxGuests} guests, celebrations or private functions, <a href="/functions">send us an enquiry</a>.</p>
    </aside>
  </div>
</section>`;
  return layout({
    path: '/reservations',
    title: 'Book a Table',
    description: `Book a table at Dear Friends Coffee Bar & Eatery, 132 Kitchener Road, Milford. Request online or call ${site.phone.display}.`,
    body,
    scripts: ['forms.js'],
  });
}
