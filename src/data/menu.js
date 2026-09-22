/**
 * Menu — transcribed from the café's printed food and drinks menus.
 * Wording and prices are kept as printed (only spacing/punctuation tidied).
 * Prices are NZD strings exactly as the menu shows them.
 *
 * Dietary tags: GFI = gluten free ingredients, DF = dairy free,
 * V = vegetarian, VG = vegan, FR = free range.
 * `optional: true` means the tag is "Optional" on the printed menu
 * (i.e. a GFI/DF version is available on request).
 *
 * To update the menu, edit this file and redeploy.
 */

export const dietaryLegend = [
  { code: 'GFI', label: 'Gluten free ingredients' },
  { code: 'DF', label: 'Dairy free' },
  { code: 'V', label: 'Vegetarian' },
  { code: 'VG', label: 'Vegan' },
  { code: 'FR', label: 'Free range' },
];

export const allergenNote =
  'If you have food allergies, please notify your server. Our kitchen handles all the main allergens, including but not limited to dairy, eggs, nuts, peanuts, gluten, sesame, sulfites and soya.';

const gfiOptional = [{ code: 'GFI', optional: true }];
const gfi = [{ code: 'GFI' }];

export const foodMenu = [
  {
    id: 'breakfast',
    title: 'Breakfast',
    items: [
      {
        name: 'Soup',
        price: '26',
        description:
          'Seafood Chowder, Chicken & Mushroom (GFI), Pumpkin (GFI) with Focaccia Bread',
      },
      {
        name: 'Crunch Nut Granola',
        price: '19',
        tags: gfiOptional,
        description: 'Coconut Yoghurt, and Seasonal Fruit, Berry Compote',
      },
      {
        name: 'Toasted Preserve',
        price: '12',
        description: 'Choose 2 preserves (Raspberry Jam, Marmalade, Cream Cheese & Butter)',
        extras: ['Sourdough Rye / Focaccia Bread / Bagel (+2) / Croissant (+2) / GF (+1)'],
      },
      {
        name: 'Eggs on Toast',
        price: '16',
        tags: gfiOptional,
        description: 'FR Poached, Fried, Scrambled eggs',
      },
      {
        name: 'Chilli Scrambled Eggs',
        price: '26',
        description: 'FR Bacon, Chilli, Spring Onion, Fried Shallot, Grana Padano',
      },
      {
        name: 'Dear Friends Complete',
        price: '29',
        tags: gfiOptional,
        description:
          'Served with any style of eggs – poached, fried, scrambled, FR Bacon, Whipped Feta, Fresh Tomato, Avocado',
      },
      {
        name: 'Avocado on Toast',
        price: '27',
        tags: gfiOptional,
        description:
          'Served with Whipped Feta, Lemon Infused Smashed Avocado, Dukkah, Fresh Tomato, Kale Chips',
      },
      {
        name: 'Dear Friends Big Breakfast',
        price: '32',
        tags: gfiOptional,
        description:
          'FR Eggs of Your Style – Poached, Fried, Scrambled, FR Bacon, FR Pork Sausage, Roasted Tomato, Portobello Mushroom, Broccolini, and Baked Beans and Hash Browns',
      },
    ],
  },
  {
    id: 'classic',
    title: 'Classic',
    items: [
      {
        name: 'Dear Friends French Toast',
        price: '27',
        tags: gfiOptional,
        description:
          'Served with House-Made Coulis, Berry Compote, Seasonal Fruit and Mascarpone Cream, finished with Maple Syrup',
      },
      {
        name: 'Open Omelette',
        price: '25',
        tags: gfi,
        description: 'Tomato, Zucchini, Caramelised Onion, Salad, and Grana Padano',
        variants: [
          { name: 'Bacon Open Omelette', price: '28' },
          { name: 'Smoked Salmon Open Omelette w Capers', price: '29.5' },
        ],
      },
      {
        name: 'Mushroom & Potato Rosti',
        price: '26',
        tags: gfi,
        description:
          'Served with FR Poached eggs, Lentils (GFI), Portobello Mushrooms, Basil Pesto finished with Grana Padano',
      },
      {
        name: 'Eggs Benedict',
        price: '21',
        halfPrice: '16',
        tags: gfiOptional,
        description:
          'Served with FR Poached eggs on Potato Rosti, Brioche and Spinach with House-Made Hollandaise',
        variantsHeading: 'Full / half size',
        variants: [
          { name: 'Bacon Eggs Benedict', price: '27', halfPrice: '18' },
          { name: 'Porkbelly Eggs Benedict', price: '27', halfPrice: '18' },
          { name: 'Mushroom Eggs Benedict', price: '27', halfPrice: '18' },
          { name: 'Smoked Salmon Eggs Benedict', price: '28', halfPrice: '20' },
          { name: 'Fried Chicken Eggs Benedict', price: '27', halfPrice: '18' },
        ],
      },
      {
        name: 'Corn Fritters',
        price: '26',
        description:
          'Turmeric Spiced Corn Fritters served with FR Poached Egg, Tomato Relish, Capsicum, Lime Herb Yoghurt, and Green Salad',
      },
      {
        name: 'Mushroom Hunter',
        price: '27',
        tags: gfiOptional,
        description:
          'Served with mixed Sautéed Mushrooms with Cream and Bacon, Poached Egg. Served on Focaccia Bread',
      },
      {
        name: 'Crispy Porkbelly Fried Eggs',
        price: '27',
        description:
          'Served with Potato Rosti, Aioli, Tomato Relish, Caramelized Beetroot and Sourdough finished with Paprika Powder',
      },
      {
        name: 'Korean Fried Chicken',
        price: '25',
        description:
          'Korean Style Fried Chicken with the choice of Spicy Chilli Paste Sauce or Sweet Soy Sauce, Slaw Mix, finished with Peanuts',
      },
      {
        name: 'Open Char – Grilled Steak Sandwich',
        price: '33',
        tags: gfiOptional,
        description:
          'Served with 200g Sirloin Steak, Fresh Tomatoes, Mushrooms Puree, Cos Lettuce, Wholegrain Mustard Mayo, Grana Padano, Chimichurri, Caramelised Onions on Focaccia Bread',
        extras: ['ADD Fries ($5)'],
      },
      {
        name: 'Old School Mince on Toast',
        price: '28',
        tags: gfiOptional,
        description: 'Wagyu Beef Mince, Poached Egg finished with Grana Padano with Focaccia Bread',
      },
    ],
  },
  {
    id: 'salad',
    title: 'Salad',
    items: [
      {
        name: 'Chicken Salad',
        price: '27',
        tags: gfi,
        description:
          'FR Chicken Breast, Pan Fried Zucchini, Green Salad, Caramelised Beetroot, Caramelised Onion, Lentils (GFI), Halloumi Cheese, Mixed Seeds with Crispy Kale',
      },
      {
        name: 'Thai Beef Salad',
        price: '27',
        description:
          'Marinated Sirloin, Thai Fish Sauce, Mint, Coriander, Bean Sprout, Carrot & Mesclun, Red Onion Deep Fried Rice Noodle and Fried Shallot',
      },
      {
        name: 'Fitness Bowl',
        price: '28',
        description:
          'Salad, FR Poached eggs, Halloumi Cheese, Avocado, Dukkah, Lemon slice, Cherry Tomato, Broccolini, Orange',
        extras: ['ADD Salmon +8', 'ADD Chicken Breast +7'],
      },
    ],
  },
  {
    id: 'burger',
    title: 'Burger',
    items: [
      {
        name: 'American Double Patty Beef Burger',
        price: '26',
        tags: gfiOptional,
        description:
          'Brioche Bun, GF House-made Wagyu Burger Patty, Lettuce, Tomato, Red Onion, Battered Onion Ring (GFI), FR Bacon, American Cheddar Cheese, Wholegrain Mustard Mayo, Gherkins and Barbeque Sauce',
        extras: ['ADD Fries ($5), ADD Fried Egg ($4)'],
      },
      {
        name: 'Fried Chicken Burger',
        price: '24',
        description: 'Brioche Bun with Sriracha Mayonnaise with FR Fried Chicken, Slaw Mix',
        extras: ['ADD Fries ($5)'],
      },
    ],
  },
  {
    id: 'seafood',
    title: 'Seafood',
    items: [
      {
        name: 'Linguine Marinara',
        price: '30',
        tags: [{ code: 'DF', optional: true }],
        description: 'Prawns, Scallop, Mussel, Chilli Flake, Garlic and Butter Sauce',
      },
      {
        name: 'Lemon Seafood Risotto',
        price: '30',
        description: 'Prawns, Scallop, Mussel, Grilled Lemon with Grana Padano',
      },
    ],
  },
];

export const drinksMenu = [
  {
    id: 'coffee',
    title: 'Coffee',
    subtitle: 'Proudly serving Allpress',
    layout: 'sized',
    sizes: ['S', 'M', 'L (3 shot)'],
    items: [
      { name: 'Flat white', prices: ['5.6', '5.9', '7'] },
      { name: 'Cappuccino', prices: ['5.6', '5.9', '7'] },
      { name: 'Latte', prices: ['5.6', '5.9', '7'] },
      { name: 'Mochaccino', prices: ['6.2', '6.6', '7.5'] },
      { name: 'Piccolo', prices: ['5.5', null, null] },
      { name: 'Long Black', prices: ['5', null, null] },
      { name: 'Short Black', prices: ['5', null, null] },
      { name: 'Americano', prices: ['5', '5.5', '6'] },
      { name: 'Long Macchiato', prices: ['5', null, null] },
      { name: 'Short Macchiato', prices: ['5', null, null] },
      { name: 'Hot Chocolate', prices: ['5.5', '6', '6.5'] },
      { name: 'Chai (Sweet/Spicy)', prices: ['6', '6.5', '6.8'] },
      { name: 'Babyccino w Cream', prices: ['3.5', null, null] },
    ],
    note: 'Alt Milk / Decaf / Extra Shot / Syrup +1',
  },
  {
    id: 'super-latte',
    title: 'Super Latte',
    layout: 'sized',
    sizes: ['M', 'L'],
    items: [
      { name: 'Matcha', prices: ['8', '8.5'] },
      { name: 'Beetroot', prices: ['7', '7.5'] },
    ],
  },
  {
    id: 'tea',
    title: 'Tea',
    subtitle: 'Serving Harney & Sons',
    items: [
      { name: 'English Breakfast', price: '6' },
      { name: 'Earl Grey', price: '6' },
      { name: 'Peppermint', price: '6' },
      { name: 'Lemon & Ginger', price: '5.5' },
      { name: 'Green Tea', price: '5.5' },
    ],
  },
  {
    id: 'iced',
    title: 'House Iced Drinks',
    items: [
      {
        name: 'Iced Coffee',
        price: '8.5',
        description: 'Real Coffee Shot, Ice Cream Syrup Blend with Ice',
      },
      {
        name: 'Iced Mocha',
        price: '9',
        description:
          'Real Coffee Shot with Hershey’s chocolate, Ice Cream, Syrup Blend with ice, Whipped Cream on top with Oreo',
      },
      {
        name: 'Iced Chocolate',
        price: '8',
        description:
          'Hershey’s Chocolate with syrup, Ice Cream blended with Ice, Whipped Cream on top with Oreo',
      },
      { name: 'Iced Latte', price: '7.5' },
      { name: 'Iced Americano', price: '6.5' },
      { name: 'Cold Pressed Apple Juice', price: '9' },
      { name: 'Freshly Squeezed Orange Juice', price: '9' },
    ],
    note: 'Alt Milk / Decaf / Extra Shot / Syrup +1',
  },
  {
    id: 'soda',
    title: 'Six Barrel Soda',
    items: [
      { name: 'Raspberry & Lemon', price: '7' },
      { name: 'Cherry & Pomegranate', price: '7' },
      { name: 'Matcha Spritz', price: '9' },
    ],
  },
  {
    id: 'specials',
    title: 'Specials',
    items: [
      { name: 'Iced Matcha', price: '9' },
      { name: 'Iced Strawberry Matcha', price: '9.5' },
      { name: 'Peach Iced Tea (Still/Sparkling)', price: '7.5' },
      { name: 'Mimosa', price: '18' },
      { name: 'Aperol Spritz', price: '18' },
      { name: 'Bloody Mary', price: '18' },
    ],
  },
  {
    id: 'smoothies',
    title: 'Organic Super Food Smoothies',
    price: '13', // one price for every smoothie
    tags: [{ code: 'GFI' }, { code: 'VG' }, { code: 'DF' }],
    items: [
      {
        name: 'Super Berry',
        description: 'almond milk, raspberry, blueberry, banana, lemon juice, agave syrup',
      },
      {
        name: 'Berry Antioxidiser',
        tags: [{ code: 'GFI' }, { code: 'DF' }],
        description:
          'almond milk, banana, currant, acai powder, vanilla, collagen, lemon juice, agave syrup',
      },
      {
        name: 'Raspberry & Beetroot',
        description: 'almond milk, raspberry, beetroot, agave syrup, lemon juice',
      },
      {
        name: 'Spirulina',
        description: 'apple juice, banana, spinach, kale, spirulina powder, apricot',
      },
      {
        name: 'Protein Blueberry & Peanut Butter',
        description:
          'almond milk, blueberry, peanut butter, banana, hemp seed, protein powder',
      },
      {
        name: 'Tropical Mint Mojito',
        description: 'coconut water, mint, basil, kale, lemon juice, pineapple, cucumber, banana',
      },
      {
        name: 'Cacao Maca',
        description: 'coconut milk, banana, date, cacao maca powder, agave syrup',
      },
      { name: 'Mango & Pineapple', description: 'coconut water, mango, pineapple, agave syrup' },
      { name: 'Fresh Banana Vanilla Bean Smoothie' },
    ],
    note: 'Add Protein Powder / Vegan Collagen +1',
  },
];

/** Look up a food item by name (used for featured dishes on the home page). */
export function findItem(name) {
  for (const cat of [...foodMenu, ...drinksMenu]) {
    const item = cat.items.find((i) => i.name === name);
    if (item) return { ...item, category: cat.title, categoryId: cat.id };
  }
  throw new Error(`Menu item not found: ${name}`);
}
