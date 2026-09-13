import {
  CheckCircle,
  Leaf,
  ShieldCheck,
  Sparkles,
  Users,
  Dumbbell,
  Wheat,
  Heart,
  Brain,
} from 'lucide-react';
import { sectionImages } from '../data/media';
import ProductImage from './ProductImage';
import { ScrollReveal } from '../hooks/useScrollReveal';
import CustomerReviewPanel from './CustomerReviewPanel';

const whyItems = [
  { icon: CheckCircle, title: 'Carefully Sourced', desc: 'From trusted farms across the globe' },
  { icon: Leaf, title: '100% Natural & Pure', desc: 'No preservatives or artificial additives' },
  { icon: ShieldCheck, title: 'Hygienically Packed', desc: 'Maintains freshness & purity' },
  { icon: Sparkles, title: 'Rich in Nutrition', desc: 'Loaded with essential nutrients' },
  { icon: Users, title: 'Perfect for Everyone', desc: 'Kids, adults, athletes & fitness lovers' },
];

const healthItems = [
  { icon: Dumbbell, label: 'High in Protein' },
  { icon: Wheat, label: 'Rich in Fiber' },
  { icon: Heart, label: 'Good Source of Iron' },
  { icon: Brain, label: 'Healthy Fats' },
];

interface WhyChooseUsProps {
  compact?: boolean;
  layout?: 'default' | 'home';
}

export default function WhyChooseUs({ compact = false, layout = 'default' }: WhyChooseUsProps) {
  if (layout === 'home') {
    return (
      <section id="benefits" className="home-features-ss1">
        <div className="container">
          <div className="home-features-ss1-grid">
            <ScrollReveal direction="left">
              <div
                className="home-features-why-bg"
                style={{ backgroundImage: `url(${sectionImages.whyChooseBg})` }}
              >
              <div className="home-features-why-overlay">
                <h3>Why Choose Daily Dry?</h3>
                <ul>
                  {whyItems.map(({ icon: Icon, title, desc }) => (
                    <li key={title}>
                      <span className="why-check-icon">
                        <Icon size={16} strokeWidth={2.5} />
                      </span>
                      <div>
                        <strong>{title}</strong>
                        <span>{desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={120}>
              <div className="home-features-side">
              <div className="home-features-health">
                <h3>Healthy Everyday</h3>
                <div className="health-grid health-grid-row">
                  {healthItems.map(({ icon: Icon, label }) => (
                    <div key={label} className="health-item">
                      <Icon size={22} strokeWidth={1.5} />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <CustomerReviewPanel />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    );
  }

  if (compact) {
    return (
      <div className="why-compact">
        <div className="why-compact-block">
          <h3>Why Choose Daily Dry?</h3>
          <ul className="why-compact-list">
            {whyItems.map(({ icon: Icon, title, desc }) => (
              <li key={title}>
                <Icon size={16} />
                <div>
                  <strong>{title}</strong>
                  <span>{desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="why-compact-image">
          <ProductImage src={sectionImages.whyBowl} alt="Premium nuts bowl" />
        </div>

        <div className="why-compact-block health-block-pro">
          <h3>Healthy Everyday</h3>
          <div className="health-grid">
            {healthItems.map(({ icon: Icon, label }) => (
              <div key={label} className="health-item">
                <Icon size={22} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="why-compact-block testimonial-block-pro">
          <CustomerReviewPanel />
        </div>
      </div>
    );
  }

  return (
    <section id="benefits" className="why-section why-section-pro">
      <div className="container">
        <h2 className="section-title">Why Choose Daily Dry?</h2>
        <p className="section-subtitle">Quality you can trust, taste you will love</p>
        <div className="why-grid">
          <div>
            <div className="why-list">
              {whyItems.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="why-item">
                  <Icon size={22} />
                  <div>
                    <h4>{title}</h4>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="why-image-wrap">
            <ProductImage src={sectionImages.whyBowl} alt="Premium nuts bowl" />
          </div>
        </div>
      </div>
    </section>
  );
}
