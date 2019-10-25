import { array, string, text, number } from 'raydiant-kit/prop-types';

export default {
  name: 'Menu',
  description: 'Easily create and display customized menus.',
  callToAction: 'Create Menu',
  properties: {
    categories: array('Categories', 'Category').items({
      name: string('Category').required(),
      items: array('Items', 'Item').items({
        name: string('Item').required(),
        itemDescription: text('Description'),
        price: string('Price'),
      }),
    }),
    duration: number('Duration')
      .min(5)
      .default(15)
      .helperText('Time in seconds.'),
  },
  simulator: {
    presentations: [
      {
        name: 'Menu',
        values: {
          categories: [
            {
              name: 'Sandwiches',
              items: [
                {
                  name: 'Cuban',
                  itemDescription: 'The king of ham and cheese sandwiches.',
                  price: '5',
                },
                {
                  name: 'Reuben',
                  itemDescription:
                    "A good ole' fashioned Corned Beef Reuben Sandwich. Pile it high and serve on rye.",
                  price: '6',
                },
              ],
            },
            {
              name: 'Entrees',
              items: [
                {
                  name: 'Steak Frites',
                  itemDescription:
                    'Norwich, ON AAA 8oz. New York striploin / fresh cut Yukon frites / cabernet shallot jus / truffle aïoli.',
                  price: '28',
                },
                {
                  name: 'Zucchini Rigatoni',
                  itemDescription:
                    'Ricotta / grape tomato / zucchini pesto / garlic / extra virgin olive oil / kale / potato crumble',
                  price: '20',
                },
              ],
            },
          ],
        },
      },
      { name: 'New Presentation' },
    ],
  },
};
