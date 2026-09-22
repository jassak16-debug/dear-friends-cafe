import { html } from '../lib/html.js';
import { dietaryLegend } from '../data/menu.js';

const legendLabel = Object.fromEntries(dietaryLegend.map((d) => [d.code, d.label]));

/** Dietary tags, e.g. "GFI optional". Each has a full label for screen readers. */
export function tags(list = []) {
  if (!list.length) return '';
  return html`<span class="tags">${list.map(
    (t) =>
      html`<abbr class="tag${t.optional ? ' tag--optional' : ''}" title="${legendLabel[t.code]}${t.optional ? ' (optional)' : ''}">${t.code}${t.optional ? html` <span class="tag__opt">optional</span>` : ''}</abbr>`,
  )}</span>`;
}

const priceText = (item) =>
  item.halfPrice ? html`${item.price}<span class="price__half"> / ${item.halfPrice}</span>` : item.price;

/** A single menu item. Name + price share a row; details follow. */
export function menuItem(item) {
  return html`<li class="menu-item">
  <div class="menu-item__head">
    <h3 class="menu-item__name">${item.name}</h3>
    ${item.price ? html`<span class="menu-item__leader" aria-hidden="true"></span><span class="price">${item.price}</span>` : ''}
  </div>
  ${tags(item.tags)}
  ${item.halfPrice ? html`<p class="menu-item__note">Half size ${item.halfPrice}</p>` : ''}
  ${item.description ? html`<p class="menu-item__desc">${item.description}</p>` : ''}
  ${item.variants
    ? html`<div class="menu-item__variants">
      ${item.variantsHeading ? html`<p class="menu-item__variants-head">${item.variantsHeading}</p>` : ''}
      <ul>${item.variants.map(
        (v) => html`<li><span>${v.name}</span><span class="price">${priceText(v)}</span></li>`,
      )}</ul></div>`
    : ''}
  ${item.extras ? html`<ul class="menu-item__extras">${item.extras.map((e) => html`<li>${e}</li>`)}</ul>` : ''}
</li>`;
}

/** Drinks with several sizes (Coffee, Super Latte) as an accessible table. */
export function sizedTable(cat) {
  return html`<div class="size-table-wrap">
  <table class="size-table">
    <caption class="visually-hidden">${cat.title} prices by size</caption>
    <thead><tr><th scope="col"><span class="visually-hidden">Drink</span></th>${cat.sizes.map(
      (s) => html`<th scope="col">${s}</th>`,
    )}</tr></thead>
    <tbody>${cat.items.map(
      (i) =>
        html`<tr><th scope="row">${i.name}</th>${i.prices.map(
          (p) => html`<td>${p ?? html`<span aria-label="Not available">–</span>`}</td>`,
        )}</tr>`,
    )}</tbody>
  </table>
</div>`;
}

/** A full menu category section with an anchor id for the category nav. */
export function menuCategory(cat, { headingLevel = 2 } = {}) {
  const H = `h${headingLevel}`;
  const heading = html`<${H} class="menu-cat__title" id="${cat.id}-title">${cat.title}</${H}>`;
  return html`<section class="menu-cat" id="${cat.id}" aria-labelledby="${cat.id}-title" data-menu-section>
  <header class="menu-cat__header">
    ${heading}
    ${cat.price ? html`<span class="price menu-cat__price">${cat.price}</span>` : ''}
  </header>
  ${cat.subtitle ? html`<p class="menu-cat__subtitle">${cat.subtitle}</p>` : ''}
  ${cat.tags ? tags(cat.tags) : ''}
  ${cat.layout === 'sized' ? sizedTable(cat) : html`<ul class="menu-list">${cat.items.map(menuItem)}</ul>`}
  ${cat.note ? html`<p class="menu-cat__note">${cat.note}</p>` : ''}
</section>`;
}
