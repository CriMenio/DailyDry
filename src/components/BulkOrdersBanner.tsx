import { Link } from 'react-router-dom';
import { Tag, Truck, Package } from 'lucide-react';
import { sectionImages } from '../data/media';
import ProductImage from './ProductImage';
import { ScrollReveal } from '../hooks/useScrollReveal';

export default function BulkOrdersBanner() {
  return (
    <section className="bulk-banner bulk-banner-ss1">
      <div className="container bulk-banner-ss1-inner">
        <ScrollReveal direction="left">
          <div className="bulk-banner-ss1-content">
            <h2>Bulk Orders &amp; Corporate Gifting</h2>
            <p>
              Special pricing for bulk orders, weddings, festivals, and corporate gifting.
              Custom packaging available.
            </p>
            <Link to="/bulk-orders" className="btn btn-gold btn-lift">
              Request a Quote
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="bulk-banner-ss1-features">
            <div className="bulk-feature">
              <Tag size={20} />
              <span>Best Prices Guaranteed</span>
            </div>
            <div className="bulk-feature">
              <Truck size={20} />
              <span>Timely Delivery</span>
            </div>
            <div className="bulk-feature">
              <Package size={20} />
              <span>Custom Packaging</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={180}>
          <div className="bulk-banner-ss1-image">
            <ProductImage src={sectionImages.bulkGift} alt="Corporate gifting box with dry fruits" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
