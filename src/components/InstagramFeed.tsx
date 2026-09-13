import { instagramPosts } from '../data/products';
import { STORE_INSTAGRAM_HANDLE, STORE_INSTAGRAM_URL } from '../config/commerce';
import ProductImage from './ProductImage';
import { ScrollReveal } from '../hooks/useScrollReveal';

export default function InstagramFeed() {
  return (
    <section className="instagram-section instagram-section-ss1">
      <div className="container">
        <ScrollReveal>
          <div className="instagram-banner-ss1">
            <div className="instagram-banner-content">
              <h2 className="instagram-banner-title">Follow Us On Instagram</h2>
              <p className="instagram-banner-handle">{STORE_INSTAGRAM_HANDLE}</p>
              <a
                href={STORE_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-follow-btn btn-lift"
              >
                Follow
              </a>
            </div>

            <div className="instagram-banner-gallery">
              {instagramPosts.map((src, i) => (
                <a
                  key={src}
                  href={STORE_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="instagram-gallery-item hover-lift"
                  aria-label={`Instagram post ${i + 1}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <ProductImage src={src} alt={`Daily Dry Instagram ${i + 1}`} />
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
