import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Product } from '../data/products';
import ProductCard from './ProductCard';
import { ScrollReveal } from '../hooks/useScrollReveal';

interface HomeMainSectionProps {
  products: Product[];
}

export default function HomeMainSection({ products }: HomeMainSectionProps) {
  return (
    <section className="home-main-section home-main-section-ss1">
      <div className="container">
        <ScrollReveal>
          <div className="best-sellers-header">
            <h2 className="best-sellers-title">
              Best Sellers
              <span className="title-flourish" aria-hidden="true" />
            </h2>
          </div>
        </ScrollReveal>

        <div className="product-grid best-sellers-grid">
          {products.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 70}>
              <ProductCard product={product} index={i} variant="classic" />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200}>
          <div className="section-cta-center">
            <Link to="/shop" className="btn btn-gold best-sellers-view-all btn-lift">
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
