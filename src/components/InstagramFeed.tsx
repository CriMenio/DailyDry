import { Link } from 'react-router-dom';
import { homeOffers } from '../data/media';
import { STORE_INSTAGRAM_HANDLE, STORE_INSTAGRAM_URL } from '../config/commerce';
import { freeShippingThresholdLabel } from '../config/commerce';
import { useInventory } from '../context/InventoryContext';
import ProductImage from './ProductImage';
import { ScrollReveal } from '../hooks/useScrollReveal';

export default function InstagramFeed() {
  const { storeSettings } = useInventory();
  const freeMin = freeShippingThresholdLabel(storeSettings);

  const offers = homeOffers.map((offer) =>
    offer.id === 'free-shipping'
      ? { ...offer, subtitle: `Orders above ₹${freeMin}` }
      : offer
  );

  return (
    <section className="instagram-section instagram-section-ss1" aria-labelledby="home-offers-heading">
      <div className="container">
        <ScrollReveal>
          <div className="instagram-banner-ss1">
            <div className="instagram-banner-content">
              <h2 id="home-offers-heading" className="instagram-banner-title">
                Offers &amp; Deals
              </h2>
              <p className="instagram-banner-handle">
                Promos on premium dry fruits — tap a card to shop
              </p>
              <a
                href={STORE_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-follow-btn btn-lift"
              >
                Follow {STORE_INSTAGRAM_HANDLE}
              </a>
            </div>

            <div className="instagram-banner-gallery home-offers-gallery">
              {offers.map((offer, i) => (
                <Link
                  key={offer.id}
                  to={offer.link}
                  className="instagram-gallery-item home-offer-card hover-lift"
                  aria-label={`${offer.title}: ${offer.subtitle}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <ProductImage src={offer.image} alt={offer.title} />
                  <span className="home-offer-badge">{offer.badge}</span>
                  <span className="home-offer-copy">
                    <strong>{offer.title}</strong>
                    <small>{offer.subtitle}</small>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
