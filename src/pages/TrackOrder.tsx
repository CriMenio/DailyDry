import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MessageCircle, PackageSearch } from 'lucide-react';
import { fetchTrackOrder } from '../services/api';
import type { OrderRecord } from '../types/api';
import { buildOrderConfirmWhatsAppUrl } from '../config/commerce';
import { formatPrice } from '../data/products';
import OrderTrackingTimeline from '../components/OrderTrackingTimeline';

function orderStatusTone(status: string): string {
  const s = status.toLowerCase();
  if (s.includes('deliver') && !s.includes('out for')) return 'success';
  if (s.includes('out for') || s.includes('dispatch')) return 'pending';
  if (s === 'cod') return 'success';
  return 'neutral';
}

function TrackOrderResult({ order, justPlaced }: { order: OrderRecord; justPlaced?: boolean }) {
  const whatsappUrl = useMemo(() => buildOrderConfirmWhatsAppUrl(order), [order]);

  return (
    <>
      {justPlaced && (
        <div className="order-placed-banner" role="status">
          <strong>Order placed successfully.</strong>
          <span> Send a quick WhatsApp message so we can confirm and prepare your order.</span>
        </div>
      )}

      <article className="track-order-result order-card order-card-pro">
        <div className="order-card-head">
          <div>
            <strong className="order-card-id">{order.orderNumber}</strong>
            <p className="order-meta">
              Bill {order.billNumber} · {order.customerName}
            </p>
          </div>
          <span className={`order-status-badge order-status-badge--${orderStatusTone(order.orderStatus)}`}>
            {order.orderStatus}
          </span>
        </div>

        <OrderTrackingTimeline status={order.orderStatus || 'Order Placed'} />

        <ul className="order-lines order-lines-pro">
          {order.items.map((line, i) => (
            <li key={`${line.name}-${i}`}>
              <span className="order-line-name">{line.name}</span>
              <span className="order-line-qty">× {line.quantity}</span>
              <span className="order-line-price">{formatPrice(line.unitPrice * line.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="order-totals order-totals-pro">
          <div className="order-totals-row">
            <span>Subtotal</span>
            <span>{formatPrice(order.orderAmount)}</span>
          </div>
          <div className="order-totals-row">
            <span>Shipping</span>
            <span>{formatPrice(order.shippingCharges)}</span>
          </div>
          <div className="order-totals-row order-totals-row-total">
            <strong>Total</strong>
            <strong>{formatPrice(order.totalAmount)}</strong>
          </div>
          <div className="order-totals-foot">
            <span className={`order-payment-pill order-payment-pill--${orderStatusTone(order.paymentStatus)}`}>
              Payment: {order.paymentStatus === 'COD' ? 'Cash on delivery' : order.paymentStatus}
            </span>
          </div>
        </div>

        <div className="order-whatsapp-cta">
          <p className="order-whatsapp-cta-text">
            Tap below to open WhatsApp with your order details. Review the message and press <strong>Send</strong>.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn order-whatsapp-btn btn-lift"
          >
            <MessageCircle size={20} aria-hidden />
            Notify us on WhatsApp
          </a>
        </div>
      </article>
    </>
  );
}

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderNo, setOrderNo] = useState(searchParams.get('order') || '');
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const landedFromCheckout = searchParams.get('placed') === '1';

  const runTrack = async (reference: string) => {
    const trimmed = reference.trim().replace(/\s+/g, '');
    if (!trimmed) {
      setError('Enter your order number');
      setOrder(null);
      return;
    }
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const found = await fetchTrackOrder(trimmed);
      setOrder(found);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not find that order';
      if (msg.includes('Unknown action') && msg.includes('trackOrder')) {
        setError(
          'Track order is not on your live Apps Script yet. Open Extensions → Apps Script, paste the latest Code.gs from this repo, then Deploy → Manage deployments → Edit → New version → Deploy.'
        );
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void runTrack(orderNo);
  };

  useEffect(() => {
    const fromUrl = searchParams.get('order')?.trim();
    if (fromUrl) {
      setOrderNo(fromUrl);
      void runTrack(fromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when landing with ?order=
  }, []);

  return (
    <section className="track-order-page">
      <div className="container track-order-wrap">
        <header className="track-order-header">
          <p className="account-eyebrow">Track order</p>
          <h1 className="track-order-title">Where is my order?</h1>
          <p className="track-order-sub text-muted">
            Enter the order number from your confirmation (e.g. <code>ORD-20260313-001</code>). Bill numbers
            work too.
          </p>
        </header>

        <form className="track-order-form auth-card" onSubmit={handleSubmit}>
          <label className="review-site-field" htmlFor="track-order-no">
            <span className="review-site-label">Order number</span>
            <input
              id="track-order-no"
              type="text"
              className="review-site-input"
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
              placeholder="ORD-YYYYMMDD-001"
              autoComplete="off"
              spellCheck={false}
            />
          </label>
          <button type="submit" className="btn btn-primary btn-lift" disabled={loading}>
            <PackageSearch size={18} aria-hidden />
            {loading ? 'Looking up…' : 'Track order'}
          </button>
        </form>

        {error && (
          <p className="track-order-error" role="alert">
            {error}
          </p>
        )}

        {order && <TrackOrderResult order={order} justPlaced={landedFromCheckout} />}

        <p className="track-order-foot text-muted">
          Signed in?{' '}
          <Link to="/account">View all orders in My account</Link>
        </p>
      </div>
    </section>
  );
}
