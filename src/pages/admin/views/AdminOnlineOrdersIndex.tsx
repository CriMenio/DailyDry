import { useMemo, useState } from 'react';
import { Mail, MapPin, Phone, RefreshCw } from 'lucide-react';
import { AdminPageHeader } from '../AdminFormUi';
import { adminUpdateOrderStatus } from '../../../services/api';
import { formatPaymentStatusLabel, ORDER_TRACKING_STEPS } from '../../../config/orderStatus';
import { formatOrderPlacedAt } from '../../../config/orderDisplay';
import type { OrderRecord } from '../../../types/api';
import { formatPrice } from '../../../data/products';
import { useToast } from '../../../context/ToastContext';
import OrderTrackingTimeline from '../../../components/OrderTrackingTimeline';

type Props = {
  orders: OrderRecord[];
  loading: boolean;
  onRefresh: () => void;
};

export default function AdminOnlineOrdersIndex({ orders, loading, onRefresh }: Props) {
  const { showToast } = useToast();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [draftStatus, setDraftStatus] = useState<Record<string, string>>({});
  const [query, setQuery] = useState('');

  const statusFor = (order: OrderRecord) =>
    draftStatus[order.orderNumber] ?? order.orderStatus ?? ORDER_TRACKING_STEPS[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) => {
      const hay = [
        o.orderNumber,
        o.billNumber,
        o.customerName,
        o.mobile,
        o.email,
        o.address,
        o.paymentStatus,
        o.orderStatus,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [orders, query]);

  const saveStatus = async (order: OrderRecord) => {
    const next = statusFor(order);
    setSavingId(order.orderNumber);
    try {
      await adminUpdateOrderStatus(order.orderNumber, next);
      showToast(`Order ${order.orderNumber} → ${next}`);
      setDraftStatus((prev) => {
        const copy = { ...prev };
        delete copy[order.orderNumber];
        return copy;
      });
      onRefresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not update status', 'error');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="admin-card admin-card-flush">
      <div className="admin-index-toolbar">
        <AdminPageHeader
          title="Online orders (website)"
          description="Orders placed by customers at checkout (Customer&Orders sheet). View customer details and line items — change order status only. To add manual phone/walk-in orders, use CustomerOrder or RetailsOrder."
        />
        <div className="admin-index-actions admin-online-toolbar-actions">
          <input
            type="search"
            className="admin-online-search"
            placeholder="Search order, bill, name, mobile…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search online orders"
          />
          <button type="button" className="btn btn-outline btn-sm" onClick={onRefresh} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin-icon' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <p className="admin-index-loading admin-index-loading-block">Loading online orders…</p>
      ) : orders.length === 0 ? (
        <div className="admin-index-empty">
          <h3>No online orders yet</h3>
          <p>When a customer checks out on the website, the order appears here automatically.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-index-empty">
          <h3>No matches</h3>
          <p>Try another search or clear the filter.</p>
        </div>
      ) : (
        <div className="admin-online-orders">
          {filtered.map((order) => (
            <article key={order.orderNumber} className="admin-online-order-card">
              <div className="admin-online-order-head">
                <div>
                  <strong>{order.orderNumber}</strong>
                  <span className="admin-online-order-meta">
                    Bill {order.billNumber} · Placed on website
                    {formatOrderPlacedAt(order.orderPlacedAt)
                      ? ` · ${formatOrderPlacedAt(order.orderPlacedAt)}`
                      : ''}
                  </span>
                </div>
                <div className="admin-online-order-badges">
                  <span className="admin-online-badge admin-online-badge--payment">
                    {formatPaymentStatusLabel(order.paymentStatus)}
                  </span>
                  <span className="admin-online-order-total">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>

              <div className="admin-online-customer">
                <h4 className="admin-online-customer-title">Customer</h4>
                <ul className="admin-online-customer-list">
                  <li>
                    <strong>{order.customerName || '—'}</strong>
                  </li>
                  <li>
                    <Phone size={14} aria-hidden />
                    {order.mobile || '—'}
                  </li>
                  {order.email ? (
                    <li>
                      <Mail size={14} aria-hidden />
                      {order.email}
                    </li>
                  ) : null}
                  <li className="admin-online-customer-address">
                    <MapPin size={14} aria-hidden />
                    {order.address || '—'}
                  </li>
                </ul>
              </div>

              <div className="admin-online-items">
                <h4 className="admin-online-customer-title">Items</h4>
                <ul className="admin-online-order-lines">
                  {order.items.map((line, i) => (
                    <li key={`${line.name}-${i}`}>
                      <span>{line.name} × {line.quantity}</span>
                      <span>{formatPrice(line.unitPrice * line.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="admin-online-totals">
                  <div>
                    <span>Subtotal</span>
                    <span>{formatPrice(order.orderAmount)}</span>
                  </div>
                  <div>
                    <span>Shipping</span>
                    <span>{formatPrice(order.shippingCharges)}</span>
                  </div>
                </div>
              </div>

              <div className="admin-online-tracking">
                <OrderTrackingTimeline status={order.orderStatus || ORDER_TRACKING_STEPS[0]} />
              </div>

              <div className="admin-online-order-status-row">
                <label className="admin-online-status-label">
                  Update order status
                  <select
                    value={statusFor(order)}
                    onChange={(e) =>
                      setDraftStatus((prev) => ({ ...prev, [order.orderNumber]: e.target.value }))
                    }
                    disabled={savingId === order.orderNumber}
                  >
                    {ORDER_TRACKING_STEPS.map((step) => (
                      <option key={step} value={step}>
                        {step}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  className="btn btn-primary btn-sm btn-lift"
                  disabled={
                    savingId === order.orderNumber || statusFor(order) === (order.orderStatus || '')
                  }
                  onClick={() => saveStatus(order)}
                >
                  {savingId === order.orderNumber ? 'Saving…' : 'Save status'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
