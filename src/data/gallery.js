/**
 * Photos used across the site. `src` is the base name of a responsive image set
 * in /public/images (widths listed in src/data/images.json).
 * Alt text describes what is actually in each photo. Captions only name a menu
 * item when the photo clearly shows that dish.
 *
 * To replace a photo: add new files as public/images/<name>-<width>.webp,
 * list them in src/data/images.json, and point `src` below at <name>.
 */
export const photos = {
  storefront: {
    src: 'hero-storefront',
    alt: 'The green Dear Friends shopfront on Kitchener Road, with outdoor tables under umbrellas and the open front door',
  },
  signDoor: {
    src: 'sign-door',
    alt: 'The Dear Friends sign in white lettering above the café’s front door on the green shopfront',
  },
  cabinet: {
    src: 'cabinet',
    alt: 'The Dear Friends cabinet: chocolate nutella cakes topped with edible flowers, a baked cheesecake, and savoury items on the shelf below',
  },
  breakfastPlate: {
    src: 'breakfast-plate',
    alt: 'A cooked breakfast with scrambled eggs, bacon, sausage, broccolini, a hash brown and sourdough toast, with a burger and fries behind',
  },
  coffeeCup: {
    src: 'coffee-cup',
    alt: 'A chocolate-dusted coffee with a Kia ora stencil on the foam, in a brown cup and saucer',
  },
  burger: {
    src: 'burger',
    alt: 'American double patty beef burger with bacon, cheddar and battered onion rings on a brioche bun',
  },
  pancakes: {
    // Not on the current menu: never label this as a menu item.
    src: 'pancakes',
    alt: 'Pancakes topped with berry compote, seeds and mint, with fresh fruit, edible flowers and a pot of syrup',
  },
};

/** Order of photos on the gallery page (layout in main.css › gallery). */
export const galleryOrder = ['storefront', 'cabinet', 'breakfastPlate', 'coffeeCup', 'burger', 'signDoor', 'pancakes'];

/** Photos still needed, shown as marked placeholders while placeholders are on. */
export const missingPhotos = [
  'Interior seating and atmosphere',
  'Larger, higher-resolution food and drink photos',
];
