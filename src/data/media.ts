const dryFruits = '/media/Dry%20Fruits';
const instagramMedia = '/media/instagram';

export const heroMedia = {
  heroImage: '/media/hero/hero-products.jpg',
  poster: '/media/hero/hero-poster.jpg',
  video: '/media/hero/hero-video.mp4',
  showcase: `${dryFruits}/mix.png`,
};

export const pouchProductImages = {
  almonds: '/media/products/premium-almonds-pouch.jpg',
  cashews: '/media/products/premium-cashew-pouch.jpg',
  dryFruitMix: '/media/products/dry-fruit-mix-pouch.jpg',
  almondCashewMix: '/media/products/premium-almond-cashew-pouch.jpg',
  muesli: '/media/products/premium-muesli-pouch.jpg',
  kishmish: '/media/products/premium-kishmish-pouch.jpg',
};

export const productImages = {
  almonds: `${dryFruits}/Almond.png`,
  cashews: `${dryFruits}/Cashew.png`,
  raisins: `${dryFruits}/Raisian.png`,
  muesli: `${dryFruits}/Muesli.png`,
  mix: `${dryFruits}/mix.png`,
  walnuts: `${dryFruits}/walnut.png`,
  pistachios: `${dryFruits}/Cashew.png`,
  dates: `${dryFruits}/Raisian.png`,
};

export const categoryImages = {
  almonds: `${dryFruits}/Almond.png`,
  cashews: `${dryFruits}/Cashew.png`,
  raisins: `${dryFruits}/Raisian.png`,
  muesli: `${dryFruits}/Muesli.png`,
  'dry-fruit-mix': `${dryFruits}/mix.png`,
  walnuts: `${dryFruits}/walnut.png`,
};

export const sectionImages = {
  whyBowl: `${dryFruits}/mix.png`,
  whyChooseBg: '/media/prototype/why-choose-bg.jpg',
  bulkGift: `${dryFruits}/mix.png`,
};

export const instagramImages = [
  `${instagramMedia}/Almond.png`,
  `${instagramMedia}/Cashew.png`,
  `${instagramMedia}/Kishmish.png`,
  `${instagramMedia}/mix.png`,
  `${instagramMedia}/walnut.png`,
  `${instagramMedia}/premium-almonds-pouch.jpg`,
  `${instagramMedia}/dry-fruit-mix-pouch.jpg`,
];

export const promoBanners = [
  {
    id: '1',
    title: 'Family Pack of 5',
    subtitle: 'Premium dry fruit combo — perfect for gifting',
    cta: 'Buy Now',
    link: '/shop?category=dry-fruit-mix',
    image: `${dryFruits}/mix.png`,
  },
  {
    id: '2',
    title: 'Diwali Gifting',
    subtitle: 'Corporate & festive gift boxes available',
    cta: 'Request a Quote',
    link: '/bulk-orders',
    image: `${dryFruits}/mix.png`,
  },
  {
    id: '3',
    title: 'Big Saver Packs',
    subtitle: '1 KG packs starting at ₹999',
    cta: 'Shop Now',
    link: '/shop',
    image: `${dryFruits}/Almond.png`,
  },
];

export const blogPosts = [
  {
    id: '1',
    title: 'Top Dry Fruits for a Healthier 2026',
    date: 'Feb 02, 2026',
    excerpt: 'Discover the fastest-growing dry fruit trends in India and why premium quality matters.',
    image: `${dryFruits}/Almond.png`,
  },
  {
    id: '2',
    title: 'Diwali Gifting Ideas: Health Meets Taste',
    date: 'Jul 28, 2025',
    excerpt: 'Plan your festive gifting with premium dry fruit boxes your clients will love.',
    image: `${dryFruits}/mix.png`,
  },
  {
    id: '3',
    title: 'Boost Immunity with Nutrient-Rich Dry Fruits',
    date: 'Jun 04, 2025',
    excerpt: 'The best dry fruits to add to your daily diet for energy, fiber, and antioxidants.',
    image: `${dryFruits}/walnut.png`,
  },
];

export const faqs = [
  {
    q: 'Are Daily Dry products 100% natural?',
    a: 'Yes. All our dry fruits are sourced from trusted farms, with no artificial preservatives, colors, or flavors.',
  },
  {
    q: 'Do you offer free shipping?',
    a: 'Free shipping on orders above ₹999. Orders below that have a flat ₹49 delivery charge.',
  },
  {
    q: 'Can I place bulk or corporate orders?',
    a: 'Absolutely. Visit our Bulk Orders page or contact us for custom packaging and special pricing.',
  },
  {
    q: 'How should I store dry fruits?',
    a: 'Store in an airtight container in a cool, dry place. Refrigeration extends freshness for up to 6 months.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer easy 7-day returns on unopened products. Contact daildryofficial@gmail.com for assistance.',
  },
];

export const fallbackImage = `${dryFruits}/mix.png`;
