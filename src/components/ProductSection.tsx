import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import ProductCard from './ProductCard';
import { ScrollReveal } from '../hooks/useScrollReveal';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
  loading?: boolean;
}

export default function ProductSection({
  title,
  subtitle,
  products,
  viewAllLink = '/shop',
  loading,
}: ProductSectionProps) {
  return (
    <section className="product-section-block">
      <div className="container">
        <ScrollReveal>
          <div className="section-header-row centered">
            <div>
              <h2 className="section-title">{title}</h2>
              {subtitle && <p className="section-subtitle">{subtitle}</p>}
            </div>
          </div>
        </ScrollReveal>
        <div className="product-grid">
          {loading ? (
            <p className="home-products-loading" aria-live="polite">
              Loading products…
            </p>
          ) : (
            products.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 50}>
                <ProductCard product={product} index={i} />
              </ScrollReveal>
            ))
          )}
        </div>
        <ScrollReveal delay={150}>
          <div className="section-cta-center">
            <Link to={viewAllLink} className="btn btn-outline btn-lift">
              View All
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
