import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchMyOrders } from '../services/api';
import type { OrderRecord } from '../types/api';
import { formatPrice } from '../data/products';
import { RequireAuth } from '../components/RequireAuth';
import OrderTrackingTimeline from '../components/OrderTrackingTimeline';
import { formatPaymentStatusLabel } from '../config/orderStatus';

function profileInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function orderStatusTone(status: string): string {
  const s = status.toLowerCase();
  if (s.includes('deliver') && !s.includes('out for')) return 'success';
  if (s.includes('out for')) return 'pending';
  if (s.includes('dispatch')) return 'pending';
  if (s.includes('complete') || s.includes('paid') || s === 'cod') return 'success';
  if (s.includes('cancel') || s.includes('fail')) return 'danger';
  if (s.includes('ship') || s.includes('process') || s.includes('placed')) return 'neutral';
  return 'neutral';
}

function AccountContent() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const firstName = useMemo(() => {
    if (!user?.name) return 'there';
    return user.name.trim().split(/\s+/)[0] || user.name;
  }, [user?.name]);

  if (!user) return null;

  const profileFields = [
    { icon: User, label: 'Name', value: user.name },
    { icon: Phone, label: 'Mobile', value: user.mobile },
    { icon: Mail, label: 'Email', value: user.email },
    { icon: MapPin, label: 'Address', value: user.address },
  ];

  return (
    <section className="account-page">
      <div className="container">
        <header className="account-hero">
          <div className="account-hero-main">
            <p className="account-eyebrow">My account</p>
            <h1 className="account-hero-title">
              Welcome back, <span>{firstName}</span>
            </h1>
            <p className="account-hero-sub">View your profile and track every order in one place.</p>
          </div>
          <button type="button" className="btn btn-outline account-signout-btn" onClick={logout}>
            <LogOut size={18} aria-hidden />
            Sign out
          </button>
        </header>

        <div className="account-grid">
          <aside className="account-profile-col">
            <div className="account-card account-profile-card">
              <div className="account-profile-head">
                <div className="account-avatar" aria-hidden>
                  {profileInitials(user.name)}
                </div>
                <div>
                  <h2 className="account-card-title">Profile</h2>
                  <p className="account-card-sub">Details from your sign-up</p>
                </div>
              </div>

              <ul className="account-profile-list">
                {profileFields.map(({ icon: Icon, label, value }) => (
                  <li key={label} className="account-profile-row">
                    <span className="account-profile-icon" aria-hidden>
                      <Icon size={18} strokeWidth={1.75} />
                    </span>
                    <div className="account-profile-copy">
                      <span className="account-profile-label">{label}</span>
                      <span className="account-profile-value">{value || '—'}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <Link to="/shop" className="btn btn-primary btn-lift account-profile-cta">
                <ShoppingBag size={18} aria-hidden />
                Browse shop
              </Link>
            </div>
          </aside>

          <div className="account-orders-col">
            <div className="account-card account-orders-card">
              <div className="account-orders-head">
                <div className="account-orders-head-text">
                  <h2 className="account-card-title">Orders</h2>
                  <p className="account-card-sub">Bills and delivery status</p>
                </div>
                {!loading && orders.length > 0 && (
                  <span className="account-orders-count">
                    {orders.length} order{orders.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {loading && (
                <div className="account-orders-loading" aria-busy="true">
                  <div className="account-skeleton account-skeleton-lg" />
                  <div className="account-skeleton account-skeleton-md" />
                  <div className="account-skeleton account-skeleton-sm" />
                </div>
              )}

              {!loading && orders.length === 0 && (
                <div className="account-empty-orders">
                  <div className="account-empty-icon" aria-hidden>
                    <Package size={32} strokeWidth={1.5} />
                  </div>
                  <h3>No orders yet</h3>
                  <p className="text-muted">
                    When you checkout, your bills and order status will show up here.
                  </p>
                  <Link to="/shop" className="btn btn-primary btn-lift">
                    Start shopping
                  </Link>
                </div>
              )}

              <div className="order-list">
                {!loading &&
                  orders.map((order) => (
                    <article key={order.orderId} className="order-card order-card-pro">
                      <div className="order-card-head">
                        <div>
                          <strong className="order-card-id">Order #{order.orderId}</strong>
                          <p className="order-meta">
                            Bill {order.billNumber} · Ref {order.orderNumber}
                          </p>
                        </div>
                        <span
                          className={`order-status-badge order-status-badge--${orderStatusTone(order.orderStatus)}`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>

                      <OrderTrackingTimeline status={order.orderStatus || 'Order Placed'} />

                      <ul className="order-lines order-lines-pro">
                        {order.items.map((line) => (
                          <li key={line.productId}>
                            <span className="order-line-name">{line.name}</span>
                            <span className="order-line-qty">× {line.quantity}</span>
                            <span className="order-line-price">
                              {formatPrice(line.unitPrice * line.quantity)}
                            </span>
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
                          <span
                            className={`order-payment-pill order-payment-pill--${orderStatusTone(order.paymentStatus)}`}
                          >
                            Payment: {formatPaymentStatusLabel(order.paymentStatus)}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Account() {
  return (
    <RequireAuth>
      <AccountContent />
    </RequireAuth>
  );
}
