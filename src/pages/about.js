import { html } from '../lib/html.js';
import { site } from '../config/site.js';
import { layout } from '../components/layout.js';
import { picture } from '../components/image.js';
import { pageIntro, placeholder, button } from '../components/ui.js';
import { bookingCta, locationSection } from '../components/sections.js';
import { photos } from '../data/gallery.js';

export default function about() {
  const body = html`${pageIntro('About Dear Friends', 'A neighbourhood café on Kitchener Road, Milford.')}
<section class="prose-section">
  <div class="wrap split">
    <div class="split__text prose">
      <p class="prose__lead">Dear Friends is a relaxed, cosy café for good food, great coffee and catching up with the people you care about.</p>
      <p>We’re open ${site.hours.summary}, ${site.hours.display}, serving breakfast, brunch and lunch from the kitchen, Allpress coffee, Harney &amp; Sons teas, iced drinks, smoothies, and cabinet food and sweets.</p>
      <p>There’s seating inside and out front on Kitchener Road. Families and groups are welcome, and you can book a table ahead.</p>
      ${placeholder('The Dear Friends story', 'Add a few lines in your own words: who runs the café, when it opened, and what matters to you. This hasn’t been written for you so nothing is made up.')}
      <div class="btn-row">
        ${button('/menu', 'View menu')}
        ${button('/reservations', 'Book a table', { variant: 'outline' })}
      </div>
    </div>
    <div class="split__media stack-photos">
      ${picture(photos.storefront, { sizes: '(min-width: 900px) 45vw, 100vw' })}
      ${picture(photos.signDoor, { sizes: '(min-width: 900px) 30vw, 70vw' })}
    </div>
  </div>
</section>
<section class="facts" aria-labelledby="facts-title">
  <div class="wrap">
    <h2 class="section-title" id="facts-title">Good to know</h2>
    <dl class="facts__list">
      <div><dt>Open</dt><dd>${site.hours.summary}, ${site.hours.display}</dd></div>
      <div><dt>Food</dt><dd>Breakfast, brunch, lunch, cabinet food and desserts</dd></div>
      <div><dt>Drinks</dt><dd>Allpress coffee, tea, iced drinks, sodas, smoothies and a few cocktails</dd></div>
      <div><dt>Seating</dt><dd>Indoor and outdoor</dd></div>
      <div><dt>Groups</dt><dd>Families and groups welcome. <a href="/functions">Ask about functions</a></dd></div>
      <div><dt>Bookings</dt><dd><a href="/reservations">Reserve online</a> or call <a href="tel:${site.phone.e164}">${site.phone.display}</a></dd></div>
    </dl>
  </div>
</section>
${locationSection()}
${bookingCta()}`;
  return layout({
    path: '/about',
    title: 'About',
    description: 'About Dear Friends, a relaxed neighbourhood café on Kitchener Road, Milford. Breakfast, brunch, lunch and Allpress coffee with indoor and outdoor seating.',
    body,
  });
}
