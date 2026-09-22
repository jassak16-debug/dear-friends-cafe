import { html } from '../lib/html.js';
import { layout } from '../components/layout.js';
import { pageIntro } from '../components/ui.js';
import { menuCategory } from '../components/menu.js';
import { bookingCta } from '../components/sections.js';
import { foodMenu, drinksMenu, dietaryLegend, allergenNote } from '../data/menu.js';

const navGroup = (label, cats) => html`<li class="menu-nav__group">
  <span class="menu-nav__group-label">${label}</span>
  <ul role="list">${cats.map((c) => html`<li><a href="#${c.id}" data-menu-link="${c.id}">${c.title}</a></li>`)}</ul>
</li>`;

export default function menuPage() {
  const body = html`${pageIntro(
    'Menu',
    'Breakfast, brunch and lunch from the kitchen, plus coffee, tea, iced drinks and smoothies. Prices in NZ dollars.',
  )}
<div class="menu-layout wrap">
  <nav class="menu-nav" aria-label="Menu sections" data-menu-nav>
    <ul class="menu-nav__list" role="list">
      ${navGroup('Food', foodMenu)}
      ${navGroup('Drinks', drinksMenu)}
    </ul>
  </nav>

  <div class="menu-content">
    <div class="menu-key">
      <p class="menu-key__title">Dietary key</p>
      <dl class="menu-key__list">
        ${dietaryLegend.map((d) => html`<div><dt>${d.code}</dt><dd>${d.label}</dd></div>`)}
      </dl>
      <p class="menu-key__note"><strong>“Optional”</strong> means that version is available on request. ${allergenNote}</p>
    </div>

    <div class="menu-group" id="food">
      <p class="menu-group__label" aria-hidden="true">Food</p>
      ${foodMenu.map((c) => menuCategory(c))}
    </div>
    <div class="menu-group menu-group--drinks" id="drinks">
      <p class="menu-group__label" aria-hidden="true">Drinks</p>
      ${drinksMenu.map((c) => menuCategory(c))}
    </div>
  </div>
</div>
${bookingCta({ title: 'Hungry yet?', text: 'Book a table for breakfast, brunch or lunch.' })}`;

  return layout({
    path: '/menu',
    title: 'Menu',
    description:
      'The Dear Friends menu: breakfast, classics, salads, burgers and seafood, plus Allpress coffee, iced drinks, Six Barrel sodas and organic smoothies. Milford, Auckland.',
    body,
    bodyClass: 'page-menu',
    scripts: ['menu-nav.js'],
  });
}
