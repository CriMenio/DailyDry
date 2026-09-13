import { Star } from 'lucide-react';

type ReviewStarInputProps = {
  value: number;
  onChange: (n: number) => void;
  size?: number;
};

export default function ReviewStarInput({ value, onChange, size = 28 }: ReviewStarInputProps) {
  return (
    <div className="review-star-input" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className="review-star-input-btn"
          onClick={() => onChange(n)}
          aria-label={`${n} star${n !== 1 ? 's' : ''}`}
          aria-pressed={n <= value}
        >
          <Star size={size} fill={n <= value ? 'currentColor' : 'none'} strokeWidth={1.5} />
        </button>
      ))}
    </div>
  );
}
