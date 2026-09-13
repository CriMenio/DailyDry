import { Link } from 'react-router-dom';
import { ChevronsRight } from 'lucide-react';
import { categories } from '../data/products';
import ProductImage from './ProductImage';
import { ScrollReveal } from '../hooks/useScrollReveal';

export default function CategoryNav() {
  return (
    <section className="category-bar">
      <div className="container">
        <ScrollReveal direction="scale">
          <div className="category-bar-card category-stagger">
            <div className="category-bar-inner">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.slug}`}
                  className="category-bar-item hover-lift"
                >
                  <div className="category-bar-img">
                    <ProductImage src={cat.image} alt={cat.name} loading="eager" />
                  </div>
                  <div className="category-bar-text">
                    <strong>{cat.name}</strong>
                    <span>Shop Now →</span>
                  </div>
                </Link>
              ))}

              <Link to="/shop" className="category-bar-all hover-lift">
                <span className="category-bar-all-text">
                  View All
                  <br />
                  Products
                </span>
                <span className="category-bar-all-icon" aria-hidden="true">
                  <ChevronsRight size={14} strokeWidth={2.5} />
                </span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
