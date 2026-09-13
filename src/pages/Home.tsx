import Hero from '../components/Hero';
import CategoryNav from '../components/CategoryNav';
import HomeMainSection from '../components/HomeMainSection';
import BulkOrdersBanner from '../components/BulkOrdersBanner';
import WhyChooseUs from '../components/WhyChooseUs';
import ProductSection from '../components/ProductSection';
import InstagramFeed from '../components/InstagramFeed';
import TrustBar from '../components/TrustBar';
import { getBestSellers, getNewArrivals } from '../data/products';

export default function Home() {
  const bestSellers = getBestSellers();
  const newArrivals = getNewArrivals();

  return (
    <>
      <Hero />
      <CategoryNav />
      <HomeMainSection products={bestSellers} />
      <BulkOrdersBanner />
      <WhyChooseUs layout="home" />
      <InstagramFeed />
      <ProductSection
        title="New Arrivals"
        subtitle="Get a taste of something new! Our latest premium additions."
        products={newArrivals}
      />
      <TrustBar />
    </>
  );
}
