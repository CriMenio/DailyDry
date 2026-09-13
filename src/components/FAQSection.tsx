import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqs } from '../data/media';
import { ScrollReveal } from '../hooks/useScrollReveal';

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="faq-section">
      <div className="container">
        <ScrollReveal>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Everything you need to know about Daily Dry</p>
        </ScrollReveal>
        <div className="faq-list">
          {faqs.map((item, i) => (
            <ScrollReveal key={item.q} delay={i * 40}>
              <div className={`faq-item ${open === i ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  {item.q}
                  <ChevronDown size={18} className="faq-chevron" />
                </button>
                {open === i && <div className="faq-answer">{item.a}</div>}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
