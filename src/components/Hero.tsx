import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Leaf, Sparkles, Shield, Award } from 'lucide-react';
import { heroMedia } from '../data/media';
import { HeroBadges } from './Header';

const slides = [
  {
    eyebrow: "India's Premium Dry Fruits Brand",
    title: "Nature's Goodness,",
    highlight: 'Every Day.',
    desc: 'Handpicked premium dry fruits & nuts for a healthier you.',
  },
  {
    eyebrow: 'FSSAI Certified Quality',
    title: 'Pure & Natural,',
    highlight: 'Always Fresh.',
    desc: 'Hygienically packed dry fruits delivered straight to your doorstep.',
  },
];

const trustItems = [
  { icon: Leaf, label: '100% Natural' },
  { icon: Sparkles, label: 'Rich in Nutrition' },
  { icon: Shield, label: 'Hygienically Packed' },
  { icon: Award, label: 'Premium Quality' },
];

export default function Hero() {
  const [slide, setSlide] = useState(0);
  const current = slides[slide];

  const next = () => setSlide((s) => (s + 1) % slides.length);
  const prev = () => setSlide((s) => (s - 1 + slides.length) % slides.length);

  return (
    <section className="hero-proto">
      <div className="hero-proto-media" aria-hidden="true">
        <img
          src={heroMedia.heroImage}
          alt=""
          className="hero-proto-bg-img"
        />
        <div className="hero-proto-overlay" />
      </div>

      <div className="container hero-proto-inner">
        <div className="hero-proto-content">
          <div key={slide} className="hero-slide-content">
            <span className="hero-proto-eyebrow hero-enter">{current.eyebrow}</span>
            <h1 className="hero-proto-title hero-enter">
              {current.title}
              <span className="hero-proto-highlight">{current.highlight}</span>
            </h1>
            <p className="hero-proto-desc hero-enter">{current.desc}</p>

            <div className="hero-proto-buttons hero-enter">
              <Link to="/shop" className="btn btn-primary btn-glow">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/shop" className="btn btn-outline-gold">
                Explore Collection
              </Link>
            </div>
          </div>

          <div className="hero-trust-row hero-enter">
            {trustItems.map(({ icon: Icon, label }) => (
              <div key={label} className="hero-trust-item">
                <Icon size={16} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <HeroBadges />
      </div>

      <div className="hero-slider-controls">
        <button type="button" onClick={prev} aria-label="Previous slide">
          <ChevronLeft size={18} />
        </button>
        <button type="button" onClick={next} aria-label="Next slide">
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
