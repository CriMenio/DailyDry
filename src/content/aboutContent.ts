export type AboutSection = {
  heading: string;
  body: string[];
};

export type AboutHighlight = {
  title: string;
  description: string;
};

export const aboutIntro =
  'Daily Dry is a home-grown brand from Navi Mumbai, built on one simple promise: premium dry fruits and nuts that are honest, fresh, and worth trusting every day.';

export const aboutSections: AboutSection[] = [
  {
    heading: 'How we started',
    body: [
      'Daily Dry began when we saw friends and family struggle to find dry fruits that looked good online but arrived stale, overly processed, or poorly packed. We started small—sourcing better almonds, cashews, raisins, and mixes, tasting every batch, and sharing pouches with people we knew.',
      'The response was clear: people wanted natural snacks they could keep at home, send in lunch boxes, or gift without second-guessing quality. That encouragement turned a passion project into Daily Dry—a brand focused on everyday nutrition, not just festival gifting.',
      'Today we sell through dailydry.in so customers across India can order the same carefully packed products we stand behind locally, with clear pricing and reliable delivery.',
    ],
  },
  {
    heading: 'Our products',
    body: [
      'Every Daily Dry product is selected for taste, freshness, and consistency. We work with trusted suppliers, inspect quality at receipt, and pack in hygienic pouches designed to protect aroma and crunch.',
      'Our range includes premium almonds, cashews, raisins, muesli, and curated dry-fruit mixes—100% natural, with no unnecessary preservatives or artificial additives. Whether you are snacking, cooking, or building a healthier routine, we want each pack to feel worth opening.',
      'Weights, ingredients, and prices are always shown clearly on our Shop page so you know exactly what you are buying before checkout.',
    ],
  },
  {
    heading: 'Customer satisfaction',
    body: [
      'Your trust matters more than a one-time sale. We pack orders with care, ship on time where possible, and stand behind what we send. If something arrives damaged, wrong, or not up to standard, reach out quickly—we review every case fairly under our refund policy.',
      'We listen to feedback on taste, packaging, and new products you would like to see. Many of our best sellers grew from customer suggestions and repeat orders from families who order month after month.',
    ],
  },
  {
    heading: 'Support you can reach',
    body: [
      'Questions before you order? Help after delivery? Our team is available Monday to Saturday, 9 AM to 7 PM, by phone and email. You can also use the contact form on our website or message us on WhatsApp with your order details.',
      'Use Track Order on the site to follow status updates, or contact us directly—we would rather solve a problem in one conversation than leave you guessing.',
    ],
  },
];

export const aboutHighlights: AboutHighlight[] = [
  {
    title: 'Carefully sourced',
    description: 'Trusted farms and suppliers, checked before they reach your pouch.',
  },
  {
    title: 'Hygienically packed',
    description: 'Sealed for freshness—from our pack table to your doorstep.',
  },
  {
    title: 'Honest pricing',
    description: 'What you see on Shop is what you pay at checkout, with clear shipping rules.',
  },
  {
    title: 'People-first support',
    description: 'Real humans on phone, email, and WhatsApp when you need help.',
  },
];
