import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqs } from '../data/media';
import { ScrollReveal } from '../hooks/useScrollReveal';
import { useInventory } from '../context/InventoryContext';
import { shippingPolicySummary } from '../config/commerce';

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  const { storeSettings } = useInventory();

  const items = useMemo(() => {
    return faqs.map((item) => {
      if (item.q.toLowerCase().includes('free shipping')) {
        return { ...item, a: shippingPolicySummary(storeSettings) };
      }
      return item;
    });
  }, [storeSettings]);

  return (
    <section className="faq-section">
      <div className="container">
        <ScrollReveal>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Everything you need to know about Daily Dry</p>
        </ScrollReveal>
        <div className="faq-list">
          {items.map((item, i) => (
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
