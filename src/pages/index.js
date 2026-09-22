import { html } from '../lib/html.js';
import { site } from '../config/site.js';
import { layout } from '../components/layout.js';
import { picture } from '../components/image.js';
import { icons } from '../components/icons.js';
import { button } from '../components/ui.js';
import { menuItem, sizedTable } from '../components/menu.js';
import { locationSection, bookingCta, instagramSection, reviewsSection } from '../components/sections.js';
import { findItem, drinksMenu } from '../data/menu.js';
import { photos } from '../data/gallery.js';

const items = (names) => html`<ul class="menu-list menu-list--compact">${names.map((n) => menuItem(findItem(n)))}</ul>`;

const hero = () => html`<section class="hero" aria-label="Welcome">
  <div class="fascia">
    <h1 class="fascia__inner wrap">
      <span class="fascia__name">Dear Friends</span>
      <span class="fascia__side fascia__side--left">Coffee Bar &amp; Eatery</span>
      <span class="fascia__side fascia__side--right">Milford, Auckland</span>
    </h1>
  </div>
  <div class="hero__photo">
    ${picture(photos.storefront, { eager: true, sizes: '100vw' })}
  </div>
  <div class="hero__welcome">
    <div class="wrap hero__welcome-inner">
      <p class="hero__quote">“${site.tagline}”</p>
      <div class="btn-row">
        ${button('/reservations', 'Book a table')}
        ${button('/menu', 'View menu', { variant: 'outline' })}
      </div>
    </div>
  </div>
</section>`;

const hoursStrip = () => html`<section class="hours-strip" aria-labelledby="hours-title">
  <h2 class="visually-hidden" id="hours-title">Opening hours and contact</h2>
  <div class="wrap hours-strip__inner">
    <p class="hours-strip__item">${icons.clock}<span><strong>Open ${site.hours.summary}</strong> ${site.hours.display}</span></p>
    <p class="hours-strip__item">${icons.pin}<a href="${site.maps.directionsUrl}" target="_blank" rel="noopener">${site.address.street}, ${site.address.suburb}</a></p>
    <p class="hours-strip__item">${icons.phone}<a href="tel:${site.phone.e164}">${site.phone.display}</a></p>
  </div>
</section>`;

const featured = () => html`<section class="featured" aria-labelledby="featured-title">
  <div class="wrap featured__grid">
    <figure class="featured__photo">
      ${picture(photos.burger, { sizes: '(min-width: 900px) 335px, 80vw' })}
      <figcaption>American Double Patty Beef Burger</figcaption>
    </figure>
    <div class="featured__body">
      <h2 class="section-title" id="featured-title">A few favourites</h2>
      <p class="section-lede">Some of the dishes on our menu, from hearty plates to something lighter.</p>
      ${items(['American Double Patty Beef Burger', 'Crispy Porkbelly Fried Eggs', 'Mushroom & Potato Rosti', 'Linguine Marinara'])}
      ${button('/menu', 'See the full menu', { variant: 'outline' })}
    </div>
  </div>
</section>`;

const about = () => html`<section class="about-teaser" aria-labelledby="about-title">
  <div class="wrap about-teaser__grid">
    <div class="about-teaser__photo">${picture(photos.signDoor, { sizes: '(min-width: 900px) 50vw, 100vw' })}</div>
    <div class="about-teaser__body">
      <h2 class="section-title" id="about-title">Your neighbourhood café in Milford</h2>
      <p>Dear Friends is a relaxed, cosy café on Kitchener Road, open every day from 6am for breakfast, brunch, lunch and coffee.</p>
      <p>Stop in for a coffee on the way through, or settle in for a long catch-up at a table inside or out front. Families and groups are welcome, and you can book ahead.</p>
      <a class="text-link" href="/about">More about Dear Friends</a>
    </div>
  </div>
</section>`;

const meals = () => html`<section class="meals" aria-label="Breakfast, brunch and lunch">
  <div class="wrap meals__grid">
    <figure class="meals__photo">${picture(photos.breakfastPlate, { sizes: '(min-width: 1100px) 18rem, 20rem' })}</figure>
    <article class="meal meal--brunch" aria-labelledby="brunch-title">
      <h2 class="section-title" id="brunch-title">Breakfast &amp; brunch</h2>
      <p class="section-lede">Free-range eggs, house-made hollandaise, and everything from granola to the Big Breakfast.</p>
      ${items(['Dear Friends Big Breakfast', 'Eggs Benedict', 'Dear Friends French Toast', 'Corn Fritters'])}
      <a class="text-link" href="/menu#breakfast">Breakfast menu</a>
    </article>
    <article class="meal meal--lunch" aria-labelledby="lunch-title">
      <h2 class="section-title" id="lunch-title">Lunch</h2>
      <p class="section-lede">Salads, burgers, seafood and our open steak sandwich.</p>
      ${items(['Thai Beef Salad', 'Korean Fried Chicken', 'Open Char – Grilled Steak Sandwich', 'Lemon Seafood Risotto'])}
      <a class="text-link" href="/menu#salad">Lunch menu</a>
    </article>
  </div>
</section>`;

const coffee = () => {
  const coffeeCat = drinksMenu.find((c) => c.id === 'coffee');
  const shortList = {
    ...coffeeCat,
    items: coffeeCat.items.filter((i) => ['Flat white', 'Latte', 'Long Black', 'Chai (Sweet/Spicy)'].includes(i.name)),
  };
  return html`<section class="coffee" aria-labelledby="coffee-title">
  <div class="wrap coffee__grid">
    <figure class="coffee__photo">${picture(photos.coffeeCup, { sizes: '(min-width: 1000px) 16rem, 18rem' })}</figure>
    <div class="coffee__intro">
      <h2 class="section-title" id="coffee-title">Coffee</h2>
      <p class="coffee__roaster">Proudly serving Allpress</p>
      <p>Espresso classics in three sizes, matcha and beetroot super lattes, Harney &amp; Sons teas, house iced drinks and organic super food smoothies.</p>
      <a class="text-link text-link--light" href="/menu#coffee">All drinks</a>
    </div>
    <div class="coffee__prices">${sizedTable(shortList)}<p class="menu-cat__note">${coffeeCat.note}</p></div>
  </div>
</section>`;
};

const cabinet = () => html`<section class="cabinet" aria-labelledby="cabinet-title">
  <div class="wrap cabinet__grid">
    <div>
      <h2 class="section-title" id="cabinet-title">Cabinet food &amp; sweets</h2>
      <p>Alongside the kitchen menu, our cabinet has cakes, sweets and savoury food to enjoy with a coffee or take away. Come in and see what’s there today.</p>
      <p class="cabinet__caption">Pictured: chocolate nutella cake (GF).</p>
    </div>
    <figure class="cabinet__photo">${picture(photos.cabinet, { sizes: '(min-width: 900px) 45vw, 100vw' })}</figure>
  </div>
</section>`;

const galleryStrip = () => html`<section class="gallery-strip" aria-labelledby="gallery-title">
  <div class="wrap gallery-strip__head">
    <h2 class="section-title" id="gallery-title">Around the café</h2>
    <a class="text-link" href="/gallery">View gallery</a>
  </div>
  <ul class="gallery-strip__list wrap" role="list">
    ${[photos.storefront, photos.burger, photos.pancakes, photos.coffeeCup].map(
      (p) => html`<li class="gallery-strip__item">${picture(p, { sizes: '(min-width: 900px) 25vw, 70vw' })}</li>`,
    )}
  </ul>
</section>`;

export default function home() {
  return layout({
    path: '/',
    title: 'Home',
    description:
      'Dear Friends Coffee Bar & Eatery on Kitchener Road, Milford. Breakfast, brunch, lunch and Allpress coffee, open every day 6am–4pm. Book a table online.',
    bodyClass: 'page-home',
    body: html`${hero()}${hoursStrip()}${featured()}${about()}${meals()}${coffee()}${cabinet()}${galleryStrip()}${reviewsSection()}${locationSection()}${instagramSection()}${bookingCta()}`,
  });
}
