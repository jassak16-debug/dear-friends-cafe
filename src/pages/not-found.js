import { html } from '../lib/html.js';
import { layout } from '../components/layout.js';
import { pageIntro, button } from '../components/ui.js';

export default function notFound() {
  return layout({
    path: '/404',
    title: 'Page not found',
    description: 'This page could not be found.',
    noindex: true,
    body: html`${pageIntro('This page isn’t here', 'The link may be old or mistyped. Try one of these instead.', html`<div class="btn-row">${button('/', 'Home')}${button('/menu', 'Menu', { variant: 'outline' })}${button('/reservations', 'Book a table', { variant: 'outline' })}</div>`)}`,
  });
}
