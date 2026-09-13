import { useCountUp, ScrollReveal } from '../hooks/useScrollReveal';

const stats = [
  { end: 50000, suffix: '+', label: 'Happy Customers' },
  { end: 100, suffix: '%', label: 'Natural Products' },
  { end: 15, suffix: '+', label: 'Premium Varieties' },
  { end: 4.8, suffix: '★', label: 'Average Rating', decimal: true },
];

function StatItem({
  end,
  suffix,
  label,
  decimal,
}: {
  end: number;
  suffix: string;
  label: string;
  decimal?: boolean;
}) {
  const { count, ref } = useCountUp(end, 2200, 0, decimal);

  return (
    <div className="stat-item" ref={ref}>
      <span className="stat-number">
        {decimal ? count.toFixed(1) : count.toLocaleString('en-IN')}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function StatsBar() {
  return (
    <section className="stats-bar">
      <div className="container">
        <ScrollReveal>
          <div className="stats-grid">
            {stats.map((stat) => (
              <StatItem key={stat.label} {...stat} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
