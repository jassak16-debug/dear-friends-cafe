// Highlights the menu category currently on screen and keeps its chip visible.
const links = new Map(
  [...document.querySelectorAll('[data-menu-link]')].map((a) => [a.dataset.menuLink, a]),
);
const sections = document.querySelectorAll('[data-menu-section]');
const nav = document.querySelector('[data-menu-nav] .menu-nav__list');
let current = null;

function activate(id) {
  if (id === current || !links.has(id)) return;
  if (current) links.get(current).removeAttribute('aria-current');
  const link = links.get(id);
  link.setAttribute('aria-current', 'true');
  current = id;
  // Horizontal chip bar (mobile): scroll the active chip into view without moving the page.
  if (nav && nav.scrollWidth > nav.clientWidth) {
    const left = link.offsetLeft - nav.clientWidth / 2 + link.offsetWidth / 2;
    nav.scrollTo({ left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
}

if ('IntersectionObserver' in window && sections.length) {
  const visible = new Set();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      // The first visible section in document order wins.
      const first = [...sections].find((s) => visible.has(s));
      if (first) activate(first.id);
    },
    { rootMargin: '-20% 0px -65% 0px' },
  );
  sections.forEach((s) => io.observe(s));
}
