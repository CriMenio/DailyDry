import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Quote, Star, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { fetchFeaturedReviews, submitReview } from '../services/api';
import type { ReviewRecord } from '../types/api';
import ReviewStarInput from './ReviewStarInput';

type DisplayReview = {
  id: string;
  name: string;
  rating: number;
  text: string;
};

function toDisplay(r: ReviewRecord): DisplayReview {
  return {
    id: r.reviewId,
    name: r.fullName,
    rating: Math.min(5, Math.max(1, Number(r.rating) || 5)),
    text: r.text,
  };
}

export default function CustomerReviewPanel() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [sheetReviews, setSheetReviews] = useState<DisplayReview[]>([]);
  const [idx, setIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setLoadFailed(false);
    try {
      const list = await fetchFeaturedReviews();
      const mapped = list.map(toDisplay);
      setSheetReviews(mapped);
      setIdx(0);
    } catch {
      setSheetReviews([]);
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const openReviewModal = () => {
    if (isAuthenticated && user?.name) {
      setFullName(user.name);
    }
    setModalOpen(true);
  };

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [modalOpen]);

  const closeModal = () => {
    setModalOpen(false);
    loadReviews();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = fullName.trim();
    if (!name) {
      showToast('Please enter your name', 'error');
      return;
    }
    if (!text.trim()) {
      showToast('Please write your review', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await submitReview({
        fullName: name,
        rating,
        text: text.trim(),
      });
      showToast('Thank you! Your review was saved.');
      setText('');
      setRating(5);
      if (!isAuthenticated) setFullName('');
      setModalOpen(false);
      await loadReviews();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const count = sheetReviews.length;
  const safeIdx = count ? Math.min(idx, count - 1) : 0;
  const current = count ? sheetReviews[safeIdx] : null;

  return (
    <>
      <div className="home-features-testimonial home-review-panel">
        <div className="testimonial-card-head">
          <Quote size={22} className="quote-icon testimonial-quote-inline" />
          <h3>What Our Customers Say</h3>
          <button
            type="button"
            className="btn btn-outline btn-sm testimonial-write-btn"
            onClick={openReviewModal}
          >
            WRITE
          </button>
        </div>

        {loading ? (
          <p className="home-review-loading text-muted">Loading reviews from sheet…</p>
        ) : loadFailed ? (
          <p className="home-review-empty text-muted">
            Could not load reviews from the <strong>Reviews</strong> sheet. Paste the latest{' '}
            <code>Code.gs</code> in Apps Script, deploy a <strong>new version</strong> of the Web app, then refresh
            this page.
          </p>
        ) : count === 0 ? (
          <p className="home-review-empty text-muted">
            No reviews in your <strong>Reviews</strong> sheet yet. Click <strong>WRITE</strong> to add the first one.
          </p>
        ) : (
          <>
            <div className="stars testimonial-stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  fill={s <= (current?.rating ?? 0) ? 'currentColor' : 'none'}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <p className="testimonial-text">&ldquo;{current?.text}&rdquo;</p>
            <p className="testimonial-author">— {current?.name}</p>

            {count > 1 && (
              <div className="testimonial-controls">
                <div className="testimonial-dots">
                  {sheetReviews.map((t, i) => (
                    <button
                      key={t.id}
                      type="button"
                      className={i === safeIdx ? 'active' : ''}
                      onClick={() => setIdx(i)}
                      aria-label={`Show review ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="testimonial-nav">
                  <button
                    type="button"
                    onClick={() => setIdx((i) => (i - 1 + count) % count)}
                    aria-label="Previous review"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdx((i) => (i + 1) % count)}
                    aria-label="Next review"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {modalOpen &&
        createPortal(
          <div className="review-modal-root" role="presentation">
            <button type="button" className="review-modal-backdrop" aria-label="Close" onClick={closeModal} />
            <div className="review-modal review-modal-site" role="dialog" aria-modal="true" aria-labelledby="review-modal-title">
              <button
                type="button"
                className="review-modal-close"
                onClick={closeModal}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
              <form className="review-form review-modal-form review-modal-form-site" onSubmit={handleSubmit}>
                <h2 id="review-modal-title" className="review-modal-title-site">
                  Share your experience
                </h2>
                <p className="review-modal-sheet-hint">Your review is saved with the next ID in the Reviews sheet.</p>

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
                    autoFocus
                  />
                </div>

                <div className="review-site-field">
                  <span className="review-site-label">Rating</span>
                  <ReviewStarInput value={rating} onChange={setRating} />
                </div>

                <div className="review-site-field">
                  <span className="review-site-label">You Reviews</span>
                  <textarea
                    className="review-site-input review-site-textarea"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Your review text…"
                    rows={5}
                    required
                    maxLength={2000}
                  />
                </div>

                <div className="review-modal-actions-site">
                  <button type="button" className="btn btn-outline" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-lift" disabled={submitting}>
                    {submitting ? 'Submitting…' : 'Submit review'}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
