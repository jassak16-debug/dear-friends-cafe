// Site-wide behaviour: mobile navigation toggle.
const header = document.querySelector('[data-header]');
const toggle = document.querySelector('[data-nav-toggle]');

function setOpen(open) {
  header.toggleAttribute('data-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('nav-open', open);
}

if (header && toggle) {
  toggle.addEventListener('click', () => setOpen(!header.hasAttribute('data-open')));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.hasAttribute('data-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
  header.querySelectorAll('.site-nav a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  // Close the overlay if the viewport grows past the mobile breakpoint.
  matchMedia('(min-width: 1000px)').addEventListener('change', (e) => e.matches && setOpen(false));
}
