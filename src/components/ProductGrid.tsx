import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import ProductCard from './ProductCard';
import { ScrollReveal } from '../hooks/useScrollReveal';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
}

export default function ProductGrid({
  products,
  title = 'Best Sellers',
  subtitle = 'Our most loved premium dry fruits & nuts',
  showViewAll = true,
}: ProductGridProps) {
  return (
    <section className="products-section products-section-pro">
      <div className="container">
        <ScrollReveal>
          <span className="section-eyebrow section-eyebrow-center">Customer Favorites</span>
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </ScrollReveal>
        <div className="product-grid">
          {products.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 60}>
              <ProductCard product={product} index={i} />
            </ScrollReveal>
          ))}
        </div>
        {showViewAll && (
          <ScrollReveal>
            <div className="categories-footer" style={{ marginTop: '2.5rem' }}>
              <Link to="/shop" className="btn btn-outline">
                View All Products
              </Link>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
