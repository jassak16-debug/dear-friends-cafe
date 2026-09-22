import { html } from '../lib/html.js';
import { site } from '../config/site.js';
import { icons } from './icons.js';

/** Link styled as a button. variant: 'solid' | 'outline' | 'light' */
export const button = (href, label, { variant = 'solid', attrs = '' } = {}) =>
  html`<a class="btn btn--${variant}" href="${href}" ${attrs}>${label}</a>`;

export const callLink = (className = 'btn btn--outline', label = `Call ${site.phone.display}`) =>
  html`<a class="${className}" href="tel:${site.phone.e164}">${icons.phone}<span>${label}</span></a>`;

/**
 * Clearly marked placeholder for content the café still needs to supply.
 * Renders nothing when placeholders are switched off (SHOW_PLACEHOLDERS=false).
 */
export function placeholder(title, detail = '', { tall = false } = {}) {
  if (!site.showPlaceholders) return '';
  return html`<div class="placeholder${tall ? ' placeholder--tall' : ''}" role="note">
    <p class="placeholder__label">Placeholder</p>
    <p class="placeholder__title">${title}</p>
    ${detail ? html`<p class="placeholder__detail">${detail}</p>` : ''}
  </div>`;
}

/** Short, calm notice shown above the forms while online requests aren't connected. */
export const offlineNotice = (text) =>
  site.onlineRequests
    ? ''
    : html`<p class="offline-notice">${icons.phone}<span>${text} <a href="tel:${site.phone.e164}">${site.phone.display}</a>.</span></p>`;

export const hoursLine = () => html`${site.hours.summary}, ${site.hours.display}`;

/** Address block used in footer, contact and location sections. */
export const addressBlock = ({ country = false } = {}) => html`<address class="address">
  <span class="address__name">${site.name}</span>
  <span>${site.address.street}</span>
  <span>${site.address.suburb}, ${site.address.city} ${site.address.postcode}</span>
  ${country ? html`<span>${site.address.countryName}</span>` : ''}
</address>`;

/** Page intro used at the top of inner pages. */
export const pageIntro = (title, lede = '', extra = '') => html`<header class="page-intro">
  <div class="wrap">
    <h1 class="page-intro__title">${title}</h1>
    ${lede ? html`<p class="page-intro__lede">${lede}</p>` : ''}
    ${extra}
  </div>
</header>`;
