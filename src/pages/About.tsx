import { Link } from 'react-router-dom';
import { Heart, Package, Sparkles, HeadphonesIcon } from 'lucide-react';
import ProductImage from '../components/ProductImage';
import { ScrollReveal } from '../hooks/useScrollReveal';
import { heroMedia } from '../data/media';
import { STORE_EMAIL_MAILTO, STORE_PHONE_TEL, STORE_WHATSAPP_URL } from '../config/commerce';
import { aboutHighlights, aboutIntro, aboutSections } from '../content/aboutContent';

const highlightIcons = [Sparkles, Package, Heart, HeadphonesIcon];

export default function About() {
  return (
    <section className="about-page">
      <div className="about-hero">
        <div className="container about-hero-inner">
          <ScrollReveal>
            <div className="about-hero-copy">
              <p className="about-eyebrow">About Daily Dry</p>
              <h1>Premium dry fruits, packed with care</h1>
              <p className="about-hero-lead">{aboutIntro}</p>
              <div className="about-hero-actions">
                <Link to="/shop" className="btn btn-primary btn-lift">
                  Shop now
                </Link>
                <Link to="/contact" className="btn btn-outline btn-lift">
                  Contact us
                </Link>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={100}>
            <div className="about-hero-media">
              <ProductImage src={heroMedia.showcase} alt="Daily Dry premium dry fruit products" />
            </div>
          </ScrollReveal>
        </div>
      </div>

      <div className="container">
        <ScrollReveal>
          <div className="about-highlights">
            {aboutHighlights.map(({ title, description }, index) => {
              const Icon = highlightIcons[index] ?? Sparkles;
              return (
                <div key={title} className="about-highlight-card">
                  <span className="about-highlight-icon" aria-hidden>
                    <Icon size={22} strokeWidth={1.75} />
                  </span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        <div className="about-story">
          {aboutSections.map((section, index) => (
            <ScrollReveal key={section.heading} delay={index * 40}>
              <article className="about-section">
                <h2>{section.heading}</h2>
                {section.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="about-cta">
            <h2>Ready to try Daily Dry?</h2>
            <p>Browse our catalog or talk to us—we are happy to help with orders, bulk enquiries, and delivery questions.</p>
            <div className="about-cta-links">
              <Link to="/shop" className="btn btn-gold btn-lift">
                View products
              </Link>
              <a href={STORE_PHONE_TEL} className="about-cta-link">
                Call support
              </a>
              <a href={STORE_EMAIL_MAILTO} className="about-cta-link">
                Email us
              </a>
              <a href={STORE_WHATSAPP_URL} className="about-cta-link" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
