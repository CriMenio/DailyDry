import Hero from '../components/Hero';
import CategoryNav from '../components/CategoryNav';
import HomeMainSection from '../components/HomeMainSection';
import BulkOrdersBanner from '../components/BulkOrdersBanner';
import WhyChooseUs from '../components/WhyChooseUs';
import ProductSection from '../components/ProductSection';
import InstagramFeed from '../components/InstagramFeed';
import TrustBar from '../components/TrustBar';
import { getBestSellers, getNewArrivals } from '../data/products';
import { useInventory } from '../context/InventoryContext';
import { useMemo } from 'react';

export default function Home() {
  const { loading, stockRows } = useInventory();

  const catalogKey = stockRows.map((r) => `${r.sheetId}:${r.mrp}:${r.offerPrice ?? ''}:${r.enabled}`).join('|');

  const bestSellers = useMemo(() => {
    if (loading) return [];
    return getBestSellers();
  }, [loading, catalogKey]);

  const newArrivals = useMemo(() => {
    if (loading) return [];
    return getNewArrivals();
  }, [loading, catalogKey]);

  return (
    <>
      <Hero />
      <CategoryNav />
      <HomeMainSection products={bestSellers} loading={loading} />
      <BulkOrdersBanner />
      <WhyChooseUs layout="home" />
      <InstagramFeed />
      <ProductSection
        title="New Arrivals"
        subtitle="Get a taste of something new! Our latest premium additions."
        products={newArrivals}
        loading={loading}
      />
      <TrustBar />
    </>
  );
}
