// Accessible lightbox for the gallery page, built on the native <dialog>.
const dialog = document.querySelector('[data-lightbox-dialog]');
const triggers = [...document.querySelectorAll('[data-lightbox]')];

if (dialog && triggers.length && typeof dialog.showModal === 'function') {
  // The <img> is created on first open so the page never contains an image without a src.
  let img = null;
  const frame = dialog.querySelector('[data-lightbox-frame]');
  const caption = dialog.querySelector('[data-lightbox-caption]');
  let index = 0;

  const show = (i) => {
    index = (i + triggers.length) % triggers.length;
    const source = triggers[index].querySelector('img');
    // Use the largest candidate from the srcset.
    const largest = source.srcset.split(',').map((s) => s.trim().split(' ')[0]).pop();
    if (!img) {
      img = document.createElement('img');
      img.className = 'lightbox__img';
      frame.append(img);
    }
    img.src = largest || source.src;
    img.alt = source.alt;
    caption.textContent = source.alt;
  };

  triggers.forEach((btn, i) =>
    btn.addEventListener('click', () => {
      show(i);
      dialog.showModal();
    }),
  );
  dialog.querySelector('[data-lightbox-prev]').addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-lightbox-next]').addEventListener('click', () => show(index + 1));
  dialog.querySelector('[data-lightbox-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
  // Click on the backdrop closes.
  dialog.addEventListener('click', (e) => e.target === dialog && dialog.close());
  dialog.addEventListener('close', () => triggers[index].focus());
}
