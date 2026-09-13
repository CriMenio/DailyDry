import { useEffect, useMemo, useState } from 'react';
import { MessageSquareQuote, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { fetchProductReviews, submitReview } from '../services/api';
import { getProductById } from '../data/products';
import type { ReviewRecord } from '../types/api';
import ReviewStarInput from './ReviewStarInput';

interface ProductReviewsProps {
  productId: string;
}

function clampRating(n: number): number {
  return Math.min(5, Math.max(1, Number(n) || 5));
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const product = getProductById(productId);
  const productName = product?.name || '';
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [fullName, setFullName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = () => {
    if (!productName) return;
    setLoading(true);
    fetchProductReviews(productName)
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, [productName]);

  useEffect(() => {
    if (isAuthenticated && user?.name) {
      setFullName(user.name);
    } else {
      setFullName('');
    }
  }, [productId, isAuthenticated, user?.name]);

  const { averageRating, reviewCount } = useMemo(() => {
    if (reviews.length === 0) return { averageRating: 0, reviewCount: 0 };
    const sum = reviews.reduce((acc, r) => acc + clampRating(r.rating), 0);
    return { averageRating: sum / reviews.length, reviewCount: reviews.length };
  }, [reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !productName) {
      showToast('Please write a short review', 'error');
      return;
    }
    const name = fullName.trim();
    if (!name) {
      showToast('Please enter your name', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await submitReview({
        productName,
        rating,
        text: text.trim(),
        fullName: name,
      });
      showToast('Thank you! Your review was saved.');
      setText('');
      setRating(5);
      if (!isAuthenticated) setFullName('');
      loadReviews();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="product-reviews" aria-labelledby="product-reviews-heading">
      <header className="product-reviews-header">
        <div>
          <p className="product-reviews-eyebrow">Reviews</p>
          <h2 id="product-reviews-heading" className="product-reviews-title">
            Customer reviews
          </h2>
          {productName && (
            <p className="product-reviews-product text-muted">
              For <strong>{productName}</strong>
            </p>
          )}
        </div>
        {!loading && reviewCount > 0 && (
          <div className="product-reviews-summary" aria-label={`${averageRating.toFixed(1)} out of 5 from ${reviewCount} reviews`}>
            <div className="product-reviews-summary-stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={18}
                  fill={s <= Math.round(averageRating) ? 'currentColor' : 'none'}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className="product-reviews-summary-score">{averageRating.toFixed(1)}</span>
            <span className="product-reviews-summary-count">
              {reviewCount} review{reviewCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </header>

      {loading && (
        <div className="product-reviews-loading" aria-busy="true">
          <div className="account-skeleton account-skeleton-md" />
          <div className="account-skeleton account-skeleton-sm" />
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <div className="product-reviews-empty">
          <div className="product-reviews-empty-icon" aria-hidden>
            <MessageSquareQuote size={28} strokeWidth={1.5} />
          </div>
          <p>No reviews for this product yet. Be the first to share your experience.</p>
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <ul className="product-review-list">
          {reviews.map((r) => {
            const stars = clampRating(r.rating);
            return (
              <li key={r.reviewId} className="product-review-card">
                <div className="product-review-card-head">
                  <div>
                    <strong className="product-review-author">{r.fullName}</strong>
                    <div className="product-review-stars" aria-label={`${stars} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} fill={s <= stars ? 'currentColor' : 'none'} strokeWidth={1.5} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="product-review-text">&ldquo;{r.text}&rdquo;</p>
              </li>
            );
          })}
        </ul>
      )}

      <div className="product-review-compose">
        <h3 className="product-review-compose-title">Write a review</h3>
        <p className="product-review-compose-hint text-muted">
          Saved to the Reviews sheet with this product name.
        </p>

        <form className="product-review-form" onSubmit={handleSubmit}>
          <div className="review-site-field">
            <span className="review-site-label">FullName</span>
            <input
              type="text"
              className="review-site-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              required
              maxLength={80}
            />
          </div>

          <div className="review-site-field">
            <span className="review-site-label">Rating</span>
            <ReviewStarInput value={rating} onChange={setRating} size={26} />
          </div>

          <div className="review-site-field">
            <span className="review-site-label">You Reviews</span>
            <textarea
              className="review-site-input review-site-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share quality, taste, packaging…"
              rows={5}
              required
              maxLength={2000}
            />
          </div>

          <div className="product-review-form-actions">
            <button type="submit" className="btn btn-primary btn-lift" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit review'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
