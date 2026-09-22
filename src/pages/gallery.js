import { html } from '../lib/html.js';
import { site } from '../config/site.js';
import { layout } from '../components/layout.js';
import { picture } from '../components/image.js';
import { pageIntro, placeholder } from '../components/ui.js';
import { bookingCta, instagramSection } from '../components/sections.js';
import { photos, galleryOrder, missingPhotos } from '../data/gallery.js';

export default function gallery() {
  const body = html`${pageIntro('Gallery', 'The café, the street and a few plates from the kitchen.')}
<section class="gallery" aria-label="Photos">
  <ul class="gallery__grid wrap" role="list">
    ${galleryOrder.map((key, i) => {
      const p = photos[key];
      return html`<li class="gallery__item gallery__item--${key}">
        <button class="gallery__open" type="button" data-lightbox="${i}" aria-label="Enlarge photo: ${p.alt}">
          ${picture(p, { sizes: '(min-width: 1000px) 33vw, (min-width: 600px) 50vw, 100vw' })}
        </button>
      </li>`;
    })}
  </ul>
  ${site.showPlaceholders && missingPhotos.length ? html`<div class="wrap gallery__todo">${missingPhotos.map((m) => placeholder(`Photo needed: ${m}`))}</div>` : ''}
</section>
<dialog class="lightbox" data-lightbox-dialog aria-label="Photo viewer">
  <div class="lightbox__frame" data-lightbox-frame></div>
  <p class="lightbox__caption" data-lightbox-caption></p>
  <div class="lightbox__controls">
    <button type="button" class="lightbox__btn" data-lightbox-prev>Previous</button>
    <button type="button" class="lightbox__btn" data-lightbox-close>Close</button>
    <button type="button" class="lightbox__btn" data-lightbox-next>Next</button>
  </div>
</dialog>
${instagramSection()}
${bookingCta()}`;
  return layout({
    path: '/gallery',
    title: 'Gallery',
    description: 'Photos of Dear Friends Coffee Bar & Eatery in Milford, Auckland: the shopfront, outdoor seating and dishes from our kitchen.',
    body,
    scripts: ['gallery.js'],
  });
}
