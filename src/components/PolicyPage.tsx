import { Link } from 'react-router-dom';
import { ScrollReveal } from '../hooks/useScrollReveal';

export type PolicySection = {
  heading: string;
  body: string[];
};

type PolicyPageProps = {
  title: string;
  intro?: string;
  sections: PolicySection[];
};

export default function PolicyPage({ title, intro, sections }: PolicyPageProps) {
  return (
    <section className="policy-page">
      <div className="container">
        <ScrollReveal>
          <header className="policy-header">
            <h1>{title}</h1>
            {intro ? <p className="policy-intro">{intro}</p> : null}
            <p className="policy-meta">Last updated: 18 September 2025</p>
          </header>
        </ScrollReveal>

        <div className="policy-body">
          {sections.map((section) => (
            <ScrollReveal key={section.heading} delay={60}>
              <article className="policy-section">
                <h2>{section.heading}</h2>
                {section.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </article>
            </ScrollReveal>
          ))}
        </div>

        <p className="policy-footer-note">
          Questions?{' '}
          <Link to="/contact">Contact us</Link> or see our{' '}
          <Link to="/shipping-policy">Shipping Policy</Link> and{' '}
          <Link to="/refund-policy">Cancellation &amp; Refund Policy</Link>.
        </p>
      </div>
    </section>
  );
}
