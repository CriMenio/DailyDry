import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { AdminPageHeader } from '../AdminFormUi';
import { adminUpdateOrderStatus } from '../../../services/api';
import { ORDER_TRACKING_STEPS } from '../../../config/orderStatus';
import type { OrderRecord } from '../../../types/api';
import { formatPrice } from '../../../data/products';
import { useToast } from '../../../context/ToastContext';

type Props = {
  orders: OrderRecord[];
  loading: boolean;
  onRefresh: () => void;
};

export default function AdminOnlineOrdersIndex({ orders, loading, onRefresh }: Props) {
  const { showToast } = useToast();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [draftStatus, setDraftStatus] = useState<Record<string, string>>({});

  const statusFor = (order: OrderRecord) =>
    draftStatus[order.orderNumber] ?? order.orderStatus ?? ORDER_TRACKING_STEPS[0];

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
          title="Online order tracking"
          description="Website checkout orders from Customer&Orders. Update status for customer tracking."
        />
        <div className="admin-index-actions">
          <button type="button" className="btn btn-outline btn-sm" onClick={onRefresh} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin-icon' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <p className="admin-index-loading admin-index-loading-block">Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="admin-index-empty">
          <h3>No online orders yet</h3>
          <p>Orders placed on the storefront appear here with bill number and line items.</p>
        </div>
      ) : (
        <div className="admin-online-orders">
          {orders.map((order) => (
            <article key={order.orderNumber} className="admin-online-order-card">
              <div className="admin-online-order-head">
                <div>
                  <strong>{order.orderNumber}</strong>
                  <span className="admin-online-order-meta">
                    Bill {order.billNumber} · {order.customerName} · {order.mobile}
                  </span>
                </div>
                <span className="admin-online-order-total">{formatPrice(order.totalAmount)}</span>
              </div>
              <ul className="admin-online-order-lines">
                {order.items.map((line, i) => (
                  <li key={`${line.name}-${i}`}>
                    {line.name} × {line.quantity}
                  </li>
                ))}
              </ul>
              <div className="admin-online-order-status-row">
                <label className="admin-online-status-label">
                  Order status
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
                  {savingId === order.orderNumber ? 'Saving…' : 'Update status'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
