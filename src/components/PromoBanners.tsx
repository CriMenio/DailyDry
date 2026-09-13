import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { promoBanners } from '../data/media';
import ProductImage from './ProductImage';

export default function PromoBanners() {
  const [active, setActive] = useState(0);
  const banner = promoBanners[active];

  return (
    <section className="promo-banners">
      <div className="container">
        <div className="promo-banner-card">
          <div className="promo-banner-content">
            <h3>{banner.title}</h3>
            <p>{banner.subtitle}</p>
            <Link to={banner.link} className="btn btn-gold btn-sm">
              {banner.cta}
            </Link>
          </div>
          <div className="promo-banner-image">
            <ProductImage src={banner.image} alt={banner.title} />
          </div>
          <div className="promo-banner-nav">
            <button
              type="button"
              onClick={() => setActive((a) => (a - 1 + promoBanners.length) % promoBanners.length)}
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setActive((a) => (a + 1) % promoBanners.length)}
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="promo-banner-dots">
          {promoBanners.map((b, i) => (
            <button
              key={b.id}
              type="button"
              className={i === active ? 'active' : ''}
              onClick={() => setActive(i)}
              aria-label={`Go to ${b.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
