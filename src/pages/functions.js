import { html } from '../lib/html.js';
import { site } from '../config/site.js';
import { layout } from '../components/layout.js';
import { picture } from '../components/image.js';
import { pageIntro, callLink, placeholder, offlineNotice } from '../components/ui.js';
import { enquiryForm } from '../components/forms.js';
import { photos } from '../data/gallery.js';

export default function functions() {
  const body = html`${pageIntro('Functions & group bookings', 'Birthdays, celebrations, work catch-ups and private functions.')}
<section class="form-page">
  <div class="wrap form-page__grid">
    <aside class="form-page__aside prose">
      <p class="prose__lead">Planning something for a bigger group? Get in touch and we’ll talk through what’s possible.</p>
      <p>Tell us the occasion, a date you have in mind and roughly how many people are coming. We’ll get back to you to discuss seating, timing and food.</p>
      <p>For anything urgent, give us a call.</p>
      ${callLink()}
      ${placeholder('Function details', 'Optional: add capacity, minimum spend, set menus, or exclusive-use options if the café offers them. Nothing has been assumed.')}
      <div class="form-page__photo">${picture(photos.storefront, { sizes: '(min-width: 900px) 35vw, 100vw' })}</div>
    </aside>
    <div class="form-page__form">
      <h2 class="section-title">Send an enquiry</h2>
      ${offlineNotice('Online enquiries aren’t live yet. To talk about your event, please call')}
      ${enquiryForm()}
    </div>
  </div>
</section>`;
  return layout({
    path: '/functions',
    title: 'Functions & Group Bookings',
    description: `Group bookings, celebrations and private functions at Dear Friends, Milford. Send an enquiry or call ${site.phone.display}.`,
    body,
    scripts: ['forms.js'],
  });
}
